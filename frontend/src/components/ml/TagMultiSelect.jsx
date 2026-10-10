import React, { useState } from "react";
import { X, Plus, Sparkles } from "lucide-react";

/**
 * Free text / skills tag input component
 * Recommended component in Section 3 for:
 * - candidate_skills
 * - Recommendation skills
 * - student_interests
 */
const TagMultiSelect = ({
  label,
  name,
  value = "",
  onChange,
  required = false,
  placeholder = "Type and press Enter or comma...",
  suggestions = [],
  error = "",
  helperText = ""
}) => {
  const [inputValue, setInputValue] = useState("");

  // Convert comma-separated string to list of non-empty tags
  const tags = value
    ? value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const addTag = (newTag) => {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    if (tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setInputValue("");
      return;
    }
    const updated = [...tags, trimmed].join(", ");
    onChange(name, updated);
    setInputValue("");
  };

  const removeTag = (indexToRemove) => {
    const updated = tags.filter((_, idx) => idx !== indexToRemove).join(", ");
    onChange(name, updated);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
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

      <div
        className={`min-h-[46px] w-full rounded-xl border bg-white p-2 transition-all duration-150 focus-within:ring-2 ${
          error
            ? "border-rose-400 bg-rose-50/20 focus-within:border-rose-500 focus-within:ring-rose-200"
            : "border-slate-200 hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-blue-100"
        }`}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          {tags.map((tag, idx) => (
            <span
              key={`${tag}-${idx}`}
              className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 border border-blue-100"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(idx)}
                className="rounded-full p-0.5 text-blue-400 hover:bg-blue-100 hover:text-blue-700 focus:outline-none"
              >
                <X size={12} />
              </button>
            </span>
          ))}

          <input
            id={name}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (inputValue.trim()) addTag(inputValue);
            }}
            placeholder={tags.length === 0 ? placeholder : "Add more..."}
            className="min-w-[120px] flex-1 bg-transparent px-1.5 py-1 text-sm text-slate-800 placeholder-slate-400 outline-none"
          />
        </div>
      </div>

      {suggestions && suggestions.length > 0 && (
        <div className="pt-1">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
            <Sparkles size={12} className="text-amber-500" />
            <span>Popular suggestions:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {suggestions
              .filter(
                (s) => !tags.some((t) => t.toLowerCase() === s.toLowerCase())
              )
              .slice(0, 7)
              .map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => addTag(sug)}
                  className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <Plus size={10} />
                  {sug}
                </button>
              ))}
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs font-medium text-rose-500 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
};

export default TagMultiSelect;
