import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const nf = new Intl.NumberFormat("id-ID");

export function fmtRp(value: number | string | undefined | null): string {
  const n = Math.round(Number(value) || 0);
  return `Rp ${nf.format(n)}`;
}

export function fmtNumber(value: number | string | undefined | null): string {
  const n = Number(value) || 0;
  return nf.format(n);
}

export function fmtDate(dateStr: string | undefined | null): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr.replace(" ", "T"));
  return isNaN(d.getTime())
    ? dateStr
    : d.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

export function slug(str: string): string {
  return (
    String(str || "dokumen")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50) || "dokumen"
  );
}

export function downloadBlob(content: string, type: string, filename: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
