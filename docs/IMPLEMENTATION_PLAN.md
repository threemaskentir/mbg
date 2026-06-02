# Implementation Plan — Mockup Interaktif MBG

**Versi:** 1.0
**Tanggal:** 2 Juni 2026
**Acuan:** [PRD.md](PRD.md) · Tracker: [PROGRESS_TRACKER.md](PROGRESS_TRACKER.md)

---

## 1. Tujuan & Lingkup Teknis
Membangun **mockup interaktif** (frontend-only, data dummy) untuk 5 modul MBG dengan UI/UX modern, mobile-friendly, dan PWA. Tidak ada backend nyata; semua data dari seed JSON + state lokal yang bisa di-reset.

---

## 2. Tech Stack (Final)

| Layer | Pilihan | Alasan |
|---|---|---|
| Framework | **Next.js 14+ (App Router) + TypeScript** | Routing, PWA, deploy mudah (Vercel) |
| Styling | **Tailwind CSS + shadcn/ui** | Komponen modern konsisten, cepat |
| Ikon | **lucide-react** | Ringan, lengkap |
| State | **Zustand** + seed JSON, persist `localStorage` | Sederhana, lintas-modul |
| Peta | **React-Leaflet + OSM** | Gratis tanpa API key |
| Chart | **Recharts** | KPI & tren ringan |
| QR | **qrcode** (generate) | Deep link feedback |
| PWA | **@ducanh2912/next-pwa** + manifest | Installable + offline shell |
| Animasi | **framer-motion** (opsional) | Transisi halus, simulasi GPS |

> Alternatif ringan: **Vite + React** bila tidak butuh SSR. Default tetap Next.js.

---

## 3. Struktur Proyek (Rencana)

```
src/
  app/
    layout.tsx, page.tsx           # shell + landing/role switcher
    vendor/                        # register, dashboard, profile/[id]
    distribution/                  # new, track/[id], monitor
    feedback/[distributionId]/     # form feedback publik (QR target)
    admin/                         # command-center, verification, analytics
  components/                      # ui/ (shadcn), shared (Map, KpiCard, StatusBadge, PhotoUpload...)
  lib/
    data/                          # seed: vendors, distributions, feedback (JSON)
    store/                         # zustand stores
    sim/                           # ocr.ts, gps.ts, sentiment.ts (simulasi)
  styles/
public/                           # manifest.json, icons, sw
```

---

## 4. Pendekatan Simulasi (Dummy Engines)

- **OCR (`sim/ocr.ts`)** — saat file diupload, kembalikan field terstruktur (NIB/NPWP/nama) dari mapping dummy + delay tiruan; tampilkan untuk konfirmasi.
- **GPS (`sim/gps.ts`)** — interpolasi koordinat antara vendor → titik tujuan, update tiap N detik; status berubah otomatis.
- **Sentiment (`sim/sentiment.ts`)** — rule-based keyword (mis. "enak/baik" → Positif, "basi/telat/buruk" → Negatif, sisanya Netral) + skor.

Semua diberi label **"Simulasi/Demo"** di UI.

---

## 5. Fase Pengerjaan

### Fase 0 — Fondasi (Setup)
- Inisialisasi Next.js + TS + Tailwind + shadcn/ui.
- Design tokens (warna brand MBG, tipografi), layout shell, role switcher.
- Konfigurasi PWA dasar (manifest + ikon + service worker) — diuji di akhir.
- Seed data dummy (vendors, distributions, feedback) + Zustand stores.

### Fase 1 — Modul 1: Vendor Registration & Verification
- Form registrasi multi-step + validasi + simpan draft.
- Komponen upload dokumen + preview + OCR simulasi.
- Status badge & state machine (`Draft→Review→Verified/Rejected`).
- Vendor Dashboard + Digital Vendor Profile.
- Approval/Rejection workflow (sisi admin) — di `/admin/verification`.

### Fase 2 — Modul 2: Distribution Monitoring
- Form input pengiriman.
- Halaman tracking: peta + GPS simulasi + check-in/out + upload foto bukti.
- Dashboard monitoring (list + filter + peta titik aktif + timeline status).

### Fase 3 — Modul 3: Feedback & Complaint
- Generate QR per distribusi (di detail distribusi).
- Halaman feedback publik (rating, komentar, upload foto) via `/feedback/[id]`.
- Simpan ke store; tandai keluhan (rating ≤2 / kata negatif).

### Fase 4 — Modul 5: AI Sentiment (didahulukan agar feed ke dashboard)
- Engine sentiment simulasi pada komentar.
- Halaman `/admin/analytics`: chart distribusi sentimen + filter.

### Fase 5 — Modul 4: Command Center Dashboard
- KPI cards (vendor, aktif, distribusi hari ini, keluhan, rating).
- Peta distribusi gabungan + marker interaktif.
- Grafik tren (distribusi/rating/sentimen).

### Fase 6 — Polish, PWA & Demo
- Responsiveness pass (mobile-first), empty/loading states, micro-interactions.
- Finalisasi PWA: installable, offline app-shell, ikon/splash, Lighthouse check.
- Reset-data control, seed konsistensi lintas modul.
- Deploy preview (Vercel) + README cara demo.

---

## 6. Dependensi Antar-Fase
- Fase 1 → 2 → 3 berurutan (vendor → distribusi → feedback).
- Fase 4 (sentiment) butuh data feedback (Fase 3).
- Fase 5 (command center) butuh data dari semua modul → dikerjakan setelahnya.

---

## 7. Definition of Done (per modul)
- Alur utama dapat diselesaikan tanpa error di desktop & mobile.
- Data konsisten & persist (reload tidak hilang) hingga di-reset.
- Komponen mengikuti design system; ada loading/empty state.
- Label "Simulasi" pada fitur tiruan (OCR/GPS/AI).

---

## 8. Estimasi (indikatif, 1 dev)
| Fase | Estimasi |
|---|---|
| 0 Fondasi | 1–2 hari |
| 1 Vendor | 2–3 hari |
| 2 Distribusi | 2–3 hari |
| 3 Feedback | 1–2 hari |
| 4 Sentiment | 1 hari |
| 5 Command Center | 2 hari |
| 6 Polish/PWA/Demo | 1–2 hari |
| **Total** | **~10–15 hari kerja** |

---

## 9. Langkah Berikutnya
1. Konfirmasi tech stack (Next.js default).
2. Setup repo (Fase 0).
3. Update [PROGRESS_TRACKER.md](PROGRESS_TRACKER.md) tiap task selesai.
