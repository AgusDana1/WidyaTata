"use client";

import React from "react";
import { X, Printer, Download, MapPin, Users, Calendar, Tag, CheckCircle2 } from "lucide-react";
import { ProposalRecord, AuditRecord, DocumentRecord } from "@/types";
import { fmtRp, fmtNumber, fmtDate, slug, downloadBlob } from "@/lib/utils";
import { ScoreGauge } from "./ScoreGauge";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "proposal" | "audit" | "document" | null;
  record: any;
  onSuccess: (msg: string) => void;
}

export function DetailModal({
  isOpen,
  onClose,
  type,
  record,
  onSuccess,
}: DetailModalProps) {
  if (!isOpen || !record) return null;

  const exportRabCsv = (p: ProposalRecord) => {
    if (!p?.result?.rab) return;
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
    p.result.rab.forEach((item, idx) => {
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
    rows.push(["", "", "TOTAL RAB", "", "", "", p.result.total_rab.toString()]);

    const csvContent =
      "\uFEFF" + rows.map((r) => r.map(q).join(",")).join("\r\n");
    downloadBlob(csvContent, "text/csv;charset=utf-8", `RAB_${slug(p.nama_kegiatan)}.csv`);
    onSuccess("File CSV berhasil diekspor.");
  };

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 p-3 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-black/10 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="no-print mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Detail Arsip Database #{record.id}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="btn-secondary text-xs"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Cetak / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content depending on type */}
        {type === "proposal" && (
          <div className="space-y-6">
            <header className="border-b border-slate-200 pb-4">
              <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                Proposal: {record.nama_kegiatan}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                  {record.organisasi}
                </span>
                <span>•</span>
                <span>{record.lokasi}, Bali</span>
                <span>•</span>
                <span>{fmtNumber(record.peserta)} peserta</span>
                <span>•</span>
                <span>{record.durasi} hari</span>
                <span>•</span>
                <span className="font-bold text-slate-900">
                  Pagu: {fmtRp(record.total_pagu)}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Tersimpan pada {fmtDate(record.created_at)} WITA
              </p>
            </header>

            <section>
              <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-blue-800">
                Ringkasan Eksekutif
              </h4>
              <p className="whitespace-pre-line text-xs sm:text-sm text-slate-700 leading-relaxed">
                {record.result?.ringkasan_eksekutif}
              </p>
            </section>

            <section>
              <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-blue-800">
                Latar Belakang
              </h4>
              <p className="whitespace-pre-line text-xs sm:text-sm text-slate-700 leading-relaxed">
                {record.result?.latar_belakang}
              </p>
            </section>

            <section>
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-800">
                Tujuan Kegiatan
              </h4>
              <ol className="list-decimal space-y-1 pl-5 text-xs sm:text-sm text-slate-700">
                {(record.result?.tujuan || []).map((t: string, idx: number) => (
                  <li key={idx}>{t}</li>
                ))}
              </ol>
            </section>

            {/* Rundown */}
            <section>
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-800">
                Rundown Acara
              </h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="th-cell">Waktu</th>
                      <th className="th-cell">Kegiatan</th>
                      <th className="th-cell">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(record.result?.rundown || []).map((r: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="td-cell whitespace-nowrap font-medium text-xs">
                          {r.waktu}
                        </td>
                        <td className="td-cell font-semibold text-xs text-slate-800">
                          {r.kegiatan}
                        </td>
                        <td className="td-cell text-xs text-slate-500">
                          {r.keterangan || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* RAB */}
            <section>
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800">
                  Rencana Anggaran Biaya (RAB)
                </h4>
                <button
                  onClick={() => exportRabCsv(record)}
                  className="btn-secondary text-xs"
                >
                  <Download className="h-3 w-3" />
                  <span>Export CSV</span>
                </button>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="th-cell">Item</th>
                      <th className="th-cell text-right">Qty</th>
                      <th className="th-cell text-right">Harga Satuan</th>
                      <th className="th-cell text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(record.result?.rab || []).map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="td-cell text-xs">
                          <span className="font-semibold text-slate-800">
                            {item.nama_item}
                          </span>
                          <span className="ml-1.5 text-[11px] text-slate-400">
                            ({item.divisi})
                          </span>
                        </td>
                        <td className="td-cell text-right text-xs">
                          {item.kuantitas} {item.satuan}
                        </td>
                        <td className="td-cell text-right text-xs text-slate-600">
                          {fmtRp(item.harga_satuan)}
                        </td>
                        <td className="td-cell text-right text-xs font-bold text-slate-900">
                          {fmtRp(item.total_harga)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-blue-50/80 font-bold border-t border-blue-200">
                      <td colSpan={3} className="px-3.5 py-2.5 text-right text-xs text-blue-950">
                        TOTAL RAB
                      </td>
                      <td className="px-3.5 py-2.5 text-right text-sm font-extrabold text-blue-900">
                        {fmtRp(record.result?.total_rab)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>
          </div>
        )}

        {type === "audit" && (
          <div className="space-y-6">
            <header className="flex flex-wrap items-center gap-6 border-b border-slate-200 pb-5">
              <ScoreGauge score={record.skor_kelayakan} />
              <div className="min-w-0 flex-1 space-y-2">
                <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                  Audit: {record.nama_kegiatan}
                </h3>
                <div className="flex items-center gap-2">
                  {renderBadge(record.result?.status_kelayakan || "-")}
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-medium text-slate-500">
                    Total: {fmtRp(record.result?.total_terhitung)}
                  </span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {record.result?.ringkasan}
                </p>
                <p className="text-[11px] text-slate-400">
                  Diarsipkan pada {fmtDate(record.created_at)} WITA
                </p>
              </div>
            </header>

            {/* Input draf yang diaudit */}
            {record.input_anggaran && (
              <section>
                <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Draf Input Awal yang Diaudit
                </h4>
                <pre className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-600 font-mono">
                  {record.input_anggaran}
                </pre>
              </section>
            )}

            {/* Analisis Efisiensi */}
            <section>
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-800">
                Analisis Pos Pengeluaran
              </h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="th-cell">Pos</th>
                      <th className="th-cell text-right">Nominal</th>
                      <th className="th-cell">Penilaian</th>
                      <th className="th-cell">Catatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(record.result?.analisis_efisiensi || []).map(
                      (item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="td-cell text-xs font-semibold text-slate-800">
                            {item.pos}
                          </td>
                          <td className="td-cell text-right text-xs whitespace-nowrap">
                            {item.estimasi_nominal
                              ? fmtRp(item.estimasi_nominal)
                              : "-"}
                          </td>
                          <td className="td-cell">{renderBadge(item.penilaian)}</td>
                          <td className="td-cell text-xs text-slate-600">
                            {item.catatan}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Item Terlewat */}
            <section>
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-red-800">
                Item Krusial yang Terlewat
              </h4>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {(record.result?.item_terlewat || []).map(
                  (item: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900">{item.item}</strong>
                        {renderBadge(`Urgensi ${item.urgensi}`)}
                      </div>
                      <p className="text-slate-600">{item.alasan}</p>
                    </div>
                  )
                )}
              </div>
            </section>
          </div>
        )}

        {type === "document" && (
          <div className="space-y-4">
            <header className="border-b border-slate-200 pb-3">
              <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                {record.judul}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {record.jenis_label || record.jenis} • {record.nama_kegiatan} •
                Diarsipkan {fmtDate(record.created_at)} WITA
              </p>
            </header>
            <div className="paper-doc rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-inner">
              {record.isi_dokumen}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
