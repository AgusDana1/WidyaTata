# WidyaTata AI

**BUILD WITH AI, SOLVE FOR BALI** | AI Web Innovation Challenge - Bali DigiFest 2026 | Kategori: Education & Smart Information Systems

## Description

WidyaTata AI adalah sistem informasi berbasis web untuk tata kelola administrasi akademik, kepanitiaan kampus/sekolah, dan asisten anggaran cerdas di Bali. Pengurus BEM/UKM, OSIS, Pramuka/Dewan Kerja, dan komunitas pemuda dapat menyusun proposal, RAB, audit anggaran, surat resmi, dan LPJ dalam hitungan menit, lalu menyimpannya di arsip digital.

## Problem & Target User

**Masalah.** Panitia kegiatan pelajar dan mahasiswa di Bali umumnya bekerja tanpa pendamping administrasi. Proposal disusun dari nol, RAB sering tidak sesuai pagu, pos krusial (izin banjar/tempat, banten, P3K, dokumentasi) terlewat, dan surat serta LPJ ditulis berulang kali dengan format berbeda-beda.

**Pengguna sasaran.**
- Pengurus BEM/UKM kampus
- Pengurus OSIS SMA/SMK
- Pramuka dan Dewan Kerja
- Komunitas pemuda Bali
- Pembina atau pembimbing yang meninjau proposal dan anggaran

## Key Features

1. **Smart Proposal & RAB Architect.** Input nama kegiatan, kategori organisasi, lokasi di Bali, jumlah peserta, durasi, dan pagu. Hasilnya ringkasan eksekutif, latar belakang kontekstual Bali, tujuan, rundown per hari, dan tabel RAB (divisi, item, qty, satuan, harga satuan, total). Total RAB dikunci tepat sama dengan pagu oleh kode Python.
2. **AI Budget & Feasibility Auditor.** Audit anggaran manual: Feasibility Score 0-100, status kelayakan, analisis efisiensi tiap pos, deteksi item krusial yang terlewat, dan rekomendasi optimasi.
3. **Smart Correspondence & LPJ Generator.** Surat peminjaman gedung, undangan pemateri/juri, permohonan sponsorship, dan ringkasan LPJ.
4. **Dashboard Arsip & Analitik (SQLite).** Riwayat proposal, audit, dan dokumen; lihat detail, hapus arsip, serta statistik ringkas.
5. **Fitur pendukung.** Tombol "Muat Contoh Input Cepat (Demo Juri)" dengan 3 studi kasus Bali di tiap fitur, Cetak/Simpan PDF (print view), Export RAB ke CSV, salin/unduh teks dokumen, dan indikator loading.

## Tech Stack

| Lapisan | Teknologi |
|---|---|
| Frontend | Next.js 15 (React 19, TypeScript, Tailwind CSS, Lucide Icons) |
| Backend | Python 3, Flask, gunicorn |
| Database | SQLite (`widyatata.db`) via modul `sqlite3` bawaan Python |
| AI | Google Gemini API, model `gemini-3.1-flash-lite`, melalui REST dengan `requests` |
| Konfigurasi | `python-dotenv` & Next.js environment variable |

## AI Implementation

- Backend memanggil endpoint REST `generateContent` Gemini dengan `responseMimeType: "application/json"` agar keluaran selalu berupa JSON.
- Tiap fitur memiliki system instruction (persona konsultan administrasi kegiatan di Bali) dan skema JSON eksplisit di dalam prompt.
- **Validasi di sisi server.** Setiap field hasil AI dibersihkan dan dipaksa ke tipe yang benar. Skor audit dibatasi 0-100.
- **Presisi RAB.** AI tidak dipercaya untuk berhitung. Backend menghitung ulang `total_harga`, menskalakan harga satuan bila total jauh dari pagu, lalu menutup selisih dengan item "Dana Tak Terduga & Penyesuaian" sehingga total RAB sama dengan pagu.
- **Penanganan error.** Timeout, kuota habis (HTTP 429), API Key tidak valid, pemblokiran keamanan, respons kosong, dan JSON rusak (dicoba ulang 1 kali) dikembalikan sebagai pesan JSON yang jelas. Aplikasi tidak crash.
- API Key dibaca dari `os.getenv("GEMINI_API_KEY")` dan dikirim melalui header dari backend. Key tidak pernah berada di kode sumber atau di browser.

