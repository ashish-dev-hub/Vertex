import React from "react";
import { ChevronDown } from "lucide-react";

/**
 * Shared dropdown component adhering to Section 2 rules:
 * - Uses exact dropdown options supplied for the project
 * - Sends selected option exactly as shown (same spelling, spaces, hyphens)
 * - Shared across all forms
 */
const FormSelect = ({
  label,
  name,
  value,
  options = [],
  onChange,
  required = false,
  placeholder = "Select an option...",
  allowUnknown = false,
  disabled = false,
  error = "",
  helperText = ""
}) => {
  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={name}
          className="text-xs font-semibold uppercase tracking-wider text-slate-700"
        >
          {label}
          {required && <span className="ml-1 text-rose-500 font-bold">*</span>}
          {!required && (
            <span className="ml-1 text-[11px] font-normal text-slate-400">
              (Optional)
            </span>
          )}
        </label>
        {helperText && (
          <span className="text-[11px] text-slate-400">{helperText}</span>
        )}
      </div>

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value ?? ""}
          onChange={(e) => onChange(name, e.target.value)}
          disabled={disabled}
          className={`w-full appearance-none rounded-xl border bg-white px-3.5 py-2.5 pr-10 text-sm font-medium text-slate-800 shadow-xs transition-all duration-150 focus:outline-none focus:ring-2 ${
            error
              ? "border-rose-400 bg-rose-50/20 text-rose-900 focus:border-rose-500 focus:ring-rose-200"
              : "border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-100"
          } ${disabled ? "cursor-not-allowed bg-slate-100 text-slate-400" : ""}`}
        >
          <option value="" disabled className="text-slate-400">
            {placeholder}
          </option>
          {allowUnknown && !options.includes("Unknown") && (
            <option value="Unknown">Unknown (Default)</option>
          )}
          {options.map((opt) => (
            <option key={opt} value={opt} className="text-slate-800">
              {opt}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
          <ChevronDown size={16} />
        </div>
      </div>

      {error && (
        <p className="text-xs font-medium text-rose-500 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormSelect;
