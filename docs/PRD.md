# PRD — Sistem Monitoring Makan Bergizi Gratis (MBG)

**Versi:** 1.0
**Tanggal:** 2 Juni 2026
**Status:** Draft — Mockup Interaktif (Dummy Data)
**Pemilik Produk:** —

---

## 1. Ringkasan Eksekutif

Sistem Monitoring **Makan Bergizi Gratis (MBG)** adalah platform digital untuk memantau rantai distribusi makanan bergizi gratis — mulai dari registrasi & verifikasi vendor, pemantauan distribusi makanan secara real-time, pengumpulan umpan balik penerima manfaat, hingga dashboard pengawasan untuk regulator yang dilengkapi analitik AI sederhana.

Dokumen ini mendefinisikan **mockup interaktif berbasis data dummy** — bukan sistem produksi. Tujuannya adalah memvalidasi alur pengguna, tata letak UI/UX, dan nilai produk sebelum pengembangan backend penuh.

### Tujuan Mockup
- Mendemonstrasikan **5 modul utama** dengan alur lengkap (klik-able, navigasi nyata).
- Menggunakan **data dummy** yang realistis (vendor, distribusi, feedback) — tanpa backend nyata.
- Menyajikan **UI/UX modern**, **mobile-friendly**, dan mendukung **PWA** (installable, offline shell).
- Menjadi bahan presentasi ke stakeholder/regulator.

### Non-Tujuan (Out of Scope untuk Mockup)
- Backend/database produksi, autentikasi nyata, integrasi pihak ketiga.
- OCR nyata, GPS hardware nyata, model AI terlatih (semua disimulasikan).
- Skalabilitas, keamanan tingkat produksi, audit log.

---

## 2. Persona & Pengguna

| Persona | Deskripsi | Kebutuhan Utama |
|---|---|---|
| **Vendor / Penyedia Makanan** | UMKM/dapur umum yang menyediakan makanan | Registrasi mudah, status verifikasi jelas, input distribusi cepat dari HP |
| **Petugas Lapangan / Kurir** | Mengantar makanan ke titik distribusi | Check-in/out lokasi, upload foto bukti, alur ringan di mobile |
| **Penerima Manfaat** | Siswa/masyarakat penerima makanan | Beri rating & komentar via QR Code, tanpa login |
| **Regulator / Pengawas** | Pemerintah/dinas yang mengawasi program | Dashboard agregat, peta distribusi, deteksi keluhan, tren sentimen |

---

## 3. Modul & Fitur

### Modul 1 — Vendor Registration & Verification
**Tujuan:** Mendaftarkan dan memverifikasi vendor sebelum aktif melayani.

**Fitur:**
- **Registrasi vendor** — form multi-langkah (data usaha, PIC, alamat, kapasitas produksi).
- **Upload dokumen** — NIB, NPWP, sertifikat halal, izin usaha (PIRT), foto dapur.
- **OCR dokumen dasar** — *simulasi*: ekstraksi otomatis nomor NIB/NPWP dari dokumen yang diupload, ditampilkan untuk konfirmasi.
- **Status verifikasi** — badge status: `Draft → Menunggu Review → Terverifikasi / Ditolak`.
- **Approval/Rejection workflow** — sisi regulator: review dokumen, setujui/tolak dengan catatan.

**Output:**
- **Vendor Dashboard** — ringkasan status, distribusi, rating vendor tsb.
- **Digital Vendor Profile** — kartu profil vendor (logo, status terverifikasi, kapasitas, rating, riwayat).

**Kriteria Penerimaan:**
- Form registrasi tervalidasi tiap langkah; bisa simpan-draft.
- Upload menampilkan preview file & hasil "OCR" terisi otomatis (dummy).
- Workflow approval mengubah status secara visual & mencatat catatan reviewer.

---

### Modul 2 — Distribution Monitoring
**Tujuan:** Memantau pengiriman makanan dari vendor ke titik distribusi.

**Fitur:**
- **Input pengiriman makanan** — buat distribusi: vendor, titik tujuan, jumlah porsi, menu, jadwal.
- **GPS tracking sederhana** — *simulasi*: posisi kurir bergerak di peta (animasi titik), estimasi tiba.
- **Upload foto bukti** — foto makanan & foto serah-terima di lokasi.
- **Check-in/check-out lokasi** — kurir check-in saat tiba & check-out saat selesai, dengan timestamp & lokasi.

**Output:**
- **Dashboard monitoring pengiriman** — daftar & status distribusi (`Dijadwalkan / Dalam Perjalanan / Tiba / Selesai`), filter per vendor/tanggal/wilayah, peta titik aktif.

**Kriteria Penerimaan:**
- Distribusi baru muncul di list & peta.
- Status berubah saat check-in/out; timeline event tercatat.
- Foto bukti tampil di detail distribusi.

---

### Modul 3 — Feedback & Complaint
**Tujuan:** Mengumpulkan kepuasan & keluhan penerima manfaat.

**Fitur:**
- **QR Code pada distribusi** — tiap distribusi punya QR; scan membuka form feedback publik (tanpa login).
- **Rating 1–5** — bintang kepuasan.
- **Komentar** — teks bebas.
- **Upload foto** — opsional, mis. kondisi makanan.

