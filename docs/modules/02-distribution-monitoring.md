# Modul 2 — Monitoring Distribusi

Memantau pengiriman makanan dari dapur ke titik penerima: input, GPS tracking,
check-in/out, dan foto bukti.

- **Peran:** Vendor (input & lacak miliknya), Kurir (check-in/out), Regulator (pantau semua)
- **Halaman:** `/distribution/new`, `/distribution/monitor`, `/distribution/track/[id]`, `/distribution/courier`
- **Output:** Dashboard monitoring + peta, laporan tracking per distribusi

---

## A. Input Pengiriman (peran: Vendor)

**Langkah:**
1. Switcher peran → **Vendor**, lalu pilih dapur pada **"Bertindak sebagai"**.
2. Sidebar → **Input Pengiriman** (`/distribution/new`).
3. Kolom **Vendor** sudah terkunci ke dapur Anda.
4. Pilih **Titik Tujuan** (sekolah/posyandu/PAUD/pesantren area BSD–Tangsel).
5. Isi **Jumlah Porsi** & **Petugas/Kurir**, pilih **Menu**, dan **Jadwal**
   (kosongkan = waktu sekarang).
6. Klik **Buat Distribusi** → langsung diarahkan ke halaman **Tracking**.

> Regulator juga bisa membuat distribusi (kolom Vendor berupa dropdown semua
> vendor terverifikasi).

---

## B. Tracking + GPS (peran: melihat semua; aksi kurir: Kurir)

Halaman `/distribution/track/[id]`.

**Yang ditampilkan:**
- **Peta rute jalan asli** (OSRM/OpenStreetMap) dari dapur ke tujuan.
- **Kurir (ikon 🚚)** bergerak menyusuri jalan saat status *Dalam Perjalanan*.
- Timeline event, detail distribusi, dan tombol membuka **Feedback (QR)**.

**Langkah memajukan status (peran: Kurir):**
1. Switcher peran → **Kurir** (atau pakai konsol di bagian C).
2. Buka tracking distribusi terkait.
3. Pada kartu **Aksi Kurir**:
   - Status *Dijadwalkan* → **Berangkatkan Kurir** (kurir mulai bergerak).
   - Status *Dalam Perjalanan* → **Check-in di Lokasi** (mencatat waktu tiba).
   - Status *Tiba di Lokasi* → **Check-out (Selesai)**.
4. **Foto Bukti:** unggah foto makanan / serah-terima (muncul sebagai chip).

> Untuk peran selain Kurir, kartu aksi tampil **hanya-baca** (lihat saja).

---

## C. Konsol Kurir — Check-in & Check-out (peran: Kurir)

Cara cepat kurir memproses banyak tugas tanpa membuka peta satu per satu.

**Langkah:**
1. Switcher peran → **Kurir** → otomatis ke **Check-in & Check-out**
   (`/distribution/courier`).
2. Daftar **Tugas Aktif** tampil di atas. Pada tiap kartu, tekan tombol sesuai
   status: **Berangkatkan → Check-in → Check-out**.
3. Tombol **Detail & Peta** membuka halaman tracking bila perlu melihat posisi.
4. Yang selesai pindah ke bagian **Selesai Hari Ini**.

---

## D. Dashboard Monitoring (peran: Regulator / Vendor)

Halaman `/distribution/monitor`.

**Langkah:**
1. Peran **Regulator** → **Monitoring Distribusi** (melihat semua).
   Peran **Vendor** → **Distribusi Saya** (hanya milik dapur yang diperankan).
2. Lihat KPI: total distribusi, sedang aktif, selesai, porsi terdistribusi.
3. **Peta** menampilkan semua titik (dengan **cluster** — lihat
   [Getting Started](00-getting-started.md)). Zoom in untuk detail.
4. **Filter status** (Semua/Dijadwalkan/Dalam Perjalanan/Tiba/Selesai) di atas
   daftar.
5. Tiap kartu distribusi punya tombol **Tracking** dan **Feedback**.

---

## Status distribusi
`Dijadwalkan → Dalam Perjalanan → Tiba di Lokasi → Selesai`

## Catatan simulasi
- **GPS** disimulasikan: kurir mengikuti **rute jalan asli** (dari OSRM) tetapi
  bergerak dengan kecepatan demo (±90 detik/rute), bukan posisi perangkat nyata.
- Bila layanan rute (OSRM) gagal, peta otomatis memakai garis lurus sebagai
  cadangan.
