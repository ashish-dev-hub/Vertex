import os
import re
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

MODEL_DIR = Path(os.getenv("MODEL_DIR", Path(__file__).resolve().parent.parent / "models"))

THRESHOLD = 0.5                                                  # suitability >= 0.5 => suitable
WEIGHTS = {"classifier": 0.50, "skill": 0.30, "salary": 0.20}
SALARY_MIN, SALARY_MAX = 2, 30                                   # salary range (LPA) used for the salary score

# supervised model
clf = joblib.load(MODEL_DIR / "xgboost_classifier_best.pkl")
reg = joblib.load(MODEL_DIR / "linear_regression_salary.pkl")

# recommender-(unsupervised)
model = joblib.load(MODEL_DIR / "recommender.pkl")
tfidf = model["tfidf"]
km = model["km"]
cluster_role = model["cluster_roles"]
jobs = model["jobs"]

job_lookup = {str(t).strip().lower(): (str(t), str(s))
              for t, s in zip(jobs["job_title"], jobs["required_skills"].fillna(""))}
job_titles = [v[0] for v in job_lookup.values()]


def recommand(user_skills, n):
    A = tfidf.transform([user_skills])
    cluster = int(km.predict(A)[0])
    recommended_titles = cluster_role.get(cluster, [])
    result = jobs[jobs["job_title"].isin(recommended_titles)].copy()
    if result.empty:
        result = jobs.copy()
    result_vecs = tfidf.transform(result["required_skills"].fillna(""))
    result["similarity_score"] = cosine_similarity(A, result_vecs)[0]
    result=result[result["similarity_score"]>0]
    return result.sort_values("similarity_score", ascending=False).head(n)


def get_fit_score(user_skills, target_job_title, job_skills=None):
    if job_skills is None:
        job_row = jobs[jobs["job_title"] == target_job_title]
        if job_row.empty:
            return 0.0
        job_skills = job_row["required_skills"].values[0]

    user_vec = tfidf.transform([user_skills])
    job_vec = tfidf.transform([job_skills])

    score = float(cosine_similarity(user_vec, job_vec)[0][0])
    return round(max(0.0, min(1.0, score)), 4)


def tokens(x):
    parts = x if isinstance(x, list) else re.split(r"[,;|\n]+", str(x or ""))
    return [str(p).strip().lower() for p in parts if str(p).strip()]


def skill_text(x):
    return ", ".join(x) if isinstance(x, list) else str(x or "")


def _num(v):
    if isinstance(v, list):
        return len(v)
    try:
        return float(v)
    except (TypeError, ValueError):
        return 0.0


def _cat(v):
    if v is None:
        return "Unknown"
    return ", ".join(map(str, v)) if isinstance(v, list) else str(v)


def prepare(data, pipe):
    df = pd.DataFrame([data])
    columns = []
    for name, _, cols in pipe.named_steps["preprocessor"].transformers_:
        if name == "remainder":
            continue
        for col in cols:
            if col not in df:
                df[col] = None
            df[col] = df[col].map(_num if name == "num" else _cat)
            columns.append(col)
    return df[columns]


def label(score):
    if score >= 0.75: return "Strong match"
    if score >= 0.55: return "Good match"
    if score >= 0.40: return "Moderate match"
    return "Weak match"


def get_classifier_score(data_row):
    return round(float(clf.predict_proba(prepare(data_row, clf))[0][1]), 4)


def get_salary(data_row):
    log_salary = reg.predict(prepare(data_row, reg))[0]
    return max(float(np.expm1(log_salary)), 0.0)


def salary_fit(salary):
    score = (salary - SALARY_MIN) / (SALARY_MAX - SALARY_MIN)
    return float(np.clip(score, 0, 1))


def get_job_skills(data):
    known = job_lookup.get(data.job_title.strip().lower())
    title = known[0] if known else data.job_title
    if data.required_skills:
        return title, skill_text(data.required_skills)
    if known:
        return title, known[1]
    raise ValueError(f"Unknown job_title '{data.job_title}'. Send required_skills or use one of {job_titles}")


def build_row(data, title, job_skills):
    needed = set(tokens(job_skills))
    common = set(tokens(data.candidate_skills)) & needed

    row = data.model_dump()
    row["job_title"] = title
    row["skill_overlap"] = len(common)
    row["skill_coverage"] = len(common) / len(needed) if needed else 0.0
    row["experience_gap"] = data.years_experience - data.required_experience
    if row["project_internship_score"] is None:
        row["project_internship_score"] = data.student_num_projects + 2 * data.student_internships
    if row["technical_activity_score"] is None:
        row["technical_activity_score"] = (data.student_github_repos
                                           + _num(data.student_hackathons_participated)
                                           + data.student_coding_platform_rating / 100)
    return row


def get_final_score(data):
    title, job_skills = get_job_skills(data)
    row = build_row(data, title, job_skills)

    suitability = get_classifier_score(row)
    salary = get_salary(row)
    salary_score = round(salary_fit(salary), 4)
    skill_score = get_fit_score(skill_text(data.candidate_skills), title, job_skills)

    w = WEIGHTS
    final = (w["classifier"] * suitability + w["skill"] * skill_score + w["salary"] * salary_score) / sum(w.values())
    suitable = suitability >= THRESHOLD

    return {
        "candidate_id": data.candidate_id,
        "job_title": title,
        "final_match": round(final, 4),
        "final_match_percentage": round(final * 100, 2),
        "match_label": label(final),
        "skill_overlap_percentage":skill_score,
        "suitable": suitable,
        "predicted_salary_lpa": round(salary, 2) if suitable else None,
        "scores": {"suitability": suitability, "salary": salary_score, "skill": skill_score},
    }