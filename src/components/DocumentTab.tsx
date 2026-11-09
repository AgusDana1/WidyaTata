"use client";

import React, { useState } from "react";
import {
  FileText,
  Printer,
  Copy,
  Download,
  Sparkles,
  RotateCcw,
  Building2,
  Calendar,
  MapPin,
  UserCheck,
} from "lucide-react";
import { DocumentRecord } from "@/types";
import { fmtDate, slug, downloadBlob } from "@/lib/utils";

interface DocumentTabProps {
  onGenerate: (data: {
    jenis: string;
    nama_kegiatan: string;
    organisasi: string;
    penerima: string;
    tanggal: string;
    lokasi: string;
    detail: string;
  }) => Promise<DocumentRecord>;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

const DOC_TYPES = [
  {
    id: "peminjaman_gedung",
    label: "Surat Peminjaman Gedung Kampus/Sekolah",
    hint: "Jelaskan kebutuhan fasilitas, estimasi peserta, dan jadwal setup/bongkar.",
  },
  {
    id: "undangan_pemateri",
    label: "Surat Undangan Pemateri/Juri",
    hint: "Jelaskan peran/topik materi yang diminta, jadwal, durasi, serta narahubung.",
  },
  {
    id: "sponsorship",
    label: "Surat Permohonan Sponsorship",
    hint: "Sebutkan total kebutuhan dana, paket sponsor yang ditawarkan, dan keuntungan bagi sponsor.",
  },
  {
    id: "lpj",
    label: "Ringkasan Laporan Pertanggungjawaban (LPJ)",
    hint: "Sertakan data realisasi anggaran, peserta yang hadir, kendala, dan evaluasi kegiatan.",
  },
];

const DEMO_DOCS = [
  {
    label: "Surat peminjaman aula untuk Workshop AI Mahasiswa",
    data: {
      jenis: "peminjaman_gedung",
      nama_kegiatan: "Workshop Teknologi AI & Web Development Mahasiswa se-Bali",
      organisasi: "BEM Fakultas Teknik - Kampus Denpasar",
      penerima: "Wakil Dekan Bidang Kemahasiswaan",
      tanggal: "Sabtu-Minggu, 14-15 Maret 2027",
      lokasi: "Aula Utama Kampus, Denpasar",
      detail:
        "Peserta 120 orang. Membutuhkan aula, proyektor, sound system, dan wifi. Setup H-1 pukul 15.00 WITA.",
    },
  },
  {
    label: "Surat sponsorship untuk Kemah Bakti Pramuka",
    data: {
      jenis: "sponsorship",
      nama_kegiatan: "Kemah Bakti & Lomba Tingkat Pramuka Penegak/Penggalang",
      organisasi: "Dewan Kerja Cabang Badung",
      penerima: "Pimpinan Perusahaan Calon Sponsor",
      tanggal: "21-23 Mei 2027",
      lokasi: "Bumi Perkemahan, Badung",
      detail:
        "Total kebutuhan dana Rp 25.000.000. Paket sponsor: Platinum Rp 10.000.000, Gold Rp 5.000.000, Silver Rp 2.500.000. Benefit: logo di banner, sebutan oleh MC, dan dokumentasi.",
    },
  },
  {
    label: "Ringkasan LPJ Festival Inovasi & Pentas Seni Pelajar",
    data: {
      jenis: "lpj",
      nama_kegiatan: "Festival Inovasi Kreatif & Pentas Seni Pelajar SMA/SMK",
      organisasi: "OSIS SMA Negeri Gianyar",
      penerima: "Kepala Sekolah dan Pembina OSIS",
      tanggal: "10-11 Oktober 2026",
      lokasi: "Gianyar, Bali",
      detail:
        "Pagu Rp 20.000.000. Realisasi: panggung & sound Rp 8.750.000; honor MC & juri Rp 2.000.000; konsumsi Rp 2.100.000; hadiah Rp 4.000.000; dekorasi Rp 2.400.000; lain-lain Rp 300.000 (total Rp 19.550.000, sisa Rp 450.000 dikembalikan ke kas OSIS). Peserta 280 siswa dari 12 sekolah.",
    },
  },
];

export function DocumentTab({
  onGenerate,
  onSuccess,
  onError,
}: DocumentTabProps) {
  const [jenis, setJenis] = useState("peminjaman_gedung");
  const [nama, setNama] = useState("");
  const [organisasi, setOrganisasi] = useState("");
  const [penerima, setPenerima] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [detail, setDetail] = useState("");

  const [loading, setLoading] = useState(false);
  const [resultRecord, setResultRecord] = useState<DocumentRecord | null>(null);

  const currentType = DOC_TYPES.find((d) => d.id === jenis);

  const handleDemo = (d: (typeof DEMO_DOCS)[0]["data"]) => {
    setJenis(d.jenis);
    setNama(d.nama_kegiatan);
    setOrganisasi(d.organisasi);
    setPenerima(d.penerima);
    setTanggal(d.tanggal);
    setLokasi(d.lokasi);
    setDetail(d.detail);
    onSuccess("Contoh draf dokumen berhasil dimuat.");
  };

  const handleReset = () => {
    setJenis("peminjaman_gedung");
    setNama("");
    setOrganisasi("");
    setPenerima("");
    setTanggal("");
    setLokasi("");
    setDetail("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      onError("Nama kegiatan wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const rec = await onGenerate({
        jenis,
        nama_kegiatan: nama.trim(),
        organisasi: organisasi.trim(),
        penerima: penerima.trim(),
        tanggal: tanggal.trim(),
        lokasi: lokasi.trim(),
        detail: detail.trim(),
      });
      setResultRecord(rec);
      onSuccess("Dokumen resmi berhasil dibuat dan tersimpan ke arsip.");
    } catch (err: any) {
      onError(err.message || "Gagal membuat dokumen.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!resultRecord) return;
    try {
      await navigator.clipboard.writeText(resultRecord.isi_dokumen);
      onSuccess("Teks dokumen berhasil disalin ke clipboard.");
    } catch {
      onError("Gagal menyalin teks secara otomatis.");
    }
  };

  const downloadTxt = () => {
    if (!resultRecord) return;
    const content = `${resultRecord.judul}\n\n${resultRecord.isi_dokumen}`;
    downloadBlob(
      content,
      "text/plain;charset=utf-8",
      `${slug(resultRecord.judul)}.txt`
    );
    onSuccess("File teks dokumen berhasil diunduh.");
  };

  return (
    <div className="space-y-6">
      {/* Form Card */}
      <div className="card-box no-print">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Smart Correspondence &amp; LPJ Generator</span>
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Hasilkan draf surat resmi kepanitiaan dan ringkasan LPJ. Kolom yang
            belum terisi akan ditandai dengan placeholder [ ] agar mudah
            disesuaikan.
          </p>
        </div>

        {/* Demo Buttons */}
        <div className="mt-4">
          <p className="lbl">Pilih Contoh Dokumen Cepat (Demo Juri):</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {DEMO_DOCS.map((demo, idx) => (
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

        {/* Document Form */}
        <form onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="lbl" htmlFor="d_jenis">
              Jenis Dokumen Resmi *
            </label>
            <select
              id="d_jenis"
              className="field font-semibold text-blue-900"
              value={jenis}
              onChange={(e) => setJenis(e.target.value)}
            >
              {DOC_TYPES.map((dt) => (
                <option key={dt.id} value={dt.id}>
                  {dt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="lbl" htmlFor="d_nama">
              Nama Kegiatan *
            </label>
            <input
              id="d_nama"
              className="field"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Workshop Teknologi AI & Web Development Mahasiswa se-Bali"
              maxLength={150}
              required
            />
          </div>

          <div>
            <label className="lbl" htmlFor="d_org">
              Organisasi / Panitia Pengirim
            </label>
            <div className="relative">
              <input
                id="d_org"
                className="field pr-9"
                value={organisasi}
                onChange={(e) => setOrganisasi(e.target.value)}
                placeholder="Contoh: BEM Fakultas Teknik Kampus..."
                maxLength={150}
              />
              <Building2 className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="lbl" htmlFor="d_penerima">
              Ditujukan Kepada (Penerima)
            </label>
            <div className="relative">
              <input
                id="d_penerima"
                className="field pr-9"
                value={penerima}
                onChange={(e) => setPenerima(e.target.value)}
                placeholder="Contoh: Wakil Dekan / Kepala Sekolah / Pimpinan..."
                maxLength={200}
              />
              <UserCheck className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="lbl" htmlFor="d_tanggal">
              Tanggal / Waktu Kegiatan
            </label>
            <div className="relative">
              <input
                id="d_tanggal"
                className="field pr-9"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                placeholder="Contoh: Sabtu-Minggu, 14-15 Maret 2027"
                maxLength={100}
              />
              <Calendar className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="lbl" htmlFor="d_lokasi">
              Lokasi Kegiatan
            </label>
            <div className="relative">
              <input
                id="d_lokasi"
                className="field pr-9"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                placeholder="Contoh: Aula Utama Kampus, Denpasar"
                maxLength={150}
              />
              <MapPin className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="lbl" htmlFor="d_detail">
              Detail Tambahan &amp; Kebutuhan
            </label>
            <textarea
              id="d_detail"
              rows={4}
              className="field text-xs sm:text-sm"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Fasilitas yang dibutuhkan, paket sponsor, atau angka realisasi anggaran untuk LPJ..."
            />
            {currentType?.hint && (
              <p className="mt-1.5 text-xs text-blue-600">
                💡 <strong>Tips jenis ini:</strong> {currentType.hint}
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
              <span>{loading ? "Menyusun Dokumen..." : "Buat Dokumen dengan AI"}</span>
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
      {resultRecord && (
        <article className="card-box space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="no-print flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Dokumen Resmi Siap Digunakan
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
                onClick={copyToClipboard}
                className="btn-secondary text-xs"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Salin Teks</span>
              </button>
              <button
                type="button"
                onClick={downloadTxt}
                className="btn-secondary text-xs"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Unduh .txt</span>
              </button>
            </div>
          </div>

          <header className="border-b border-slate-200 pb-3">
            <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
              {resultRecord.judul}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {resultRecord.jenis_label || resultRecord.jenis} •{" "}
              {resultRecord.nama_kegiatan} • Dibuat{" "}
              {fmtDate(resultRecord.created_at)} WITA
              {resultRecord.id ? ` | Arsip ID #${resultRecord.id}` : ""}
            </p>
          </header>

          {/* Paper View */}
          <div className="paper-doc rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-inner">
            {resultRecord.isi_dokumen}
          </div>

          <p className="no-print text-xs text-slate-400 italic">
            * Silakan periksa dan lengkapi bagian bertanda [ ] sebelum dicetak,
            distempel, dan ditandatangani oleh pihak berwenang.
          </p>
        </article>
      )}
    </div>
  );
}
