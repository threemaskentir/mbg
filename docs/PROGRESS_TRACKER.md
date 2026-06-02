# Progress Tracker — Mockup Interaktif MBG

**Acuan:** [PRD.md](PRD.md) · [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)
**Update terakhir:** 2 Juni 2026

**Legend status:** ⬜ Belum · 🟡 Proses · ✅ Selesai · 🚫 Blok

---

## Ringkasan Progress

| Fase | Modul | Status | Progress |
|---|---|---|---|
| 0 | Fondasi & Setup | ✅ | 90% |
| 1 | Vendor Registration & Verification | ✅ | 100% |
| 2 | Distribution Monitoring | ✅ | 100% |
| 3 | Feedback & Complaint | ✅ | 100% |
| 4 | AI Sentiment Analysis | ✅ | 100% |
| 5 | Command Center Dashboard | ✅ | 100% |
| 6 | Polish, PWA & Demo | ✅ | 95% |
| | **TOTAL** | ✅ | **~98%** |

> Scaffold mockup selesai & `npm run build` hijau. Seluruh route render 200.
> Lighthouse desktop: Performance 100 · Accessibility 95 · Best Practices 100 · SEO 100.
> Sisa: eksekusi `vercel` (butuh login akun) — konfigurasi deploy sudah siap.

---

## Fase 0 — Fondasi & Setup
- [x] Inisialisasi Next.js + TypeScript
- [x] Setup Tailwind CSS v4 + komponen CSS (.btn/.card/.input) + lucide-react
- [x] Design tokens (warna brand MBG, tipografi) + tema
- [x] Layout shell (header, nav, container responsive)
- [x] Role Switcher (Vendor / Kurir / Regulator / Penerima)
- [x] Seed data dummy: vendors, distributions, feedback (JSON)
- [x] Setup Zustand store + persist localStorage + tombol Reset Data
- [x] Konfigurasi PWA dasar (manifest, ikon, service worker)

## Fase 1 — Vendor Registration & Verification
- [x] Form registrasi multi-step (data usaha, PIC, alamat, kapasitas)
- [x] Validasi per langkah + simpan draft
- [x] Komponen upload dokumen + preview (NIB, NPWP, halal, PIRT, foto dapur)
- [x] OCR simulasi (auto-fill field dari dokumen) + konfirmasi
- [x] Status badge + state machine (Draft→Review→Verified/Rejected)
- [x] Vendor Dashboard (ringkasan status, distribusi, rating)
- [x] Digital Vendor Profile (kartu profil + riwayat)
- [x] Approval/Rejection workflow (sisi admin) + catatan reviewer

## Fase 2 — Distribution Monitoring
- [x] Form input pengiriman (vendor, titik, porsi, menu, jadwal)
- [x] Halaman tracking + peta (MapCanvas — peta SVG kustom)
- [x] GPS tracking simulasi (titik bergerak + ETA)
- [x] Check-in / check-out lokasi (timestamp + lokasi)
- [x] Upload foto bukti (makanan + serah-terima)
- [x] Dashboard monitoring (list + filter vendor/tanggal/wilayah)
- [x] Status pipeline (Dijadwalkan/Dalam Perjalanan/Tiba/Selesai) + timeline
- [x] Peta titik aktif di dashboard

## Fase 3 — Feedback & Complaint
- [x] Generate QR Code per distribusi
- [x] Halaman feedback publik `/feedback/[id]` (tanpa login)
- [x] Rating 1–5 (bintang)
- [x] Komentar teks
- [x] Upload foto (opsional)
- [x] Simpan ke store + relasi ke distribusi/vendor
- [x] Penandaan keluhan (rating ≤2 / kata kunci negatif)

## Fase 4 — AI Sentiment Analysis
- [x] Engine sentiment simulasi (rule-based) Positif/Netral/Negatif
- [x] Label sentimen pada tiap komentar
- [x] Halaman `/admin/analytics` + chart distribusi sentimen
- [x] Filter sentimen per vendor/periode

## Fase 5 — Command Center Dashboard
- [x] KPI: Jumlah vendor (total & per status)
- [x] KPI: Vendor aktif
- [x] KPI: Distribusi hari ini (porsi & titik)
- [x] KPI: Keluhan masuk + daftar terbaru
- [x] KPI: Rating rata-rata + tren
- [x] Peta distribusi gabungan + marker interaktif
- [x] Grafik tren (distribusi/rating/sentimen)

## Fase 6 — Polish, PWA & Demo
- [x] Responsiveness pass (mobile-first) semua halaman
- [x] Empty/loading states + micro-interactions
- [x] PWA: installable + offline app-shell + ikon/splash + halaman offline fallback
- [x] Halaman 404 (not-found) bergaya
- [x] Audit Lighthouse → Perf 100 / A11y 95 / Best Practices 100 / SEO 100
- [x] Konsistensi data lintas modul + Reset Data
- [x] Konfigurasi deploy Vercel siap (`vercel.json` + build webpack)
- [ ] Eksekusi deploy preview (Vercel) — butuh `vercel login` (akun pengguna)
- [x] README cara menjalankan & alur demo

---

## Catatan / Log Perubahan
| Tanggal | Catatan |
|---|---|
| 2026-06-02 | Dokumen PRD, Implementation Plan, Progress Tracker dibuat. |
| 2026-06-02 | Scaffold mockup dibuat (Next.js 16 + Tailwind v4 + Zustand). 5 modul + 11 route, `npm run build` hijau. Peta diimplementasikan sebagai SVG kustom (bukan Leaflet); komponen UI memakai CSS classes (bukan shadcn). |
| 2026-06-02 | Fix hydration mismatch (Zustand persist `skipHydration` + `StoreHydrator`). |
| 2026-06-02 | Fase 6: offline fallback + halaman 404, audit Lighthouse (100/95/100/100), konfigurasi deploy Vercel (`vercel.json`). |

## Blocker Aktif
_Tidak ada._
