import sys
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware

def comma_tokenizer(text):
  return [s.strip().lower() for s in str(text).split(',')]


current_module = sys.modules[__name__]
setattr(current_module, 'comma_tokenizer', comma_tokenizer)


app = FastAPI(
    title="Salary Prediction API",
    description="API for predicting candidate salaries using an XGBoost pipeline.",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


try:
    model = joblib.load('model.pkl')
except Exception as e:
    raise RuntimeError(f"Failed to load model.pkl. Ensure it's in the directory. Error: {e}")


class CandidateInput(BaseModel):
    years_experience: float = Field(..., example=3.0)
    education: str = Field(..., example="Bachelor's")
    candidate_skills: str = Field(..., example="Python, Machine Learning, SQL")
    job_title: str = Field(..., example="Data Scientist")
    industry: str = Field(..., example="Technology")
    company_size: str = Field(..., example="Medium")
    job_location: str = Field(..., example="Remote")
    work_mode: str = Field(..., example="Remote")
    candidate_preferred_work_mode: str = Field(..., example="Remote")
    required_skills: str = Field(..., example="Python, SQL")
    skill_coverage: float = Field(..., example=0.8)
    fit_label: str = Field(..., example="Good")
    student_career_label: str = Field(..., example="Data Science")
    student_cgpa: float = Field(..., example=8.5)
    student_internships: int = Field(..., example=2)
    student_github_repos: int = Field(..., example=5)
    student_hackathons_participated: int = Field(..., example=3)
    student_coding_platform_rating: float = Field(..., example=1500.0)
    student_weekly_study_hours: float = Field(..., example=20.0)
    student_experience_level: str = Field(..., example="Intermediate")


@app.get("/")
def read_root():
    return {"message": "Salary Prediction API is running!", "docs_url": "/docs"}

@app.post("/predict")
def predict_salary(data: CandidateInput):
    try:
       
        input_df = pd.DataFrame([data.dict()])
        
       
        prediction = model.predict(input_df)
        estimated_salary = float(prediction[0])
        
        return {
            "success": True,
            "estimated_salary": estimated_salary,
            "formatted_salary": f"${estimated_salary:,.2f}"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