## Architecture / Data Flow

```
User -> Frontend (Next.js 15, React 19, TypeScript + Tailwind)
     -> Backend (Flask: /api/* via Next.js Proxy/CORS)
     -> Database (SQLite: widyatata.db)
     -> AI/API (Gemini gemini-3.1-flash-lite)
     -> Result (validasi + simpan ke SQLite -> JSON -> render di frontend)
```

Struktur proyek:

```
widyatata-ai/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── AuditTab.tsx
│   │   ├── DashboardTab.tsx
│   │   ├── DetailModal.tsx
│   │   ├── Disclosure.tsx
│   │   ├── DocumentTab.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── LoadingOverlay.tsx
│   │   ├── ProposalTab.tsx
│   │   ├── ScoreGauge.tsx
│   │   └── Toast.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── app.py
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── requirements.txt
├── .env.example
├── .gitignore
├── README.md
└── templates/
    └── index.html (fallback)
```

Endpoint:

| Method | Path | Fungsi |
|---|---|---|
| POST | `/api/generate-proposal` | Proposal + RAB |
| POST | `/api/audit-budget` | Audit anggaran |
| POST | `/api/generate-doc` | Surat / LPJ |
| GET | `/api/history` | Daftar arsip + statistik |
| GET | `/api/history/<type>/<id>` | Detail arsip (`proposal`, `audit`, `document`) |
| DELETE | `/api/history/<type>/<id>` | Hapus arsip |
| GET | `/api/status` | Status konfigurasi AI |

## Run Instructions

Prasyarat: Python 3.10+, Node.js 18+, dan API Key Gemini dari Google AI Studio.

1. **Jalankan Backend (Flask API - Port 5000):**
```bash
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env              # Windows: copy .env.example .env
# Buka .env lalu isi GEMINI_API_KEY dengan key Anda

python app.py                     # Backend berjalan di http://localhost:5000
```

2. **Jalankan Frontend (Next.js - Port 3000):**
```bash
npm install
npm run dev                       # Buka http://localhost:3000
```

> **Catatan:** Next.js secara otomatis mem-proxy semua request `/api/*` ke backend Flask di `http://127.0.0.1:5000` melalui `next.config.mjs`, sehingga tidak ada masalah CORS.

Produksi: `gunicorn app:app --bind 0.0.0.0:$PORT --timeout 120`. Set `GEMINI_API_KEY` sebagai environment variable di platform hosting. Jangan unggah file `.env` ke repositori publik.

Alur demo cepat: pilih satu tombol "Muat Contoh Input Cepat (Demo Juri)" di tiap tab, jalankan AI, lalu buka tab Arsip & Analitik.

## Known Limitations

- Seluruh keluaran adalah draf AI. Harga dan isi surat harus diverifikasi pengurus dan pembina.
- Harga satuan merupakan estimasi umum, bukan data harga pasar real-time.
- Belum ada login atau multi-pengguna. Semua arsip berada dalam satu database lokal.
- Kecepatan dan ketersediaan bergantung pada kuota serta jaringan Gemini API.
- Cetak PDF memakai fitur print browser, bukan generator PDF di server.
- Tailwind dan font dimuat dari CDN sehingga membutuhkan internet saat halaman dibuka.
- SQLite di hosting dengan disk sementara dapat kehilangan data saat server restart.

## AI & Technology Disclosure

- **AI dalam aplikasi:** Google Gemini API (`gemini-2.5-flash`) menghasilkan teks proposal, rundown, item RAB, audit, surat, dan LPJ. Perhitungan total RAB dilakukan oleh kode Python, bukan AI.
- **Teknologi:** Flask, SQLite, Requests, python-dotenv, gunicorn, Tailwind CSS (CDN), Vanilla JavaScript, font Plus Jakarta Sans (Google Fonts).
- **Bantuan AI dalam pengembangan:** Kerangka kode proyek ini disusun dengan bantuan asisten AI, kemudian ditinjau, diuji, dan disesuaikan oleh tim. Sesuaikan pernyataan ini dengan proses kerja tim yang sebenarnya sebelum dikumpulkan.
- **Keamanan:** API Key disimpan di environment variable dan tidak ditulis di kode sumber. File `.env` dan `*.db` diabaikan oleh Git.
- **Data:** Contoh demo bersifat fiktif. Tidak ada data pribadi nyata yang dibutuhkan.
