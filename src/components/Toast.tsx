"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-300 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-red-300 shrink-0" />,
    info: <Info className="h-5 w-5 text-sky-300 shrink-0" />,
  };

  const bgStyles = {
    success: "bg-emerald-800 text-emerald-50 border-emerald-700/50",
    error: "bg-red-800 text-red-50 border-red-700/50",
    info: "bg-slate-900 text-slate-50 border-slate-700/50",
  };

  return (
    <div className="fixed bottom-5 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 animate-in slide-in-from-bottom-5 duration-200">
      <div
        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-md ${
          bgStyles[toast.type]
        }`}
        role="alert"
      >
        {icons[toast.type]}
        <p className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
          {toast.text}
        </p>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-slate-300 hover:bg-white/10 hover:text-white transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
