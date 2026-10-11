import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const confirmResolveRef = useRef(null);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = "info", title = "") => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    
    // Default smart titles if none passed
    let toastTitle = title;
    if (!toastTitle) {
      if (type === "success") toastTitle = "Success";
      else if (type === "error") toastTitle = "Error";
      else if (type === "warning") toastTitle = "Warning";
      else toastTitle = "Notification";
    }

    const newToast = {
      id,
      message,
      type,
      title: toastTitle,
      createdAt: Date.now(),
      duration: 4000
    };

    setToasts((prev) => [...prev.slice(-4), newToast]); // Keep max 5 visible toasts

    // Auto dismiss
    setTimeout(() => {
      removeToast(id);
    }, 4000);

    return id;
  }, [removeToast]);

  const showSuccess = useCallback((message, title = "Success") => {
    return showToast(message, "success", title);
  }, [showToast]);

  const showError = useCallback((message, title = "Error") => {
    return showToast(message, "error", title);
  }, [showToast]);

  const showWarning = useCallback((message, title = "Warning") => {
    return showToast(message, "warning", title);
  }, [showToast]);

  const showInfo = useCallback((message, title = "Notification") => {
    return showToast(message, "info", title);
  }, [showToast]);

  // Modern Confirmation Modal Replacement for window.confirm
  const confirm = useCallback(({
    title = "Are you sure?",
    message = "Do you want to proceed with this action?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "danger"
  }) => {
    return new Promise((resolve) => {
      confirmResolveRef.current = resolve;
      setConfirmDialog({
        title,
        message,
        confirmText,
        cancelText,
        type
      });
    });
  }, []);

  const handleConfirmAction = (value) => {
    if (confirmResolveRef.current) {
      confirmResolveRef.current(value);
      confirmResolveRef.current = null;
    }
    setConfirmDialog(null);
  };

  // Safe global interceptor for window.alert and window.showToast
  useEffect(() => {
    window.showToast = (msg, type = "info", title = "") => showToast(msg, type, title);
    const originalAlert = window.alert;
    window.alert = (msg) => {
      if (!msg) return;
      const str = String(msg);
      let inferredType = "info";
      let inferredTitle = "Notice";
      if (str.toLowerCase().includes("success")) {
        inferredType = "success";
        inferredTitle = "Success";
      } else if (str.toLowerCase().includes("fail") || str.toLowerCase().includes("error") || str.toLowerCase().includes("invalid")) {
        inferredType = "error";
        inferredTitle = "Action Required";
      } else if (str.toLowerCase().includes("warning") || str.toLowerCase().includes("already") || str.toLowerCase().includes("please")) {
        inferredType = "warning";
        inferredTitle = "Notice";
      }
      showToast(str, inferredType, inferredTitle);
    };

    return () => {
      window.alert = originalAlert;
    };
  }, [showToast]);

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        removeToast,
        confirm
      }}
    >
      {children}

      {/* Floating Modern Toast Notifications Container */}
      <div
        aria-live="polite"
        className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm sm:max-w-md w-full pointer-events-none px-4"
      >
        {toasts.map((toast) => {
          let themeClasses = {
            border: "border-blue-200/80",
            bg: "bg-white/95",
            iconBg: "bg-blue-50 text-blue-600 border-blue-100",
            badge: "text-blue-700",
            bar: "bg-blue-500",
            icon: <Info className="w-5 h-5" />
          };

          if (toast.type === "success") {
            themeClasses = {
              border: "border-emerald-200/90",
              bg: "bg-white/95",
              iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
              badge: "text-emerald-700",
              bar: "bg-emerald-500",
              icon: <CheckCircle2 className="w-5 h-5" />
            };
          } else if (toast.type === "error") {
            themeClasses = {
              border: "border-rose-200/90",
              bg: "bg-white/95",
              iconBg: "bg-rose-50 text-rose-600 border-rose-100",
              badge: "text-rose-700",
              bar: "bg-rose-500",
              icon: <AlertCircle className="w-5 h-5" />
            };
          } else if (toast.type === "warning") {
            themeClasses = {
              border: "border-amber-200/90",
              bg: "bg-white/95",
              iconBg: "bg-amber-50 text-amber-600 border-amber-100",
              badge: "text-amber-700",
              bar: "bg-amber-500",
              icon: <AlertTriangle className="w-5 h-5" />
            };
          }

          return (
            <div
              key={toast.id}
              role="alert"
              className={`pointer-events-auto relative overflow-hidden rounded-2xl border ${themeClasses.border} ${themeClasses.bg} backdrop-blur-md p-4 shadow-xl shadow-slate-900/10 transition-all duration-300 animate-fadeIn`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${themeClasses.iconBg} shadow-xs`}
                >
                  {themeClasses.icon}
                </div>

                <div className="flex-1 pr-2">
                  {toast.title && (
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      {toast.title}
                    </h4>
                  )}
                  <p className="mt-0.5 text-sm font-medium text-slate-600 leading-snug">
                    {toast.message}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                  aria-label="Close notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Subtle Auto-dismiss timer line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100/60 overflow-hidden">
                <div
                  className={`h-full ${themeClasses.bar} transition-all duration-[4000ms] ease-linear w-full animate-shrinkWidth`}
                  style={{ animationDuration: `${toast.duration}ms` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Modern Confirmation Dialog Modal */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl shadow-slate-900/20">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-xs ${
                  confirmDialog.type === "danger"
                    ? "bg-rose-50 text-rose-600 border-rose-100"
                    : confirmDialog.type === "warning"
                    ? "bg-amber-50 text-amber-600 border-amber-100"
                    : "bg-blue-50 text-blue-600 border-blue-100"
                }`}
              >
                {confirmDialog.type === "danger" ? (
                  <AlertCircle className="w-6 h-6" />
                ) : confirmDialog.type === "warning" ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : (
                  <Info className="w-6 h-6" />
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-900">
                  {confirmDialog.title}
                </h3>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                  {confirmDialog.message}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => handleConfirmAction(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
              >
                {confirmDialog.cancelText}
              </button>
              <button
                type="button"
                onClick={() => handleConfirmAction(true)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition ${
                  confirmDialog.type === "danger"
                    ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                    : confirmDialog.type === "warning"
                    ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
                }`}
              >
                {confirmDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};
