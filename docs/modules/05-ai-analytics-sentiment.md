# Modul 5 — AI Analitik Sentimen

Mengklasifikasi komentar penerima manfaat menjadi **Positif / Netral / Negatif**
dan menyajikan agregasinya.

- **Peran:** Regulator
- **Halaman:** `/admin/analytics`
- **Input:** komentar feedback penerima
- **Output:** label sentimen + distribusi sentimen + daftar komentar/keluhan

---

## Membuka Analitik

**Langkah:**
1. Switcher peran → **Regulator**.
2. Sidebar → **Analitik & Feedback** (`/admin/analytics`).

---

## Yang ditampilkan & cara pakai

### 1. KPI sentimen (atas)
Total komentar, jumlah **Positif**, **Netral**, **Negatif**.

### 2. Filter per vendor
Dropdown di kanan atas: pilih **Semua Vendor** atau vendor tertentu untuk
memfokuskan analisis.

### 3. Distribusi Sentimen (donut)
Proporsi Positif/Netral/Negatif dari komentar terfilter, dengan legenda jumlah.

### 4. Kata Kunci Terdeteksi
Kata yang memicu klasifikasi (hijau = positif, merah = negatif) beserta
frekuensinya.

### 5. Komentar Penerima (daftar)
Setiap komentar menampilkan **rating bintang**, **label sentimen**, isi komentar,
vendor, dan waktu. Komentar yang ditandai **⚠ Keluhan** diberi latar merah.

---

## Alur demo cepat
1. Sebagai **Penerima**, kirim beberapa feedback dengan komentar berbeda
   (mis. "enak dan hangat" vs "nasi basi, telat") — lihat [Modul 3](03-feedback-complaint.md).
2. Kembali sebagai **Regulator** → **Analitik & Feedback**.
3. Amati donut & daftar komentar berubah; coba **filter per vendor**.

## Catatan simulasi
- Klasifikasi memakai **kamus kata kunci** (rule-based), bukan model NLP nyata —
  diberi label **AI Simulasi**.
- Struktur datanya siap diganti model NLP sungguhan tanpa mengubah tampilan.
