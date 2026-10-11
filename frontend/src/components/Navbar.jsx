 import React, { useState } from "react";
import { BriefcaseBusiness, Menu, X, BrainCircuit } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3.5 sm:px-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 shadow-xs">
            <BriefcaseBusiness size={20} className="text-white" />
          </div>

          <span className="text-base sm:text-xl font-bold text-slate-900 whitespace-nowrap">
            InternMatch<span className="text-blue-600"> AI</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition"
          >
            Home
          </Link>

          <a
            href="/#features"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition"
          >
            Features
          </a>

          <a
            href="/#how"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition"
          >
            How It Works
          </a>

          <Link
            to="/ml"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            <BrainCircuit size={16} />
            Vertex ML
          </Link>
        </div>

        {/* Action Buttons & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            to="/login"
            className="rounded-lg border border-slate-300 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition whitespace-nowrap"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="rounded-lg bg-blue-600 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700 shadow-xs transition whitespace-nowrap"
          >
            Sign Up
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 md:hidden transition cursor-pointer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden animate-fadeIn space-y-1 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>
          <a
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Features
          </a>
          <a
            href="/#how"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            How It Works
          </a>
          <Link
            to="/ml"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
          >
            <BrainCircuit size={16} />
            Vertex ML Models
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;