import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, WifiOff, RotateCcw } from "lucide-react";

/**
 * Status Banner implementing Section 9 Loading, Errors, Checklist:
 * - 200 OK: Prediction completed.
 * - 422: Check required fields and formats. (Keeps values; shows validation errors)
 * - 500: Prediction service error. Try again later. (Keeps values; shows retry option)
 * - Network/timeout: Unable to connect. Check connection. (Keeps values; shows retry option)
 */
const StatusBanner = ({
  status, // "success" | "validation" | "server_error" | "network" | null
  message,
  details,
  fieldErrors = [],
  onRetry,
  onDismiss
}) => {
  if (!status) return null;

  if (status === "success") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-emerald-900 shadow-xs">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-emerald-900">
            {message || "Prediction completed."}
          </p>
          {details && (
            <p className="mt-0.5 text-xs text-emerald-700">{details}</p>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-emerald-600 hover:text-emerald-800 text-xs font-medium"
          >
            Dismiss
          </button>
        )}
      </div>
    );
  }

  if (status === "validation") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/95 p-4 text-amber-900 shadow-xs">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-900">
            {message || "Check required fields and formats."}
          </p>
          {details && (
            <p className="mt-1 text-xs text-amber-800 font-mono bg-amber-100/60 p-2 rounded-lg">
              {details}
            </p>
          )}
          {Array.isArray(fieldErrors) && fieldErrors.length > 0 && (
            <div className="mt-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">
                Fields needing attention:
              </span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {fieldErrors.map((f, i) => (
                  <span
                    key={i}
                    className="rounded bg-amber-200/80 px-2 py-0.5 text-xs font-mono font-medium text-amber-900"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (status === "server_error") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/95 p-4 text-rose-900 shadow-xs">
        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-rose-900">
            {message || "Prediction service error. Try again later."}
          </p>
          {details && (
            <p className="mt-1 text-xs text-rose-700">{details}</p>
          )}
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-rose-700 transition"
          >
            <RotateCcw size={12} />
            Retry
          </button>
        )}
      </div>
    );
  }

  if (status === "network") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50/95 p-4 text-sky-900 shadow-xs">
        <WifiOff className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-sky-900">
            {message || "Unable to connect. Check connection."}
          </p>
          {details && (
            <p className="mt-1 text-xs text-sky-700">{details}</p>
          )}
          <p className="mt-1 text-[11px] text-sky-600">
            Ensure backend is running at <code className="bg-sky-100 px-1 py-0.5 rounded font-mono">http://localhost:5000</code>.
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-sky-700 transition"
          >
            <RotateCcw size={12} />
            Retry
          </button>
        )}
      </div>
    );
  }

  return null;
};

export default StatusBanner;
