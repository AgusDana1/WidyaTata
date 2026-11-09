"use client";

import React from "react";
import { Cpu, Layers, HelpCircle, AlertTriangle } from "lucide-react";

export function Disclosure() {
  return (
    <section id="disclosure" className="no-print border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h2 className="text-base font-extrabold uppercase tracking-wider text-slate-800">
          AI &amp; Technology Disclosure
        </h2>
        <div className="mt-4 grid gap-4 text-xs sm:text-sm text-slate-700 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-1.5">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-blue-600" />
              AI di Dalam Aplikasi
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Teks proposal, rundown, pos RAB, hasil audit kelayakan, surat, dan
              LPJ dihasilkan oleh{" "}
              <strong>Google Gemini API (model gemini-3.1-flash-lite)</strong>{" "}
              yang dipanggil melalui backend Flask. Perhitungan total RAB dikunci
              secara deterministik oleh kode Python agar tepat 100% sesuai pagu.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-1.5">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-indigo-600" />
              Teknologi Modern Full-Stack
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Frontend dimigrasikan ke <strong>Next.js (React 19 &amp; TypeScript)</strong>{" "}
              dengan styling Tailwind CSS. Backend menggunakan Python Flask, SQLite
              untuk persistensi data, dan keamanan API Key yang tersimpan aman di
              environment variable server.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-1.5">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-emerald-600" />
              Bantuan AI dalam Pengembangan
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Arsitektur aplikasi dan kerangka kode disusun dengan bantuan
              asisten coding cerdas, kemudian ditinjau, diuji coba, dan
              dioptimasi secara menyeluruh oleh tim pengembang.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 space-y-1.5">
            <h3 className="font-bold text-amber-950 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Batasan Penggunaan &amp; Verifikasi
            </h3>
            <p className="text-xs leading-relaxed text-amber-900">
              Seluruh keluaran AI merupakan draf rekomendasi. Nominal, harga
              pasar riil, dan format persuratan wajib diperiksa dan disahkan
              oleh pengurus organisasi serta pembina sebelum digunakan secara resmi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
