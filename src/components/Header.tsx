"use client";

import React from "react";
import {
  FileSpreadsheet,
  ShieldCheck,
  FileText,
  BarChart3,
  Sparkles,
  Cpu,
} from "lucide-react";
import { ApiStatus } from "@/types";

export type TabType = "proposal" | "audit" | "document" | "dashboard";

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  status: ApiStatus | null;
  statusLoading: boolean;
}

export function Header({
  activeTab,
  onTabChange,
  status,
  statusLoading,
}: HeaderProps) {
  const tabs = [
    {
      id: "proposal" as TabType,
      label: "Proposal & RAB",
      icon: FileSpreadsheet,
      badge: "Architect",
    },
    {
      id: "audit" as TabType,
      label: "Audit Anggaran",
      icon: ShieldCheck,
      badge: "Feasibility",
    },
    {
      id: "document" as TabType,
      label: "Surat & LPJ",
      icon: FileText,
      badge: "Docs",
    },
    {
      id: "dashboard" as TabType,
      label: "Arsip & Analitik",
      icon: BarChart3,
      badge: "Database",
    },
  ];

  return (
    <header className="no-print relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-900 text-white shadow-xl">
      {/* Decorative backdrop glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 pb-4 pt-6 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300 ring-1 ring-blue-400/20 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span>Bali DigiFest 2026 | AI Web Innovation Challenge</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
              WidyaTata <span className="text-blue-400">AI</span>
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Tata kelola administrasi akademik, kepanitiaan kampus/sekolah, dan asisten anggaran cerdas berbasis kearifan lokal Bali.
            </p>
          </div>

          {/* AI Status Badge */}
          <div className="flex items-center">
            {statusLoading ? (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-blue-200 ring-1 ring-white/10">
                <span className="h-2 w-2 animate-ping rounded-full bg-blue-400" />
                <span>Memeriksa server...</span>
              </div>
            ) : status?.ai_configured ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/30">
                <Cpu className="h-3.5 w-3.5 text-emerald-400" />
                <span>Layanan AI Siap ({status.model})</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-200 ring-1 ring-amber-500/30">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span>API Key Gemini Belum Diatur</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav
          className="mt-6 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none"
          aria-label="Navigasi fitur"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`group flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-white text-blue-900 shadow-lg shadow-black/10 ring-1 ring-white/20"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon
                  className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                    isActive ? "text-blue-600" : "text-blue-300"
                  }`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
