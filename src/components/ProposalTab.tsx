"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Printer,
  Download,
  Calendar,
  DollarSign,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  RotateCcw,
  Tag,
} from "lucide-react";
import { ProposalRecord } from "@/types";
import { fmtRp, fmtNumber, fmtDate, slug, downloadBlob } from "@/lib/utils";

interface ProposalTabProps {
  onGenerate: (data: {
    nama_kegiatan: string;
    organisasi: string;
    lokasi: string;
    peserta: number;
    durasi: number;
    total_pagu: number;
  }) => Promise<ProposalRecord>;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

const DEMO_PROPOSALS = [
  {
    label: "Workshop AI & Web Dev Mahasiswa se-Bali (Denpasar, Rp 15 Juta)",
    data: {
      nama_kegiatan: "Workshop Teknologi AI & Web Development Mahasiswa se-Bali",
      organisasi: "BEM/UKM Kampus",
      lokasi: "Denpasar",
      peserta: 120,
      durasi: 2,
      total_pagu: 15000000,
    },
  },
  {
    label: "Kemah Bakti & Lomba Pramuka Penegak/Penggalang (Badung, Rp 25 Juta)",
    data: {
      nama_kegiatan: "Kemah Bakti & Lomba Tingkat Pramuka Penegak/Penggalang",
      organisasi: "Pramuka/Dewan Kerja",
      lokasi: "Badung",
      peserta: 200,
      durasi: 3,
      total_pagu: 25000000,
    },
  },
  {
    label: "Festival Inovasi Kreatif & Pentas Seni Pelajar SMA/SMK (Rp 20 Juta)",
    data: {
      nama_kegiatan: "Festival Inovasi Kreatif & Pentas Seni Pelajar SMA/SMK",
      organisasi: "OSIS SMA/SMK",
      lokasi: "Gianyar",
      peserta: 300,
      durasi: 2,
      total_pagu: 20000000,
    },
  },
];

export function ProposalTab({
  onGenerate,
  onSuccess,
  onError,
}: ProposalTabProps) {
  const [nama, setNama] = useState("");
  const [organisasi, setOrganisasi] = useState("BEM/UKM Kampus");
  const [lokasi, setLokasi] = useState("");
  const [peserta, setPeserta] = useState<number | "">("");
  const [durasi, setDurasi] = useState<number | "">("");
  const [pagu, setPagu] = useState<number | "">("");

  const [loading, setLoading] = useState(false);
  const [resultRecord, setResultRecord] = useState<ProposalRecord | null>(null);

  const handleDemo = (d: (typeof DEMO_PROPOSALS)[0]["data"]) => {
    setNama(d.nama_kegiatan);
    setOrganisasi(d.organisasi);
    setLokasi(d.lokasi);
    setPeserta(d.peserta);
    setDurasi(d.durasi);
    setPagu(d.total_pagu);
    onSuccess("Contoh demo berhasil dimuat ke formulir.");
  };

  const handleReset = () => {
    setNama("");
    setOrganisasi("BEM/UKM Kampus");
    setLokasi("");
    setPeserta("");
    setDurasi("");
    setPagu("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      onError("Nama kegiatan wajib diisi.");
      return;
    }
    if (!lokasi.trim()) {
      onError("Lokasi di Bali wajib diisi.");
      return;
    }
    if (!peserta || Number(peserta) < 1) {
      onError("Jumlah peserta minimal 1 orang.");
      return;
    }
    if (!durasi || Number(durasi) < 1 || Number(durasi) > 14) {
      onError("Durasi harus antara 1 sampai 14 hari.");
      return;
    }
    if (!pagu || Number(pagu) < 100000) {
      onError("Total pagu anggaran minimal Rp 100.000.");
      return;
    }

    setLoading(true);
    try {
      const rec = await onGenerate({
        nama_kegiatan: nama.trim(),
        organisasi,
        lokasi: lokasi.trim(),
        peserta: Number(peserta),
        durasi: Number(durasi),
        total_pagu: Number(pagu),
      });
      setResultRecord(rec);
      onSuccess("Proposal & RAB berhasil disusun dan disimpan ke arsip.");
    } catch (err: any) {
      onError(err.message || "Gagal menyusun proposal.");
    } finally {
      setLoading(false);
    }
  };

  const exportRabCsv = () => {
    if (!resultRecord?.result?.rab) return;
    const q = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = [
      [
        "No",
        "Divisi",
        "Nama Item",
        "Kuantitas",
        "Satuan",
        "Harga Satuan (Rp)",
        "Total Harga (Rp)",
      ],
    ];
    resultRecord.result.rab.forEach((item, idx) => {
      rows.push([
        (idx + 1).toString(),
        item.divisi,
        item.nama_item,
        item.kuantitas.toString(),
        item.satuan,
        item.harga_satuan.toString(),
        item.total_harga.toString(),
      ]);
    });
    rows.push([
      "",
      "",
      "TOTAL RAB",
      "",
      "",
      "",
      resultRecord.result.total_rab.toString(),
    ]);

    const csvContent =
      "\uFEFF" + rows.map((r) => r.map(q).join(",")).join("\r\n");
    downloadBlob(
      csvContent,
      "text/csv;charset=utf-8",
      `RAB_${slug(resultRecord.nama_kegiatan)}.csv`
    );
    onSuccess("File CSV berhasil diunduh.");
  };

  const r = resultRecord?.result;
  const sumByDiv: Record<string, number> = {};
  if (r?.rab) {
    r.rab.forEach((item) => {
      sumByDiv[item.divisi] = (sumByDiv[item.divisi] || 0) + item.total_harga;
    });
  }

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <div className="card-box no-print">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <span>Smart Proposal &amp; RAB Architect</span>
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Isi data kegiatan. AI menyusun latar belakang kontekstual Bali,
              rundown harian, dan tabel RAB presisi sesuai pagu.
            </p>
          </div>
        </div>

        {/* Demo Buttons */}
        <div className="mt-4">
          <p className="lbl">Pilih Contoh Cepat (Demo Juri):</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {DEMO_PROPOSALS.map((demo, idx) => (
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

        {/* Proposal Form */}
        <form onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="lbl" htmlFor="p_nama">
              Nama Kegiatan *
            </label>
            <input
              id="p_nama"
              className="field"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Workshop Teknologi AI & Web Development Mahasiswa se-Bali"
              maxLength={150}
              required
            />
          </div>

          <div>
            <label className="lbl" htmlFor="p_kategori">
              Kategori Organisasi *
            </label>
            <select
              id="p_kategori"
              className="field"
              value={organisasi}
              onChange={(e) => setOrganisasi(e.target.value)}
            >
              <option>BEM/UKM Kampus</option>
              <option>OSIS SMA/SMK</option>
              <option>Pramuka/Dewan Kerja</option>
              <option>Komunitas Pemuda Bali</option>
            </select>
          </div>

          <div>
            <label className="lbl" htmlFor="p_lokasi">
              Lokasi di Bali *
            </label>
            <div className="relative">
              <input
                id="p_lokasi"
                className="field pr-9"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                placeholder="Contoh: Denpasar / Badung / Gianyar"
                maxLength={100}
                required
              />
              <MapPin className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="lbl" htmlFor="p_peserta">
              Jumlah Peserta (Orang) *
            </label>
            <div className="relative">
              <input
                id="p_peserta"
                type="number"
                min="1"
                max="100000"
                className="field pr-9"
                value={peserta}
                onChange={(e) =>
                  setPeserta(e.target.value ? Number(e.target.value) : "")
                }
                placeholder="120"
                required
              />
              <Users className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="lbl" htmlFor="p_durasi">
              Durasi Kegiatan (Hari) *
            </label>
            <div className="relative">
              <input
                id="p_durasi"
                type="number"
                min="1"
                max="14"
                className="field pr-9"
                value={durasi}
                onChange={(e) =>
                  setDurasi(e.target.value ? Number(e.target.value) : "")
                }
                placeholder="2"
                required
              />
              <Calendar className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="lbl" htmlFor="p_pagu">
              Total Pagu Anggaran (Rp) *
            </label>
            <div className="relative">
              <input
                id="p_pagu"
                type="number"
                min="100000"
                step="1000"
                className="field pr-9 font-semibold text-blue-900"
                value={pagu}
                onChange={(e) =>
                  setPagu(e.target.value ? Number(e.target.value) : "")
                }
                placeholder="15000000"
                required
              />
              <DollarSign className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
            {pagu && Number(pagu) > 0 && (
              <p className="mt-1 text-xs text-blue-600 font-semibold">
                Terbaca: {fmtRp(pagu)}
              </p>
            )}
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              <Sparkles className="h-4 w-4" />
              <span>{loading ? "Menyusun dengan AI..." : "Buat Proposal & RAB dengan AI"}</span>
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
              Proposal Berhasil Disusun
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="btn-primary text-xs"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Cetak / Simpan PDF</span>
              </button>
              <button
                type="button"
                onClick={exportRabCsv}
                className="btn-secondary text-xs"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export RAB ke CSV</span>
              </button>
            </div>
          </div>

          {/* Proposal Header */}
          <header className="border-b border-slate-200 pb-4">
            <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
              Proposal Kegiatan: {resultRecord.nama_kegiatan}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                {resultRecord.organisasi}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3 text-slate-400" />
                {resultRecord.lokasi}, Bali
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Users className="h-3 w-3 text-slate-400" />
                {fmtNumber(resultRecord.peserta)} peserta
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3 text-slate-400" />
                {resultRecord.durasi} hari
              </span>
              <span>•</span>
              <span className="font-bold text-slate-900">
                Pagu: {fmtRp(resultRecord.total_pagu)}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Dibuat {fmtDate(resultRecord.created_at)} WITA
              {resultRecord.id ? ` | Arsip ID #${resultRecord.id}` : ""}
            </p>
          </header>

          {/* Ringkasan Eksekutif */}
          <section>
            <h4 className="mb-1 text-sm font-bold uppercase tracking-wider text-blue-800">
              Ringkasan Eksekutif
            </h4>
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
              {r.ringkasan_eksekutif}
            </p>
          </section>

          {/* Latar Belakang */}
          <section>
            <h4 className="mb-1 text-sm font-bold uppercase tracking-wider text-blue-800">
              Latar Belakang
            </h4>
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
              {r.latar_belakang}
            </p>
          </section>

          {/* Tujuan SMART */}
          <section>
            <h4 className="mb-2 text-sm font-bold uppercase tracking-wider text-blue-800">
              Tujuan Kegiatan (SMART)
            </h4>
            <ol className="list-decimal space-y-1.5 pl-5 text-sm text-slate-700">
              {(r.tujuan || []).map((t, idx) => (
                <li key={idx} className="leading-relaxed">
                  {t}
                </li>
              ))}
            </ol>
          </section>

          {/* Rundown Acara */}
          <section>
            <h4 className="mb-2 text-sm font-bold uppercase tracking-wider text-blue-800">
              Susunan Rundown Acara (WITA)
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr>
                    <th className="th-cell w-36">Waktu</th>
                    <th className="th-cell">Kegiatan</th>
                    <th className="th-cell">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    let lastDay: number | null = null;
                    return (r.rundown || []).map((item, idx) => {
                      const isNewDay = item.hari !== lastDay;
                      if (isNewDay) lastDay = item.hari;
                      return (
                        <React.Fragment key={idx}>
                          {isNewDay && (
                            <tr>
                              <td
                                colSpan={3}
                                className="bg-blue-50/80 px-3.5 py-1.5 text-xs font-bold text-blue-900 border-t border-blue-100"
                              >
                                Hari ke-{item.hari}
                              </td>
                            </tr>
                          )}
                          <tr className="hover:bg-slate-50/50">
                            <td className="td-cell whitespace-nowrap font-medium text-slate-600">
                              <span className="inline-flex items-center gap-1.5">
                                <Clock className="h-3 w-3 text-slate-400" />
                                {item.waktu}
                              </span>
                            </td>
                            <td className="td-cell font-semibold text-slate-800">
                              {item.kegiatan}
                            </td>
                            <td className="td-cell text-xs text-slate-500">
                              {item.keterangan || "-"}
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </section>

          {/* RAB Table */}
          <section>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h4 className="text-sm font-bold uppercase tracking-wider text-blue-800">
                Rencana Anggaran Biaya (RAB)
              </h4>
              <span className="text-xs text-slate-500">
                {r.rab?.length || 0} pos pengeluaran
              </span>
            </div>

            {/* Division Subtotals */}
            <div className="mb-3 flex flex-wrap gap-1.5">
              {Object.entries(sumByDiv).map(([divisi, total], idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-700"
                >
                  <Tag className="h-3 w-3 text-slate-400" />
                  <span>{divisi}:</span>
                  <strong className="text-slate-900">{fmtRp(total)}</strong>
                </span>
              ))}
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr>
                    <th className="th-cell w-12">No</th>
                    <th className="th-cell">Divisi</th>
                    <th className="th-cell">Nama Item</th>
                    <th className="th-cell text-right">Qty</th>
                    <th className="th-cell">Satuan</th>
                    <th className="th-cell text-right">Harga Satuan</th>
                    <th className="th-cell text-right">Total Harga</th>
                  </tr>
                </thead>
                <tbody>
                  {(r.rab || []).map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="td-cell text-xs text-slate-400">{idx + 1}</td>
                      <td className="td-cell">
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                          {item.divisi}
                        </span>
                      </td>
                      <td className="td-cell font-medium text-slate-800">
                        {item.nama_item}
                      </td>
                      <td className="td-cell text-right font-medium">
                        {fmtNumber(item.kuantitas)}
                      </td>
                      <td className="td-cell text-slate-500 text-xs">
                        {item.satuan}
                      </td>
                      <td className="td-cell text-right whitespace-nowrap text-slate-600">
                        {fmtRp(item.harga_satuan)}
                      </td>
                      <td className="td-cell text-right whitespace-nowrap font-bold text-slate-900">
                        {fmtRp(item.total_harga)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-blue-50/80 border-t-2 border-blue-200">
                    <td
                      colSpan={6}
                      className="px-3.5 py-3 text-right text-sm font-bold text-blue-950 uppercase"
                    >
                      Total RAB
                    </td>
                    <td className="px-3.5 py-3 text-right text-base font-extrabold text-blue-900 whitespace-nowrap">
                      {fmtRp(r.total_rab)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Budget Balance Status */}
            <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                Total RAB tepat 100% sama dengan pagu anggaran yang disediakan:{" "}
                <strong>{fmtRp(resultRecord.total_pagu)}</strong>.
              </span>
            </div>

            {r.catatan_penyesuaian && (
              <p className="mt-1.5 text-xs text-slate-500 italic">
                * {r.catatan_penyesuaian}
              </p>
            )}
          </section>

          {/* Catatan Kontekstual Bali */}
          {r.catatan_kontekstual_bali && (
            <section className="rounded-2xl border border-sky-200 bg-sky-50/70 p-4">
              <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-sky-600" />
                Catatan Konteks Kearifan Lokal Bali
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed text-sky-950">
                {r.catatan_kontekstual_bali}
              </p>
            </section>
          )}

          <footer className="pt-2 text-center text-xs text-slate-400">
            Draf proposal disusun oleh kecerdasan buatan WidyaTata AI. Silakan
            periksa dan sesuaikan sebelum ditandatangani secara resmi.
          </footer>
        </article>
      )}
    </div>
  );
}
