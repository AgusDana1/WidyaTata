"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  isLoading: boolean;
  kind?: "proposal" | "audit" | "document" | null;
}

const LOADING_MSGS: Record<string, string[]> = {
  proposal: [
    "Menganalisis konteks kegiatan di Bali...",
    "Menyusun latar belakang dan tujuan SMART...",
    "Merancang susunan rundown acara WITA...",
    "Menghitung dan menyeimbangkan RAB agar sesuai pagu...",
  ],
  audit: [
    "Membaca pos rincian anggaran...",
    "Membandingkan dengan standar harga wajar di Bali...",
    "Mendeteksi item krusial dan pos kearifan lokal yang terlewat...",
    "Menyusun rekomendasi optimasi anggaran berurutan...",
  ],
  document: [
    "Menyusun format struktur persuratan resmi...",
    "Menulis draf isi dokumen formal...",
    "Menyesuaikan etika bahasa dan placeholder...",
  ],
};

export function LoadingOverlay({ isLoading, kind }: LoadingOverlayProps) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setMsgIndex(0);
      return;
    }
    const msgs = (kind && LOADING_MSGS[kind]) || ["AI sedang memproses..."];
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % msgs.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [isLoading, kind]);

  if (!isLoading) return null;

  const msgs = (kind && LOADING_MSGS[kind]) || ["AI sedang memproses data..."];
  const currentMsg = msgs[msgIndex % msgs.length];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm transition-all"
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <p className="mt-4 text-sm font-bold text-slate-800 transition-all min-h-[40px] flex items-center justify-center">
          {currentMsg}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Biasanya membutuhkan 10-30 detik. Mohon tunggu.
        </p>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-blue-100">
          <div className="animate-sweep h-full w-1/3 rounded-full bg-blue-600" />
        </div>
      </div>
    </div>
  );
}
