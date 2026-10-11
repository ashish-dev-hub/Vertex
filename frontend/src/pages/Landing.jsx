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
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">

      <Navbar />

      {/* HERO SECTION */}
      <section
        id="home"
        className="mx-auto grid max-w-7xl items-center gap-8 lg:gap-12 px-4 sm:px-6 py-8 sm:py-16 md:py-20 md:grid-cols-2"
      >

        {/* LEFT CONTENT */}
        <div>

          <div className="mb-4 sm:mb-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-blue-600">
            <BrainCircuit size={16} />
            AI-Powered Internship Matching
          </div>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl text-slate-900">
            Find the Right{" "}
            <span className="block text-blue-600">
              Internship & Job
            </span>
            for You
          </h1>

          <p className="mt-4 sm:mt-6 max-w-xl text-sm sm:text-lg leading-6 sm:leading-8 text-slate-600">
            Connect your skills, education and experience with the right
            opportunities using intelligent candidate-role matching.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/ml"
              className="flex items-center justify-center gap-2 rounded-xl border border-blue-600 bg-blue-50 px-5 py-3 text-sm sm:text-base font-semibold text-blue-700 hover:bg-blue-100 transition"
            >
              <BrainCircuit size={18} />
              Try Vertex ML Models
            </Link>

            <Link
              to="/login"
              className="flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm sm:text-base font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Login
            </Link>

          </div>

        </div>

        {/* RIGHT ILLUSTRATION */}
        <div className="relative flex justify-center py-4 sm:py-0 overflow-visible">

          <div className="relative flex h-64 w-64 sm:h-80 sm:w-80 items-center justify-center rounded-full bg-blue-50">

            <div className="flex h-36 w-36 sm:h-48 sm:w-48 items-center justify-center rounded-3xl bg-white shadow-xl">
              <BrainCircuit
                size={70}
                strokeWidth={1.5}
                className="text-blue-600 sm:hidden"
              />
              <BrainCircuit
                size={100}
                strokeWidth={1.5}
                className="text-blue-600 hidden sm:block"
              />
            </div>

            <div className="absolute -left-2 sm:-left-4 top-4 sm:top-10 flex items-center gap-1.5 sm:gap-2 rounded-xl bg-white p-2 sm:p-3 shadow-lg">
              <UserRound size={18} className="text-blue-600" />

              <span className="text-xs sm:text-sm font-medium">
                Student Profile
              </span>
            </div>

            <div className="absolute -right-2 sm:-right-6 top-16 sm:top-24 flex items-center gap-1.5 sm:gap-2 rounded-xl bg-white p-2 sm:p-3 shadow-lg">
              <BriefcaseBusiness size={18} className="text-blue-600" />

              <span className="text-xs sm:text-sm font-medium">
                Job Matching
              </span>
            </div>

            <div className="absolute bottom-4 sm:bottom-8 left-2 sm:left-4 flex items-center gap-1.5 sm:gap-2 rounded-xl bg-white p-2 sm:p-3 shadow-lg">
              <CheckCircle2 size={18} className="text-green-500" />

              <span className="text-xs sm:text-sm font-medium">
                91% Fit
              </span>
            </div>

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="border-t border-slate-100 bg-slate-50 px-4 sm:px-6 py-12 sm:py-20"
      >

        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">

            <p className="font-semibold text-2xl sm:text-3xl text-blue-600 tracking-wider">
              FEATURES
            </p>

            <h2 className="mt-2 text-2xl sm:text-3xl font-bold md:text-4xl">
              Smarter way to find opportunities
            </h2>

            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600">
              InternMatch AI connects students and recruiters through
              intelligent matching.
            </p>

          </div>

          <div className="mt-8 sm:mt-12 grid gap-6 md:grid-cols-3">

            {/* FEATURE 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                <BrainCircuit className="text-blue-600" />
              </div>

              <h3 className="mt-4 sm:mt-5 text-lg sm:text-xl font-semibold">
                AI Fit Score
              </h3>

              <p className="mt-2 sm:mt-3 leading-6 sm:leading-7 text-sm sm:text-base text-slate-600">
                Get an intelligent compatibility score between your profile
                and a job opportunity.
              </p>

            </div>

            {/* FEATURE 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
                <BriefcaseBusiness className="text-purple-600" />
              </div>

              <h3 className="mt-4 sm:mt-5 text-lg sm:text-xl font-semibold">
                Personalized Matching
              </h3>

              <p className="mt-2 sm:mt-3 leading-6 sm:leading-7 text-sm sm:text-base text-slate-600">
                Discover internships and jobs based on your skills,
                education and preferences.
              </p>

            </div>

            {/* FEATURE 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                <FileText className="text-green-600" />
              </div>

              <h3 className="mt-4 sm:mt-5 text-lg sm:text-xl font-semibold">
                Easy Applications
              </h3>

              <p className="mt-2 sm:mt-3 leading-6 sm:leading-7 text-sm sm:text-base text-slate-600">
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
        className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20"
      >

        <div className="text-center">

          <p className="font-semibold text-2xl sm:text-3xl text-blue-600 tracking-wider">
            HOW IT WORKS
          </p>

          <h2 className="mt-2 text-2xl sm:text-3xl font-bold">
            From profile to opportunity
          </h2>

        </div>

        <div className="mt-8 sm:mt-12 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">

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
      <section className="px-4 sm:px-6 pb-12 sm:pb-20">

        <div className="mx-auto max-w-5xl rounded-3xl bg-blue-600 px-6 py-10 sm:px-8 sm:py-14 text-center text-white shadow-xl shadow-blue-600/10">

          <h2 className="text-2xl sm:text-3xl font-bold md:text-4xl">
            Ready to find your opportunity?
          </h2>

          <p className="mx-auto mt-3 sm:mt-4 max-w-xl text-sm sm:text-base text-blue-100">
            Create your profile and let AI help you discover opportunities
            that match your skills.
          </p>

          <Link
            to="/login"
            className="mt-6 sm:mt-7 inline-block rounded-xl bg-white px-7 py-3 text-sm sm:text-base font-semibold text-blue-600 shadow-md hover:bg-blue-50 transition"
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