"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  Printer,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
} from "lucide-react";
import { AuditRecord } from "@/types";
import { fmtRp, fmtDate } from "@/lib/utils";
import { ScoreGauge } from "./ScoreGauge";

interface AuditTabProps {
  onAudit: (data: {
    nama_kegiatan: string;
    deskripsi: string;
    rincian: string;
  }) => Promise<AuditRecord>;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

const DEMO_AUDITS = [
  {
    label: "Workshop AI & Web Dev (Pos krusial banyak terlewat)",
    data: {
      nama_kegiatan: "Workshop Teknologi AI & Web Development Mahasiswa se-Bali",
      deskripsi:
        "Workshop 2 hari di Denpasar untuk 120 mahasiswa se-Bali dengan pagu tersedia Rp 15.000.000.",
      rincian:
        "Sewa aula kampus 2 hari: 2 x Rp 1.500.000 = Rp 3.000.000\nKonsumsi peserta (nasi kotak + snack) 120 orang x 2 hari x Rp 30.000 = Rp 7.200.000\nHonor pemateri 3 orang x Rp 1.000.000 = Rp 3.000.000\nCetak banner & spanduk = Rp 500.000\nSertifikat 120 lembar x Rp 5.000 = Rp 600.000\nTotal = Rp 14.300.000",
    },
  },
  {
    label: "Kemah Bakti Pramuka (Anggaran melonjak melebihi pagu)",
    data: {
      nama_kegiatan: "Kemah Bakti & Lomba Tingkat Pramuka Penegak/Penggalang",
      deskripsi:
        "Perkemahan 3 hari di Badung untuk 200 peserta. Pagu tersedia hanya Rp 25.000.000.",
      rincian:
        "Sewa lahan perkemahan 3 hari = Rp 4.000.000\nKonsumsi 200 peserta x 3 hari x Rp 45.000 = Rp 27.000.000\nHadiah lomba = Rp 3.000.000\nTransport pembina = Rp 2.500.000\nSewa tenda & perlengkapan = Rp 5.000.000\nTotal = Rp 41.500.000",
    },
  },
  {
    label: "Festival Inovasi & Seni Pelajar (Anggaran mendekati pas)",
    data: {
      nama_kegiatan: "Festival Inovasi Kreatif & Pentas Seni Pelajar SMA/SMK",
      deskripsi:
        "Festival 2 hari di Gianyar untuk 300 pelajar dengan pagu Rp 20.000.000.",
      rincian:
        "Sewa sound system & panggung 2 hari = Rp 9.000.000\nHonor MC & juri = Rp 2.000.000\nKonsumsi panitia 40 orang x 2 hari x Rp 25.000 = Rp 2.000.000\nHadiah juara lomba = Rp 4.000.000\nDekorasi & backdrop = Rp 2.500.000\nDana tak terduga = Rp 500.000\nTotal = Rp 20.000.000",
    },
  },
];

export function AuditTab({ onAudit, onSuccess, onError }: AuditTabProps) {
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [rincian, setRincian] = useState("");

  const [loading, setLoading] = useState(false);
  const [resultRecord, setResultRecord] = useState<AuditRecord | null>(null);

  const handleDemo = (d: (typeof DEMO_AUDITS)[0]["data"]) => {
    setNama(d.nama_kegiatan);
    setDeskripsi(d.deskripsi);
    setRincian(d.rincian);
    onSuccess("Contoh draf anggaran dimuat ke formulir.");
  };

  const handleReset = () => {
    setNama("");
    setDeskripsi("");
    setRincian("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      onError("Nama kegiatan wajib diisi.");
      return;
    }
    if (rincian.trim().length < 20) {
      onError("Rincian draf anggaran terlalu singkat untuk diaudit.");
      return;
    }

    setLoading(true);
    try {
      const rec = await onAudit({
        nama_kegiatan: nama.trim(),
        deskripsi: deskripsi.trim(),
        rincian: rincian.trim(),
      });
      setResultRecord(rec);
      onSuccess("Anggaran berhasil diaudit dan tersimpan ke arsip.");
    } catch (err: any) {
      onError(err.message || "Gagal mengaudit anggaran.");
    } finally {
      setLoading(false);
    }
  };

  const r = resultRecord?.result;

  const renderBadge = (text: string) => {
    const t = String(text).toLowerCase();
    let style = "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (/tinggi|boros|tidak layak|revisi besar/.test(t)) {
      style = "bg-red-100 text-red-800 border-red-200";
    } else if (/sedang|rendah|terlalu rendah|perbaikan/.test(t)) {
      style = "bg-amber-100 text-amber-800 border-amber-200";
    }
    return (
      <span
        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold border ${style}`}
      >
        {text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Form Card */}
      <div className="card-box no-print">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            <span>AI Budget &amp; Feasibility Auditor</span>
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Tempelkan rancangan anggaran kepanitiaan Anda. AI akan menilai
            kelayakan (0-100), efisiensi biaya, serta mendeteksi item krusial
            yang terlewat.
          </p>
        </div>

        {/* Demo Buttons */}
        <div className="mt-4">
          <p className="lbl">Pilih Studi Kasus Audit (Demo Juri):</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {DEMO_AUDITS.map((demo, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleDemo(demo.data)}
                className="btn-demo"
              >
                <span className="text-xs font-bold text-sky-800">
                  Muat Contoh Input Cepat
                </span>
                <span className="mt-1 text-xs text-slate-600 line-clamp-2">
                  {demo.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Audit Form */}
        <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
          <div>
            <label className="lbl" htmlFor="a_nama">
              Nama Kegiatan *
            </label>
            <input
              id="a_nama"
              className="field"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Workshop Teknologi AI Mahasiswa se-Bali"
              maxLength={150}
              required
            />
          </div>

          <div>
            <label className="lbl" htmlFor="a_desc">
              Deskripsi Singkat Acara &amp; Ketersediaan Dana
            </label>
            <textarea
              id="a_desc"
              rows={2}
              className="field"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Jelaskan skala acara, jumlah peserta, lokasi, dan pagu dana yang dimiliki..."
            />
          </div>

          <div>
            <label className="lbl" htmlFor="a_rincian">
              Rincian Draf Anggaran (Satu pos per baris) *
            </label>
            <textarea
              id="a_rincian"
              rows={8}
              className="field font-mono text-xs leading-relaxed"
              value={rincian}
              onChange={(e) => setRincian(e.target.value)}
              placeholder="Sewa aula kampus 2 hari = Rp 3.000.000&#10;Konsumsi 100 orang x 2 hari = Rp 6.000.000&#10;Honor juri/pemateri = Rp 2.500.000..."
              required
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              <Sparkles className="h-4 w-4" />
              <span>{loading ? "Mengaudit..." : "Audit Anggaran dengan AI"}</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Kosongkan Form</span>
            </button>
          </div>
        </form>
      </div>

      {/* Result Section */}
      {resultRecord && r && (
        <article className="card-box space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="no-print flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Audit Anggaran Selesai
            </span>
            <button
              type="button"
              onClick={() => window.print()}
              className="btn-primary text-xs"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Cetak Hasil Audit (PDF)</span>
            </button>
          </div>

          {/* Audit Score Header */}
          <header className="flex flex-wrap items-center gap-6 border-b border-slate-200 pb-5">
            <ScoreGauge score={r.skor_kelayakan} />
            <div className="min-w-0 flex-1 space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                Hasil Audit: {resultRecord.nama_kegiatan}
              </h3>
              <div className="flex items-center gap-2">
                {renderBadge(r.status_kelayakan)}
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-medium text-slate-500">
                  Total Terhitung:{" "}
                  <strong className="text-slate-900">
                    {fmtRp(r.total_terhitung)}
                  </strong>
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {r.ringkasan}
              </p>
              <p className="text-[11px] text-slate-400">
                Dibuat {fmtDate(resultRecord.created_at)} WITA
                {resultRecord.id ? ` | Arsip ID #${resultRecord.id}` : ""}
              </p>
            </div>
          </header>

          {/* Analisis Efisiensi Pos */}
          <section>
            <h4 className="mb-2 text-sm font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
              <TrendingDown className="h-4 w-4 text-blue-600" />
              Analisis Efisiensi Pos Pengeluaran
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[640px] text-left">
                <thead>
                  <tr>
                    <th className="th-cell">Pos Pengeluaran</th>
                    <th className="th-cell text-right">Estimasi Nominal</th>
                    <th className="th-cell">Penilaian Efisiensi</th>
                    <th className="th-cell">Catatan Analisis</th>
                  </tr>
                </thead>
                <tbody>
                  {(r.analisis_efisiensi || []).map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="td-cell font-semibold text-slate-800">
                        {item.pos}
                      </td>
                      <td className="td-cell text-right whitespace-nowrap font-medium text-slate-700">
                        {item.estimasi_nominal
                          ? fmtRp(item.estimasi_nominal)
                          : "-"}
                      </td>
                      <td className="td-cell">{renderBadge(item.penilaian)}</td>
                      <td className="td-cell text-xs leading-relaxed text-slate-600">
                        {item.catatan}
                      </td>
                    </tr>
                  ))}
                  {(!r.analisis_efisiensi ||
                    r.analisis_efisiensi.length === 0) && (
                    <tr>
                      <td colSpan={4} className="td-cell text-center text-slate-400">
                        Tidak ada data analisis efisiensi pos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Item Krusial yang Terlewat */}
          <section>
            <h4 className="mb-2 text-sm font-bold uppercase tracking-wider text-red-800 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Item Krusial yang Terlewat / Kurang Lengkap
            </h4>
            <div className="grid gap-3 md:grid-cols-2">
              {(r.item_terlewat || []).map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-sm text-slate-900">
                      {item.item}
                    </strong>
                    {renderBadge(`Urgensi ${item.urgensi}`)}
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600">
                    {item.alasan}
                  </p>
                  {item.estimasi_biaya ? (
                    <p className="text-[11px] font-semibold text-slate-700">
                      Estimasi Biaya: {fmtRp(item.estimasi_biaya)}
                    </p>
                  ) : null}
                </div>
              ))}
              {(!r.item_terlewat || r.item_terlewat.length === 0) && (
                <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg">
                  Tidak ditemukan item krusial yang terlewat. Anggaran sudah
                  cukup lengkap.
                </p>
              )}
            </div>
          </section>

          {/* Rekomendasi Optimasi */}
          <section>
            <h4 className="mb-2 text-sm font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              Rekomendasi Optimasi Anggaran
            </h4>
            <div className="space-y-2">
              {(r.rekomendasi || []).map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-blue-100 bg-blue-50/60 p-3.5 text-xs sm:text-sm text-slate-800 space-y-1"
                >
                  <div className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                      {item.prioritas || idx + 1}
                    </span>
                    <p className="font-semibold text-blue-950">{item.saran}</p>
                  </div>
                  {item.dampak && (
                    <p className="pl-7 text-xs text-blue-800">
                      <strong>Dampak:</strong> {item.dampak}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <footer className="pt-2 text-center text-xs text-slate-400">
            Penilaian skor kelayakan dan analisis efisiensi ini merupakan
            panduan berbasis AI dan standar harga umum di Bali. Harap lakukan
            penyesuaian dengan vendor riil setempat.
          </footer>
        </article>
      )}
    </div>
  );
}
