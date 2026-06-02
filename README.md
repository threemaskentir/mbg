# MBG Monitor — Mockup Interaktif

Mockup interaktif (data dummy) sistem **Monitoring Makan Bergizi Gratis (MBG)**.
UI/UX modern, mobile-friendly, dan mendukung **PWA**.

📄 Dokumen: [PRD](docs/PRD.md) · [Implementation Plan](docs/IMPLEMENTATION_PLAN.md) · [Progress Tracker](docs/PROGRESS_TRACKER.md)

## Menjalankan

```bash
npm install        # sudah terpasang
npm run dev        # mode pengembangan → http://localhost:3000
npm run build      # build produksi
npm start          # jalankan hasil build
```

> Build & dev menggunakan **webpack** (`next dev/build --webpack`) karena
> service worker PWA (`@ducanh2912/next-pwa`) berbasis webpack. PWA aktif pada
> build produksi (`npm run build && npm start`), nonaktif saat `dev`.

## Tech Stack

- **Next.js 16** (App Router) + **TypeScript** + **React 19**
- **Tailwind CSS v4** (design system di `src/app/globals.css`)
- **Zustand** + `localStorage` (state & data dummy, dapat di-reset)
- **Recharts** (grafik) · **lucide-react** (ikon) · **qrcode** (QR)
- **Peta SVG kustom** (`MapCanvas`) — ringan, offline-friendly, tanpa API key
- **PWA** via `@ducanh2912/next-pwa` + `public/manifest.json`

## Struktur

```
src/
  app/
    page.tsx                       # Landing / hub modul
    (app)/                         # Halaman ber-shell (sidebar + role switcher)
      vendor/register|dashboard|profile/[id]
      distribution/new|monitor|track/[id]
      admin/command-center|verification|analytics
    feedback/[distributionId]/     # Form feedback publik (target QR, tanpa shell)
  components/                      # AppShell, MapCanvas, charts, badges, dsb.
  lib/
    types.ts                       # Model data
    data/seed.ts                   # Data dummy (vendor, distribusi, feedback)
    sim/                           # Simulasi: ocr.ts, gps.ts, sentiment.ts
    store.ts                       # Zustand store (persist)
public/
  manifest.json, icons/            # Aset PWA
```

## 5 Modul

1. **Registrasi & Verifikasi Vendor** — form multi-step, upload dokumen, OCR
   (simulasi), workflow approval/rejection, Vendor Dashboard & Profil Digital.
2. **Monitoring Distribusi** — input pengiriman, GPS tracking (simulasi),
   check-in/out, foto bukti, dashboard + peta.
3. **Feedback & Keluhan** — QR per distribusi, rating 1–5, komentar, foto.
4. **Command Center** — KPI program, peta, keluhan, tren, sentimen.
5. **AI Analitik Sentimen** — klasifikasi komentar Positif/Netral/Negatif
   (rule-based, simulasi).

## Deploy ke Vercel

Project sudah siap deploy. [`vercel.json`](vercel.json) memaksa build memakai
webpack (`next build --webpack`) agar service worker PWA tetap dibuat —
**penting**, karena default Vercel (`next build` / Turbopack) tidak kompatibel
dengan `next-pwa`.

```bash
npm i -g vercel      # sekali saja
vercel login         # autentikasi akun Anda
vercel               # deploy preview
vercel --prod        # deploy production
```

PWA & service worker aktif otomatis di hasil deploy (HTTPS) — aplikasi dapat
di-*install* dan app-shell tersedia offline.

## Audit Lighthouse (desktop, build produksi)

| Performance | Accessibility | Best Practices | SEO |
|:-:|:-:|:-:|:-:|
| 100 | 95 | 100 | 100 |

```bash
npm run build && npm start          # jalankan build produksi
npx lighthouse http://localhost:3000 --preset=desktop --view
```

## Alur Demo (saran)

1. **Beranda** → kenali 5 modul. Gunakan **Mode Demo — Peran** di sidebar.
2. **Vendor → Registrasi**: isi form, upload dokumen, jalankan **OCR**, kirim.
3. **Regulator → Verifikasi**: setujui/tolak vendor.
4. **Distribusi → Input**: buat pengiriman → **Tracking**: berangkatkan kurir,
   check-in, upload foto, check-out.
5. **Feedback (QR)**: dari tracking/monitor, buka form, beri rating & komentar.
6. **Command Center** & **Analitik Sentimen**: lihat agregasi & sentimen.
7. **Reset Data Demo** (sidebar) untuk kembali ke kondisi awal.

> ⚡ Semua data dummy. OCR, GPS, dan analisis sentimen adalah **simulasi** demo.
