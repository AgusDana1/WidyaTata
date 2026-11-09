import {
  ProposalRecord,
  AuditRecord,
  DocumentRecord,
  HistoryResponse,
  ApiStatus,
} from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function requestApi<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(
      "Tidak dapat terhubung ke server backend. Pastikan server Flask berjalan di port 5000."
    );
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // Non-JSON response
  }

  if (!res.ok || (data && data.error)) {
    throw new Error(
      (data && data.error) || `Server mengembalikan status HTTP ${res.status}.`
    );
  }

  return data as T;
}

export const api = {
  checkStatus: () => requestApi<ApiStatus>("GET", "/api/status"),

  generateProposal: (data: {
    nama_kegiatan: string;
    organisasi: string;
    lokasi: string;
    peserta: number;
    durasi: number;
    total_pagu: number;
  }) =>
    requestApi<{ ok: boolean; record: ProposalRecord }>(
      "POST",
      "/api/generate-proposal",
      data
    ),

  auditBudget: (data: {
    nama_kegiatan: string;
    deskripsi: string;
    rincian: string;
  }) =>
    requestApi<{ ok: boolean; record: AuditRecord }>(
      "POST",
      "/api/audit-budget",
      data
    ),

  generateDoc: (data: {
    jenis: string;
    nama_kegiatan: string;
    organisasi: string;
    penerima: string;
    tanggal: string;
    lokasi: string;
    detail: string;
  }) =>
    requestApi<{ ok: boolean; record: DocumentRecord }>(
      "POST",
      "/api/generate-doc",
      data
    ),

  getHistory: () => requestApi<HistoryResponse>("GET", "/api/history"),

  getHistoryItem: (type: string, id: number) =>
    requestApi<{ ok: boolean; record: any }>(
      "GET",
      `/api/history/${type}/${id}`
    ),

  deleteHistoryItem: (type: string, id: number) =>
    requestApi<{ ok: boolean }>("DELETE", `/api/history/${type}/${id}`),
};
