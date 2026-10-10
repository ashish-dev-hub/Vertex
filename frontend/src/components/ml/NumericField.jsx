import React from "react";

/**
 * Numeric field component adhering to Section 3:
 * Validation: non-negative values for experience, projects, internships,
 * GitHub repos, hackathons, coding rating; CGPA > 0; job_duration_months > 0; year_of_study >= 0.
 */
const NumericField = ({
  label,
  name,
  value,
  onChange,
  required = false,
  min = 0,
  max,
  step = 1,
  placeholder = "0",
  helperText = "",
  error = "",
  unit = ""
}) => {
  const handleChange = (e) => {
    const val = e.target.value;
    if (val === "") {
      onChange(name, "");
      return;
    }
    const parsed = step < 1 ? parseFloat(val) : parseInt(val, 10);
    onChange(name, isNaN(parsed) ? val : parsed);
  };

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
        <input
          id={name}
          name={name}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value ?? ""}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 shadow-xs transition-all duration-150 focus:outline-none focus:ring-2 ${
            unit ? "pr-12" : ""
          } ${
            error
              ? "border-rose-400 bg-rose-50/20 text-rose-900 focus:border-rose-500 focus:ring-rose-200"
              : "border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-100"
          }`}
        />
        {unit && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs font-semibold text-slate-400">
            {unit}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs font-medium text-rose-500 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
};

export default NumericField;
