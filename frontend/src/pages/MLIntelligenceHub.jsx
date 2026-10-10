import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  BrainCircuit,
  TrendingUp,
  Compass,
  ShieldCheck
} from "lucide-react";
import Navbar from "../components/Navbar";
import ClassificationView from "../components/ml/ClassificationView";
import RegressionView from "../components/ml/RegressionView";
import RecommendationView from "../components/ml/RecommendationView";
import FinalMatchView from "../components/ml/FinalMatchView";

const TABS = [
  {
    id: "classification",
    name: "Candidate Fit",
    icon: BrainCircuit,
    color: "blue"
  },
  {
    id: "regression",
    name: "Salary Prediction",
    icon: TrendingUp,
    color: "emerald"
  },
  {
    id: "recommendation",
    name: "Job Recommendation",
    icon: Compass,
    color: "purple"
  },
  {
    id: "final-match",
    name: "Final Match",
    icon: ShieldCheck,
    color: "cyan"
  }
];

const MLIntelligenceHub = ({ role }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const availableTabs = React.useMemo(() => {
    return TABS.filter((tab) => {
      if (role === "student") {
        return tab.id === "classification" || tab.id === "regression";
      }
      if (role === "recruiter") {
        return tab.id === "recommendation" || tab.id === "final-match";
      }
      return true;
    });
  }, [role]);

  const defaultTab = availableTabs.length > 0 ? availableTabs[0].id : "classification";
  const initialTab = searchParams.get("tab") || defaultTab;

  const [activeTab, setActiveTab] = useState(
    availableTabs.some((t) => t.id === initialTab) ? initialTab : defaultTab
  );

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && availableTabs.some((t) => t.id === tabParam)) {
      setActiveTab(tabParam);
    } else if (!availableTabs.some((t) => t.id === activeTab)) {
      setActiveTab(defaultTab);
    }
  }, [searchParams, availableTabs, activeTab, defaultTab]);

  const handleTabSelect = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      {/* Hero Header */}
      <section className="border-b border-slate-200 bg-white shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Vertex ML Intelligence Hub
              </h1>
              <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
                Interactive suite for candidate fit evaluation, salary prediction,
                skills-based role recommendations, and overall final matching.
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {availableTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabSelect(tab.id)}
                  className={`group relative flex flex-col items-start rounded-2xl border p-4 text-left transition-all duration-200 ${
                    isActive
                      ? "border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-500/20"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                  }`}
                >
                  <div className="mb-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 group-hover:bg-slate-200 group-hover:text-slate-900"
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                  </div>

                  <h3
                    className={`text-sm font-bold tracking-tight ${
                      isActive ? "text-blue-950" : "text-slate-800"
                    }`}
                  >
                    {tab.name}
                  </h3>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content View Container */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "classification" && <ClassificationView />}
        {activeTab === "regression" && <RegressionView />}
        {activeTab === "recommendation" && <RecommendationView />}
        {activeTab === "final-match" && <FinalMatchView />}
      </main>

      {/* Footer Info */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">VERTEX AI</span>
            <span>•</span>
            <span>All ML endpoints consume standardized project dropdowns</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/student/dashboard" className="hover:text-blue-600">
              Student Dashboard
            </Link>
            <Link to="/recruiter/dashboard" className="hover:text-blue-600">
              Recruiter Dashboard
            </Link>
            <Link to="/" className="hover:text-blue-600">
              Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MLIntelligenceHub;
