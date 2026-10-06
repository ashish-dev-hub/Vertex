 import React from "react";
import { BriefcaseBusiness } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
            <BriefcaseBusiness size={20} className="text-white" />
          </div>

          <span className="text-xl font-bold text-slate-900">
            InternMatch
            <span className="text-blue-600"> AI</span>
          </span>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">

          <Link
            to="/"
            className="text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            Home
          </Link>

          <a
            href="/#features"
            className="text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            Features
          </a>

          <a
            href="/#how"
            className="text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            How It Works
          </a>

        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">

          <Link
            to="/login"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Login
          </Link>

          <Link
            to="/login"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Sign Up
          </Link>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;