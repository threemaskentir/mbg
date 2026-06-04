# Modul 4 — Command Center & KPI

Pusat kendali regulator: ringkasan program secara menyeluruh + peta + KPI
capaian.

- **Peran:** Regulator
- **Halaman:** `/admin/command-center`
- **Output:** KPI program, peta distribusi (cluster), tren, sentimen, keluhan, KPI capaian

---

## Membuka Command Center

**Langkah:**
1. Switcher peran → **Regulator** → otomatis ke **Command Center** (atau klik
   menu **Command Center**).

---

## Bagian-bagian halaman

### 1. KPI ringkas (atas)
Kartu: **Jumlah Vendor**, **Vendor Aktif**, **Distribusi**, **Porsi**,
**Keluhan**, **Rating Rata-rata** — dihitung langsung dari data dummy & konsisten
dengan modul lain.

### 2. Peta Distribusi (dengan cluster)
- Marker **dapur (hijau)** & **titik distribusi (biru)**.
- Titik berdekatan **dikelompokkan** menjadi lingkaran ber-angka. **Zoom in**
  untuk memecah cluster → marker individual (hover untuk nama).
- Legenda warna ada di pojok kartu peta.

### 3. Tren Distribusi (7 hari)
Grafik area jumlah distribusi per hari.

### 4. Sentimen Penerima
Donut Positif/Netral/Negatif + tautan **Lihat analitik lengkap** ke
[Modul 5](05-ai-analytics-sentiment.md).

### 5. Keluhan Terbaru
Daftar keluhan (rating ≤2 / sentimen negatif) dengan rating, komentar, vendor,
dan waktu.

### 6. KPI Program (Stakeholder) — *capaian vs target nasional*
Kartu capaian (semua **Tercapai**), antara lain:
Penerima manfaat aktif ≥99%, Ketepatan distribusi ≥99%, Kepatuhan standar gizi
≥98%, Food safety 100%, Food poisoning outbreak 0 kasus, Serapan anggaran
95–100%, Kepuasan penerima ≥90%.

### 7. KPI Platform (Penyedia Solusi) — *dampak digitalisasi*
Waktu perizinan vendor ↓70%, Vendor bersertifikasi ≥97%, Insiden kualitas ↓50%,
Food waste ↓30%, Partisipasi UMKM ↑40%, Respon pengaduan <24 jam, Akurasi data
nasional ≥95%, Kepuasan penerima ≥90%.

**Cara membaca kartu KPI:** angka besar = **capaian**; panah ↓/↑ = arah
perubahan yang baik; baris **Target** = ambang yang dituju; badge hijau
**Tercapai**.

---

## Catatan simulasi
- KPI ringkas (bagian 1–5) **dihitung dari data dummy** dan ikut berubah bila
  Anda menambah vendor/distribusi/feedback.
- KPI capaian (bagian 6–7) adalah **nilai target/capaian statis (demo)** —
  dapat disesuaikan di kode (array `STAKEHOLDER_KPI` / `PLATFORM_KPI`).
