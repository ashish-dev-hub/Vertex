import React from "react";
import { ShieldAlert, KeyRound, AlertTriangle, ArrowRight, X, CheckCircle2 } from "lucide-react";

/**
 * Modern In-App Security Advisory Modal
 * Replaces ugly browser/Chrome password breach popups with a beautiful, branded,
 * glassmorphic InternMatch AI security alert.
 */
const SecurityAdvisoryModal = ({ isOpen, onClose, onContinue, email }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/80 bg-white p-7 shadow-2xl shadow-blue-900/20">
        {/* Subtle decorative glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-blue-200/40 blur-3xl" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {/* Header Illustration */}
        <div className="relative mb-6 flex items-center gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 bg-gradient-to-r from-amber-50 to-orange-50 shadow-md shadow-amber-500/10">
            <ShieldAlert size={32} className="text-amber-600 animate-pulse" />
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs">
              <AlertTriangle size={13} />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
              <KeyRound size={12} />
              Vertex Security Advisory
            </div>
            <h3 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900">
              Check Your Password Security
            </h3>
          </div>
        </div>

        {/* Message body */}
        <div className="space-y-3.5 text-sm leading-relaxed text-slate-600">
          <p>
            The password you used for{" "}
            <span className="font-semibold text-slate-800">{email || "your account"}</span>{" "}
            was detected in public security breach databases or is commonly compromised.
          </p>

          {/* Security Recommendations Card */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              InternMatch AI Security Recommendations
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Use at least 8 characters with a mix of numbers and letters.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Avoid simple personal names, dates, or sequences like 123456.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Keep your student profile and job applications securely protected.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-7 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition cursor-pointer shadow-xs"
          >
            I'll Change It Later
          </button>

          <button
            type="button"
            onClick={onContinue}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:from-blue-700 hover:to-indigo-700 transition cursor-pointer active:scale-[0.98]"
          >
            <span>Proceed to Dashboard</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityAdvisoryModal;
