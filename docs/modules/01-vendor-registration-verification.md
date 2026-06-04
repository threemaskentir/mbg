# Modul 1 — Registrasi & Verifikasi Vendor

Mendaftarkan vendor (dapur) dan memverifikasinya sebelum aktif melayani.

- **Peran:** Vendor (mendaftar), Regulator (verifikasi)
- **Halaman:** `/vendor/register`, `/admin/verification`, `/vendor/dashboard`, `/vendor/profile/[id]`
- **Output:** Vendor Dashboard, Profil Digital Vendor, status verifikasi

---

## A. Registrasi Vendor (peran: Vendor)

Form **4 langkah** dengan OCR dokumen (simulasi).

**Langkah:**
1. Switcher peran → **Vendor**.
2. Sidebar → **Registrasi Vendor** (`/vendor/register`).
3. **Langkah 1 — Data Usaha:** isi *Nama Usaha/Dapur*, *Email*, *Kapasitas
   Produksi* (porsi/hari). Klik **Lanjut**.
4. **Langkah 2 — PIC & Lokasi:** isi *Nama Penanggung Jawab*, *No. Telepon*,
   *Alamat*, pilih *Kota/Wilayah* (kecamatan Tangsel). Klik **Lanjut**.
5. **Langkah 3 — Dokumen + OCR:**
   - Unggah dokumen: NIB, NPWP, Sertifikat Halal, Izin PIRT, Foto Dapur
     (klik **Pilih file** pada tiap baris; minimal satu agar bisa lanjut).
   - Klik **Jalankan OCR** → tunggu ±1,4 dtk → kolom **NIB** & **NPWP**
     terisi otomatis (hasil simulasi) beserta akurasi. Klik **Lanjut**.
6. **Langkah 4 — Review:** periksa ringkasan data. Klik **Kirim Registrasi**.
7. Muncul layar sukses → vendor berstatus **Menunggu Review**. Klik **Lihat
   Profil Digital** atau **Ke Dashboard**.

**Hasil:** vendor baru masuk antrean verifikasi regulator.

---

## B. Approval / Rejection (peran: Regulator)

**Langkah:**
1. Switcher peran → **Regulator**.
2. Sidebar → **Verifikasi Vendor** (`/admin/verification`).
3. Filter **Antrean Review** (default) menampilkan vendor berstatus *Menunggu
   Review*. Klik salah satu vendor di daftar kiri.
4. Panel kanan menampilkan: hasil **OCR** (NIB/NPWP) & **kelengkapan dokumen**.
5. Tulis **catatan** (opsional bila menyetujui, disarankan bila menolak).
6. Klik **Setujui** → status menjadi **Terverifikasi**; atau **Tolak** →
   **Ditolak** (catatan tersimpan & tampil di profil vendor).
   - Untuk meninjau ulang vendor yang sudah diproses, ganti filter ke **Semua**;
     bisa **Kembalikan ke review**.

**Hasil:** hanya vendor **Terverifikasi** yang bisa dipakai membuat distribusi
(lihat [Modul 2](02-distribution-monitoring.md)).

---

## C. Vendor Dashboard (peran: Regulator)

**Langkah:** peran Regulator → sidebar **Dashboard Vendor** (`/vendor/dashboard`).

Menampilkan KPI (total vendor, terverifikasi, menunggu review, total kapasitas)
dan kartu setiap vendor (status, rating, jumlah distribusi). Klik kartu → membuka
**Profil Digital Vendor**.

## D. Profil Digital Vendor

Halaman `/vendor/profile/[id]` menampilkan: identitas & status terverifikasi,
kontak, kapasitas, rating rata-rata, kelengkapan dokumen + hasil OCR, ringkasan
**Analisis Dapur (AI)** (lihat [Modul 6](06-ai-camera-kitchen.md)), dan riwayat
distribusi.

---

## Status verifikasi

`Menunggu Review → Terverifikasi` **atau** `→ Ditolak`. Badge warna:
abu (review), hijau (terverifikasi), merah (ditolak).

## Catatan simulasi
- **OCR** tidak membaca isi file sungguhan — menghasilkan NIB/NPWP dummy.
- Unggahan file hanya disimpan sebagai nama berkas (tidak diupload ke server).
