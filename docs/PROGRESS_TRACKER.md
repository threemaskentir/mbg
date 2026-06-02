# Progress Tracker — Mockup Interaktif MBG

**Acuan:** [PRD.md](PRD.md) · [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)
**Update terakhir:** 2 Juni 2026

**Legend status:** ⬜ Belum · 🟡 Proses · ✅ Selesai · 🚫 Blok

---

## Ringkasan Progress

| Fase | Modul | Status | Progress |
|---|---|---|---|
| 0 | Fondasi & Setup | ⬜ | 0% |
| 1 | Vendor Registration & Verification | ⬜ | 0% |
| 2 | Distribution Monitoring | ⬜ | 0% |
| 3 | Feedback & Complaint | ⬜ | 0% |
| 4 | AI Sentiment Analysis | ⬜ | 0% |
| 5 | Command Center Dashboard | ⬜ | 0% |
| 6 | Polish, PWA & Demo | ⬜ | 0% |
| | **TOTAL** | ⬜ | **0%** |

---

## Fase 0 — Fondasi & Setup
- [ ] Inisialisasi Next.js + TypeScript
- [ ] Setup Tailwind CSS + shadcn/ui + lucide-react
- [ ] Design tokens (warna brand MBG, tipografi) + tema
- [ ] Layout shell (header, nav, container responsive)
- [ ] Role Switcher (Vendor / Kurir / Regulator / Penerima)
- [ ] Seed data dummy: vendors, distributions, feedback (JSON)
- [ ] Setup Zustand store + persist localStorage + tombol Reset Data
- [ ] Konfigurasi PWA dasar (manifest, ikon, service worker)

## Fase 1 — Vendor Registration & Verification
- [ ] Form registrasi multi-step (data usaha, PIC, alamat, kapasitas)
- [ ] Validasi per langkah + simpan draft
- [ ] Komponen upload dokumen + preview (NIB, NPWP, halal, PIRT, foto dapur)
- [ ] OCR simulasi (auto-fill field dari dokumen) + konfirmasi
- [ ] Status badge + state machine (Draft→Review→Verified/Rejected)
- [ ] Vendor Dashboard (ringkasan status, distribusi, rating)
- [ ] Digital Vendor Profile (kartu profil + riwayat)
- [ ] Approval/Rejection workflow (sisi admin) + catatan reviewer

## Fase 2 — Distribution Monitoring
- [ ] Form input pengiriman (vendor, titik, porsi, menu, jadwal)
- [ ] Halaman tracking + peta (React-Leaflet + OSM)
- [ ] GPS tracking simulasi (titik bergerak + ETA)
- [ ] Check-in / check-out lokasi (timestamp + lokasi)
- [ ] Upload foto bukti (makanan + serah-terima)
- [ ] Dashboard monitoring (list + filter vendor/tanggal/wilayah)
- [ ] Status pipeline (Dijadwalkan/Dalam Perjalanan/Tiba/Selesai) + timeline
- [ ] Peta titik aktif di dashboard

## Fase 3 — Feedback & Complaint
- [ ] Generate QR Code per distribusi
- [ ] Halaman feedback publik `/feedback/[id]` (tanpa login)
- [ ] Rating 1–5 (bintang)
- [ ] Komentar teks
- [ ] Upload foto (opsional)
- [ ] Simpan ke store + relasi ke distribusi/vendor
- [ ] Penandaan keluhan (rating ≤2 / kata kunci negatif)

## Fase 4 — AI Sentiment Analysis
- [ ] Engine sentiment simulasi (rule-based) Positif/Netral/Negatif
- [ ] Label sentimen pada tiap komentar
- [ ] Halaman `/admin/analytics` + chart distribusi sentimen
- [ ] Filter sentimen per vendor/periode

## Fase 5 — Command Center Dashboard
- [ ] KPI: Jumlah vendor (total & per status)
- [ ] KPI: Vendor aktif
- [ ] KPI: Distribusi hari ini (porsi & titik)
- [ ] KPI: Keluhan masuk + daftar terbaru
- [ ] KPI: Rating rata-rata + tren
- [ ] Peta distribusi gabungan + marker interaktif
- [ ] Grafik tren (distribusi/rating/sentimen)

## Fase 6 — Polish, PWA & Demo
- [ ] Responsiveness pass (mobile-first) semua halaman
- [ ] Empty/loading states + micro-interactions
- [ ] PWA: installable + offline app-shell + ikon/splash
- [ ] Audit Lighthouse (PWA + performa)
- [ ] Konsistensi data lintas modul + Reset Data
- [ ] Deploy preview (Vercel)
- [ ] README cara menjalankan & alur demo

---

## Catatan / Log Perubahan
| Tanggal | Catatan |
|---|---|
| 2026-06-02 | Dokumen PRD, Implementation Plan, Progress Tracker dibuat. |

## Blocker Aktif
_Tidak ada._
