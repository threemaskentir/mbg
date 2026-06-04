# Modul 3 — Feedback & Komplain

Mengumpulkan kepuasan & keluhan penerima manfaat, lengkap dengan QR Code,
rating, komentar, foto, dan penandaan keluhan otomatis.

- **Peran:** Penerima (konfirmasi & nilai), Regulator (memantau hasil)
- **Halaman:** `/penerima/konfirmasi`, `/penerima/feedback`, `/feedback/[id]` (publik via QR)
- **Output:** Data kepuasan penerima manfaat, penandaan keluhan

---

## A. Konfirmasi Kiriman Sampai (peran: Penerima)

**Langkah:**
1. Switcher peran → **Penerima** → otomatis ke **Konfirmasi Kiriman**
   (`/penerima/konfirmasi`).
2. Daftar kiriman yang sedang menuju/sudah tiba ditampilkan.
3. Pada kiriman yang diterima, klik **Konfirmasi Kiriman Sampai**.
4. Status berubah menjadi **Dikonfirmasi sampai** (waktu tercatat) dan muncul
   tombol **Beri Feedback**.

---

## B. Memberi Feedback (peran: Penerima)

Dua jalan membuka form penilaian:

**Jalur 1 — dari daftar Feedback:**
1. Peran **Penerima** → sidebar **Feedback** (`/penerima/feedback`).
2. Pilih distribusi (yang sudah Tiba/Selesai) → membuka form penilaian.

**Jalur 2 — via QR Code (publik, tanpa login):**
1. Buka halaman **Tracking** sebuah distribusi atau kartu di **Monitoring**.
2. Klik **Buka Halaman Feedback (QR)** / tombol **Feedback**.
3. Halaman publik `/feedback/[id]` terbuka — di bawahnya ada **QR Code** yang
   bisa ditempel di titik distribusi agar penerima memindainya.

**Mengisi form:**
1. Pilih **rating bintang 1–5**.
2. Tulis **komentar** — sentimen langsung dianalisis & ditampilkan (Positif/
   Netral/Negatif).
3. (Opsional) unggah **foto makanan**.
4. Klik **Kirim Penilaian** → layar terima kasih + label sentimen terdeteksi.

---

## C. Penandaan keluhan otomatis

Saat feedback dikirim, sistem menandainya sebagai **Keluhan** bila:
- **rating ≤ 2**, atau
- sentimen komentar **Negatif** (deteksi kata kunci).

Keluhan muncul khusus di **Command Center** ([Modul 4](04-command-center.md))
dan **Analitik & Feedback** ([Modul 5](05-ai-analytics-sentiment.md)).

---

## Output
- **Data Kepuasan Penerima** terhubung ke distribusi & vendor (memengaruhi
  rating vendor dan skor sentimen).

## Catatan simulasi
- Analisis sentimen berbasis **kata kunci** (rule-based), bukan model NLP nyata.
- Foto hanya pratinjau lokal (tidak diunggah ke server).
