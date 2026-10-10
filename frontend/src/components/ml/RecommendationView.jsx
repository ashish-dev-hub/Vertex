import React, { useState } from "react";
import {
  Compass,
  Sparkles,
  RotateCcw,
  Send,
  Code,
  Briefcase,
  Layers,
  Inbox,
  Award
} from "lucide-react";
import { getRecommendation, extractData, parseApiError } from "../../api/ml";
import {
  COMMON_SKILLS_SUGGESTIONS,
  SAMPLE_PAYLOADS
} from "../../constants/mlOptions";
import TagMultiSelect from "./TagMultiSelect";
import StatusBanner from "./StatusBanner";

const RecommendationView = () => {
  const [skills, setSkills] = useState("Python, Machine Learning, SQL");
  const [topN, setTopN] = useState(5);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);
  const [results, setResults] = useState(null); // Array of recommendations
  const [rawResponse, setRawResponse] = useState(null);
  const [showRawJson, setShowRawJson] = useState(false);

  const handleLoadSample = () => {
    setSkills(SAMPLE_PAYLOADS.recommendation.skills);
    setTopN(SAMPLE_PAYLOADS.recommendation.top_n);
    setError("");
    setApiStatus(null);
  };

  const handleReset = () => {
    setSkills("");
    setTopN(5);
    setResults(null);
    setRawResponse(null);
    setApiStatus(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!skills || skills.trim() === "") {
      setError("Please enter or select at least one skill.");
      setApiStatus({
        status: "validation",
        message: "Check required fields and formats.",
        details: "skills field must be a non-empty string."
      });
      return;
    }

    setLoading(true);
    setApiStatus(null);
    setError("");

    const payload = {
      skills: skills.trim(),
      top_n: Number(topN) || 5
    };

    try {
      const response = await getRecommendation(payload);
      setRawResponse(response);
      const data = extractData(response);
      // Ensure data is array or extract array from data.recommendations
      const items = Array.isArray(data)
        ? data
        : Array.isArray(data?.recommendations)
        ? data.recommendations
        : [];
      setResults(items);
      setApiStatus({
        status: "success",
        message: "Prediction completed.",
        details: `Successfully discovered ${items.length} relevant role recommendations.`
      });
    } catch (err) {
      const parsed = parseApiError(err);
      setApiStatus(parsed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header banner */}
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-transparent p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Job Recommendation
            </h2>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl">
              Discovers matched job titles and role descriptions aligned with your
              skills and profile.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleLoadSample}
              className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-white px-3.5 py-2 text-xs font-semibold text-purple-800 shadow-xs hover:bg-purple-50 hover:border-purple-300 transition"
            >
              <Sparkles size={14} className="text-amber-500" />
              Load Example Data
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-xs hover:bg-slate-50 transition"
            >
              <RotateCcw size={13} />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Status banner */}
      <StatusBanner
        status={apiStatus?.status}
        message={apiStatus?.message}
        details={apiStatus?.details}
        onRetry={handleSubmit}
        onDismiss={() => setApiStatus(null)}
      />

      {/* Input Form Card */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-9">
            <TagMultiSelect
              label="Candidate Skills"
              name="skills"
              value={skills}
              onChange={(_, val) => setSkills(val)}
              required
              placeholder="e.g. Python, Machine Learning, SQL..."
              suggestions={COMMON_SKILLS_SUGGESTIONS}
              helperText="Type skill and press Enter or click from suggestions"
              error={error}
            />
          </div>

          <div className="md:col-span-3 space-y-1.5">
            <label
              htmlFor="top_n"
              className="text-xs font-semibold uppercase tracking-wider text-slate-700"
            >
              Top Matches (top_n)
            </label>
            <select
              id="top_n"
              value={topN}
              onChange={(e) => setTopN(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-800 shadow-xs focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
            >
              <option value={3}>Top 3 Results</option>
              <option value={5}>Top 5 Results (Default)</option>
              <option value={8}>Top 8 Results</option>
              <option value={10}>Top 10 Results</option>
            </select>
            <span className="block text-[11px] text-slate-400">
              Number of roles to retrieve
            </span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Matched across available internship profiles
          </span>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 disabled:opacity-50 transition"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Finding Matches...</span>
              </>
            ) : (
              <>
                <Send size={15} />
                <span>Find Recommended Jobs</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Results Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="text-purple-600" size={18} />
            <h3 className="font-bold text-slate-900">
              Recommended Job Matches{" "}
              {results && `(${results.length} found)`}
            </h3>
          </div>
        </div>

        {/* Note specified in Section 6:
            "Scores are similarity measures, not hiring probabilities. Handle an empty array." */}
        <p className="text-xs text-slate-500 italic">
          Note: Similarity scores represent mathematical vector distance matches, not hiring probabilities.
        </p>


        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-3 border-purple-600 border-t-transparent" />
            <p className="mt-4 text-sm font-semibold text-slate-700">
              Matching candidate skills with job corpus...
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Calling POST /api/ml/recommendation
            </p>
          </div>
        )}

        {!loading && !results && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center text-slate-400">
            <Compass className="mx-auto h-12 w-12 text-slate-300" strokeWidth={1.5} />
            <p className="mt-3 text-sm font-medium text-slate-600">
              No recommendations generated yet
            </p>
            <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
              Enter your technical skills above and click "Find Recommended Jobs" to see matching roles.
            </p>
          </div>
        )}

        {!loading && results && results.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400 shadow-xs">
            <Inbox className="mx-auto h-12 w-12 text-slate-300" strokeWidth={1.5} />
            <p className="mt-3 text-base font-semibold text-slate-700">
              No matching jobs found
            </p>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Try adding broader skills such as "Python", "SQL", or "Data Analysis".
            </p>
          </div>
        )}

        {/* List of cards */}
        {!loading && results && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fadeIn">
            {results.map((item, index) => {
              const scorePercent =
                typeof item.similarity_score === "number"
                  ? Math.round(item.similarity_score * 100)
                  : null;

              return (
                <div
                  key={`${item.job_title}-${index}`}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md hover:border-purple-200 transition-all duration-200"
                >
                  <div>
                    {/* Header: Title and Rank */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-700 font-bold text-xs">
                          #{index + 1}
                        </div>
                        <h4 className="text-base font-bold text-slate-900 leading-tight">
                          {item.job_title}
                        </h4>
                      </div>

                      {/* Similarity Score Badge */}
                      <span className="shrink-0 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-bold text-purple-800 border border-purple-200">
                        {scorePercent !== null ? `${scorePercent}% Match` : "Match"}
                      </span>
                    </div>

                    {/* Similarity score meter */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span>Similarity Score</span>
                        <span className="font-mono font-semibold text-slate-700">
                          {typeof item.similarity_score === "number"
                            ? item.similarity_score.toFixed(4)
                            : item.similarity_score}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                0,
                                (Number(item.similarity_score) || 0) * 100
                              )
                            )}%`
                          }}
                        />
                      </div>
                    </div>

                    {/* Required Skills */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Required Skills
                      </span>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {typeof item.required_skills === "string" ? (
                          item.required_skills
                            .split(",")
                            .map((s, sIdx) => (
                              <span
                                key={sIdx}
                                className="rounded-md bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600 border border-slate-200/60"
                              >
                                {s.trim()}
                              </span>
                            ))
                        ) : Array.isArray(item.required_skills) ? (
                          item.required_skills.map((s, sIdx) => (
                            <span
                              key={sIdx}
                              className="rounded-md bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600 border border-slate-200/60"
                            >
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-500">
                            {String(item.required_skills || "Not specified")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Award size={13} className="text-purple-500" />
                      Role Match
                    </span>
                    <span>Vertex ML</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationView;
