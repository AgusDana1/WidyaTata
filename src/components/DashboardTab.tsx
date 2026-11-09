"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  RefreshCw,
  FileSpreadsheet,
  ShieldCheck,
  FileText,
  DollarSign,
  Trash2,
  Eye,
  Building,
  Calendar,
  MapPin,
  Users,
} from "lucide-react";
import { HistoryResponse } from "@/types";
import { fmtRp, fmtNumber, fmtDate } from "@/lib/utils";
import { DetailModal } from "./DetailModal";

interface DashboardTabProps {
  onLoadHistory: () => Promise<HistoryResponse>;
  onGetDetail: (type: string, id: number) => Promise<any>;
  onDeleteItem: (type: string, id: number) => Promise<void>;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export function DashboardTab({
  onLoadHistory,
  onGetDetail,
  onDeleteItem,
  onSuccess,
  onError,
}: DashboardTabProps) {
  const [data, setData] = useState<HistoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [subTab, setSubTab] = useState<"proposals" | "audits" | "documents">(
    "proposals"
  );

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "proposal" | "audit" | "document" | null
  >(null);
  const [modalRecord, setModalRecord] = useState<any>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await onLoadHistory();
      setData(res);
    } catch (err: any) {
      onError(err.message || "Gagal memuat arsip database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleView = async (type: "proposal" | "audit" | "document", id: number) => {
    try {
      const rec = await onGetDetail(type, id);
      setModalType(type);
      setModalRecord(rec);
      setModalOpen(true);
    } catch (err: any) {
      onError(err.message || "Gagal memuat detail arsip.");
    }
  };

  const handleDelete = async (type: "proposal" | "audit" | "document", id: number) => {
    if (!confirm(`Hapus arsip #${id}? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }
    try {
      await onDeleteItem(type, id);
      onSuccess("Arsip berhasil dihapus.");
      fetchHistory();
    } catch (err: any) {
      onError(err.message || "Gagal menghapus arsip.");
    }
  };

  const s = data?.stats;

  return (
    <div className="space-y-6">
      {/* Analytics Card */}
      <div className="card-box">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>Dashboard Arsip &amp; Analitik</span>
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Semua dokumen, audit, dan proposal tersimpan otomatis di database
              SQLite lokal.
            </p>
          </div>
          <button
            onClick={fetchHistory}
            disabled={loading}
            className="btn-secondary text-xs"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            <span>{loading ? "Memuat..." : "Muat Ulang"}</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 to-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Proposal &amp; RAB
              </span>
              <FileSpreadsheet className="h-4 w-4 text-blue-500" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-blue-900">
              {s ? fmtNumber(s.total_proposals) : "-"}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 to-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Audit Anggaran
              </span>
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-emerald-900">
              {s ? fmtNumber(s.total_audits) : "-"}
            </p>
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                Surat &amp; LPJ
              </span>
              <FileText className="h-4 w-4 text-indigo-500" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-indigo-900">
              {s ? fmtNumber(s.total_documents) : "-"}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/70 to-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Rata-rata Skor Audit
              </span>
              <span className="text-xs font-bold text-amber-600">/ 100</span>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-amber-900">
              {s?.avg_skor !== null && s?.avg_skor !== undefined
                ? `${s.avg_skor}`
                : "-"}
            </p>
          </div>
        </div>

        {/* Organization breakdown & total pagu */}
        {s && (
          <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-slate-500" />
                Distribusi Proposal per Kategori Organisasi
              </h3>
              <p className="text-xs text-slate-500">
                Total Pagu Seluruh Proposal:{" "}
                <strong className="text-blue-900 font-bold">
                  {fmtRp(s.total_pagu)}
                </strong>
              </p>
            </div>

            <div className="mt-3 space-y-2.5">
              {s.by_organisasi?.length ? (
                (() => {
                  const max = Math.max(
                    1,
                    ...s.by_organisasi.map((o) => o.jumlah)
                  );
                  return s.by_organisasi.map((org, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-700">
                          {org.organisasi}
                        </span>
                        <span className="font-bold text-slate-900">
                          {org.jumlah} proposal
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/70">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-sky-400 transition-all duration-500"
                          style={{
                            width: `${(org.jumlah / max) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ));
                })()
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Belum ada proposal tersimpan di database.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* History Archive List */}
      <div className="card-box">
        {/* Sub-tabs */}
        <div className="flex gap-4 border-b border-slate-200">
          <button
            onClick={() => setSubTab("proposals")}
            className={`pb-2 text-xs sm:text-sm font-semibold transition-all border-b-2 ${
              subTab === "proposals"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Arsip Proposal &amp; RAB ({data?.proposals?.length || 0})
          </button>
          <button
            onClick={() => setSubTab("audits")}
            className={`pb-2 text-xs sm:text-sm font-semibold transition-all border-b-2 ${
              subTab === "audits"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Arsip Audit Anggaran ({data?.audits?.length || 0})
          </button>
          <button
            onClick={() => setSubTab("documents")}
            className={`pb-2 text-xs sm:text-sm font-semibold transition-all border-b-2 ${
              subTab === "documents"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Arsip Surat &amp; LPJ ({data?.documents?.length || 0})
          </button>
        </div>

        {/* List items */}
        <div className="mt-4">
          {subTab === "proposals" && (
            <div className="divide-y divide-slate-100">
              {data?.proposals?.length ? (
                data.proposals.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3.5 hover:bg-slate-50/50 px-2 rounded-xl transition"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="truncate font-bold text-slate-900 text-sm">
                        {p.nama_kegiatan}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                        <span className="rounded bg-blue-50 px-2 py-0.5 font-semibold text-blue-800">
                          {p.organisasi}
                        </span>
                        <span>•</span>
                        <span>{p.lokasi}</span>
                        <span>•</span>
                        <span>{fmtNumber(p.peserta)} peserta</span>
                        <span>•</span>
                        <span className="font-bold text-slate-800">
                          Pagu: {fmtRp(p.total_pagu)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {fmtDate(p.created_at)} WITA • ID #{p.id}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView("proposal", p.id)}
                        className="btn-secondary text-xs py-1.5 px-3"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Lihat Detail</span>
                      </button>
                      <button
                        onClick={() => handleDelete("proposal", p.id)}
                        className="btn-secondary text-xs py-1.5 px-3 text-red-700 hover:border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-xs text-slate-400 italic">
                  Belum ada arsip proposal. Buat proposal pertama Anda di tab
                  Proposal &amp; RAB.
                </p>
              )}
            </div>
          )}

          {subTab === "audits" && (
            <div className="divide-y divide-slate-100">
              {data?.audits?.length ? (
                data.audits.map((a) => (
                  <div
                    key={a.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3.5 hover:bg-slate-50/50 px-2 rounded-xl transition"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="truncate font-bold text-slate-900 text-sm">
                        {a.nama_kegiatan}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                        <span className="font-bold text-blue-800">
                          Skor: {a.skor_kelayakan}/100
                        </span>
                        <span>•</span>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-700 font-medium">
                          {a.status_kelayakan}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {fmtDate(a.created_at)} WITA • ID #{a.id}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView("audit", a.id)}
                        className="btn-secondary text-xs py-1.5 px-3"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Lihat Detail</span>
                      </button>
                      <button
                        onClick={() => handleDelete("audit", a.id)}
                        className="btn-secondary text-xs py-1.5 px-3 text-red-700 hover:border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-xs text-slate-400 italic">
                  Belum ada arsip audit anggaran.
                </p>
              )}
            </div>
          )}

          {subTab === "documents" && (
            <div className="divide-y divide-slate-100">
              {data?.documents?.length ? (
                data.documents.map((d) => (
                  <div
                    key={d.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3.5 hover:bg-slate-50/50 px-2 rounded-xl transition"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="truncate font-bold text-slate-900 text-sm">
                        {d.judul}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                        <span className="rounded bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-800">
                          {d.jenis_label}
                        </span>
                        <span>•</span>
                        <span>{d.nama_kegiatan}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {fmtDate(d.created_at)} WITA • ID #{d.id}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView("document", d.id)}
                        className="btn-secondary text-xs py-1.5 px-3"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Lihat Dokumen</span>
                      </button>
                      <button
                        onClick={() => handleDelete("document", d.id)}
                        className="btn-secondary text-xs py-1.5 px-3 text-red-700 hover:border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-xs text-slate-400 italic">
                  Belum ada arsip surat atau LPJ.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <DetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        record={modalRecord}
        onSuccess={onSuccess}
      />
    </div>
  );
}