**Output:**
- **Data kepuasan penerima manfaat** — agregasi rating, daftar komentar, flag keluhan, terhubung ke distribusi/vendor.

**Kriteria Penerimaan:**
- Form feedback dapat dibuka dari halaman QR (deep link).
- Submit menambahkan entri ke data kepuasan (dummy state).
- Keluhan (rating ≤ 2 atau kata kunci negatif) ditandai khusus.

---

### Modul 4 — Command Center Dashboard
**Tujuan:** Pusat kendali untuk regulator melihat kondisi program secara menyeluruh.

**Komponen:**
- **Jumlah vendor** (total & per status verifikasi).
- **Vendor aktif** (yang melakukan distribusi dalam periode).
- **Distribusi hari ini** (jumlah porsi, jumlah titik).
- **Keluhan masuk** (count + daftar terbaru).
- **Rating rata-rata** (skor & tren).
- **Peta distribusi** — sebaran titik distribusi & vendor di peta.

**Kriteria Penerimaan:**
- Kartu KPI terisi dari data dummy & konsisten dengan modul lain.
- Peta menampilkan marker; klik marker → ringkasan.
- Ada grafik tren (distribusi/rating/sentimen) sederhana.

---

### Modul 5 — Basic AI Analytics (Sentiment Analysis)
**Tujuan:** Mengklasifikasi sentimen komentar penerima manfaat.

**Fitur:**
- **Sentiment Analysis** — *simulasi*: klasifikasi komentar → **Positif / Netral / Negatif** (rule-based/keyword dummy, bukan model nyata).

**Input:** Feedback penerima (komentar teks).
**Output:** Label `Positif / Netral / Negatif` + ringkasan distribusi sentimen (donut/bar chart) di Command Center.

**Kriteria Penerimaan:**
- Tiap komentar punya label sentimen yang ditampilkan.
- Agregasi sentimen tampil sebagai chart & dapat difilter (per vendor/periode).

---

## 4. Kebutuhan Non-Fungsional

| Kategori | Kebutuhan |
|---|---|
| **UI/UX** | Modern, bersih, konsisten; design system (warna, tipografi, komponen) terpusat. Mode terang (gelap opsional). |
| **Mobile-friendly** | Responsive mobile-first; alur lapangan (kurir, feedback QR) dioptimalkan untuk HP. |
| **PWA** | Web App Manifest, service worker, installable ("Add to Home Screen"), app shell offline, ikon & splash. |
| **Performa** | Mockup ringan; first load cepat; navigasi instan (SPA). |
| **Aksesibilitas** | Kontras memadai, label form, navigasi keyboard dasar. |
| **Data** | Seluruhnya dummy (in-memory / JSON / localStorage); dapat di-reset. |
| **i18n** | Bahasa Indonesia sebagai default. |

---

## 5. Tech Stack (Usulan untuk Mockup)

> Final stack dikonfirmasi di Implementation Plan. Usulan default:

- **Framework:** Next.js (App Router) + React + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui (komponen) + lucide-react (ikon)
- **State/data dummy:** Zustand atau React Context + seed JSON; persist via localStorage
- **Peta:** React-Leaflet + OpenStreetMap (gratis, tanpa API key)
- **Chart:** Recharts
- **PWA:** next-pwa / Workbox + manifest
- **QR:** `qrcode` (generate) + halaman feedback via route param

---

## 6. Arsitektur Informasi & Navigasi

```
/                       → Landing / pilih peran (demo switcher)
/vendor
  /register             → Registrasi multi-step + upload + OCR sim
  /dashboard            → Vendor Dashboard
  /profile/[id]         → Digital Vendor Profile
/distribution
  /new                  → Input pengiriman
  /track/[id]           → GPS tracking + check-in/out + upload bukti
  /monitor              → Dashboard monitoring pengiriman
/feedback
  /[distributionId]     → Form feedback publik (target QR)
/admin (Regulator)
  /command-center       → Command Center Dashboard
  /verification         → Approval/Rejection workflow
  /analytics            → Sentiment Analysis
```

Disertai **Role Switcher** (Vendor / Kurir / Regulator / Penerima) untuk memudahkan demo tanpa login nyata.

---

## 7. Metrik Keberhasilan Mockup
- Seluruh 5 modul dapat didemonstrasikan end-to-end tanpa error.
- Dapat di-install sebagai PWA di perangkat mobile.
- Stakeholder memahami nilai produk dari satu sesi demo (< 15 menit).
- Data antar-modul konsisten (vendor → distribusi → feedback → command center).

## 8. Risiko & Asumsi
- **Asumsi:** Data dummy cukup untuk validasi konsep; tidak ada integrasi nyata.
- **Risiko:** Simulasi (OCR/GPS/AI) bisa disalahartikan sebagai fungsional — beri label "Simulasi/Demo".
- **Risiko:** Peta/PWA butuh HTTPS untuk fitur penuh — gunakan deploy preview (Vercel) saat demo.

## 9. Referensi
- Implementation Plan: [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)
- Progress Tracker: [PROGRESS_TRACKER.md](PROGRESS_TRACKER.md)
