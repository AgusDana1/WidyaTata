export interface RundownItem {
  hari: number;
  waktu: string;
  kegiatan: string;
  keterangan: string;
}

export interface RabItem {
  divisi: string;
  nama_item: string;
  kuantitas: number;
  satuan: string;
  harga_satuan: number;
  total_harga: number;
}

export interface ProposalResult {
  ringkasan_eksekutif: string;
  latar_belakang: string;
  tujuan: string[];
  rundown: RundownItem[];
  rab: RabItem[];
  total_rab: number;
  catatan_kontekstual_bali?: string;
  catatan_penyesuaian?: string;
}

export interface ProposalRecord {
  id?: number;
  nama_kegiatan: string;
  organisasi: string;
  lokasi: string;
  peserta: number;
  durasi: number;
  total_pagu: number;
  created_at?: string;
  result: ProposalResult;
}

export interface AuditEfficiency {
  pos: string;
  estimasi_nominal: number;
  penilaian: string;
  catatan: string;
}

export interface AuditMissingItem {
  item: string;
  urgensi: string;
  alasan: string;
  estimasi_biaya: number;
}

export interface AuditRecommendation {
  prioritas: number;
  saran: string;
  dampak: string;
}

export interface AuditResult {
  skor_kelayakan: number;
  status_kelayakan: string;
  ringkasan: string;
  total_terhitung: number;
  analisis_efisiensi: AuditEfficiency[];
  item_terlewat: AuditMissingItem[];
  rekomendasi: AuditRecommendation[];
}

export interface AuditRecord {
  id?: number;
  nama_kegiatan: string;
  input_anggaran?: string;
  skor_kelayakan: number;
  created_at?: string;
  result: AuditResult;
}

export interface DocumentRecord {
  id?: number;
  jenis: string;
  jenis_label?: string;
  judul: string;
  nama_kegiatan: string;
  isi_dokumen: string;
  created_at?: string;
}

export interface HistoryStats {
  total_proposals: number;
  total_audits: number;
  total_documents: number;
  total_pagu: number;
  avg_skor: number | null;
  by_organisasi: { organisasi: string; jumlah: number }[];
}

export interface HistoryResponse {
  ok: boolean;
  proposals: Array<{
    id: number;
    nama_kegiatan: string;
    organisasi: string;
    lokasi: string;
    peserta: number;
    durasi: number;
    total_pagu: number;
    created_at: string;
  }>;
  audits: Array<{
    id: number;
    nama_kegiatan: string;
    skor_kelayakan: number;
    status_kelayakan: string;
    created_at: string;
  }>;
  documents: Array<{
    id: number;
    jenis: string;
    jenis_label: string;
    judul: string;
    nama_kegiatan: string;
    created_at: string;
  }>;
  stats: HistoryStats;
}

export interface ApiStatus {
  ai_configured: boolean;
  model: string;
}
