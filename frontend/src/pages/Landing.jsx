 import React from "react";
import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  UserRound,
} from "lucide-react";

import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">

      <Navbar />

      {/* HERO SECTION */}
      <section
        id="home"
        className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2"
      >

        {/* LEFT CONTENT */}
        <div>

          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
            <BrainCircuit size={17} />
            AI-Powered Internship Matching
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Find the Right

            <span className="block text-blue-600">
              Internship & Job
            </span>

            for You
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Connect your skills, education and experience with the right
            opportunities using intelligent candidate-role matching.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <Link
              to="/login"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/ml"
              className="flex items-center gap-2 rounded-lg border border-blue-600 bg-blue-50 px-6 py-3 font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <BrainCircuit size={18} />
              Try Vertex ML Models
            </Link>

            <Link
              to="/login"
              className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Login
            </Link>

          </div>

        </div>

        {/* RIGHT ILLUSTRATION */}
        <div className="relative flex justify-center">

          <div className="relative flex h-80 w-80 items-center justify-center rounded-full bg-blue-50">

            <div className="flex h-48 w-48 items-center justify-center rounded-3xl bg-white shadow-xl">
              <BrainCircuit
                size={100}
                strokeWidth={1.5}
                className="text-blue-600"
              />
            </div>

            <div className="absolute -left-4 top-10 flex items-center gap-2 rounded-xl bg-white p-3 shadow-lg">
              <UserRound size={20} className="text-blue-600" />

              <span className="text-sm font-medium">
                Student Profile
              </span>
            </div>

            <div className="absolute -right-8 top-24 flex items-center gap-2 rounded-xl bg-white p-3 shadow-lg">
              <BriefcaseBusiness size={20} className="text-blue-600" />

              <span className="text-sm font-medium">
                Job Matching
              </span>
            </div>

            <div className="absolute bottom-8 left-4 flex items-center gap-2 rounded-xl bg-white p-3 shadow-lg">
              <CheckCircle2 size={20} className="text-green-500" />

              <span className="text-sm font-medium">
                91% Fit
              </span>
            </div>

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="border-t border-slate-100 bg-slate-50 px-6 py-20"
      >

        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">

            <p className="font-semibold text-3xl text-blue-600">
              FEATURES
            </p>

            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              Smarter way to find opportunities
            </h2>

            <p className="mt-4 text-slate-600">
              InternMatch AI connects students and recruiters through
              intelligent matching.
            </p>

          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            {/* FEATURE 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                <BrainCircuit className="text-blue-600" />
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                AI Fit Score
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Get an intelligent compatibility score between your profile
                and a job opportunity.
              </p>

            </div>

            {/* FEATURE 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
                <BriefcaseBusiness className="text-purple-600" />
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                Personalized Matching
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Discover internships and jobs based on your skills,
                education and preferences.
              </p>

            </div>

            {/* FEATURE 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                <FileText className="text-green-600" />
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                Easy Applications
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Apply for opportunities and track your application status
                from one place.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* HOW IT WORKS */}
      <section
        id="how"
        className="mx-auto max-w-7xl px-6 py-20"
      >

        <div className="text-center">

          <p className="font-semibold text-3xl text-blue-600">
            HOW IT WORKS
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            From profile to opportunity
          </h2>

        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-4">

          <Step
            number="01"
            title="Create Profile"
            text="Add your skills, education and experience."
          />

          <Step
            number="02"
            title="AI Matching"
            text="Our ML model compares your profile with jobs."
          />

          <Step
            number="03"
            title="Apply"
            text="Find suitable jobs and apply with one click."
          />

          <Step
            number="04"
            title="Track"
            text="Track your application status from your dashboard."
          />

        </div>

      </section>

      {/* CTA */}
      <section className="px-6 pb-20">

        <div className="mx-auto max-w-5xl rounded-3xl bg-blue-600 px-8 py-14 text-center text-white">

          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to find your opportunity?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-blue-100">
            Create your profile and let AI help you discover opportunities
            that match your skills.
          </p>

          <Link
            to="/login"
            className="mt-7 inline-block rounded-lg bg-white px-7 py-3 font-semibold text-blue-600 hover:bg-blue-50"
          >
            Get Started
          </Link>

        </div>

      </section>

    </div>
  );
};

const Step = ({ number, title, text }) => {
  return (
    <div className="text-center">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
        {number}
      </div>

      <h3 className="mt-5 text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {text}
      </p>

    </div>
  );
};

export default Landing;