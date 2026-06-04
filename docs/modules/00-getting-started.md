# 0 — Memulai & Konsep Dasar

Konsep penting yang dipakai di semua modul. Baca ini lebih dulu.

## Menjalankan aplikasi

```bash
npm install
npm run dev      # mode pengembangan → http://localhost:3000
# atau build produksi (PWA aktif):
npm run build && npm start
```

## Berpindah peran (Mode Demo — Peran)

Karena ini mockup tanpa login, perpindahan sudut pandang dilakukan lewat
**switcher peran** di sidebar kiri.

**Langkah:**
1. Buka aplikasi, masuk ke halaman mana pun yang ber-sidebar.
2. Di bagian atas sidebar, lihat panel **"Mode Demo — Peran"**.
3. Klik dropdown → pilih salah satu: **Regulator / Vendor / Kurir / Penerima**.
4. Aplikasi otomatis **berpindah ke halaman utama peran** itu, dan **menu di
   sidebar menyesuaikan** akses peran tersebut.

## "Bertindak sebagai" (khusus peran Vendor)

Saat peran = **Vendor**, muncul dropdown **"Bertindak sebagai"** di bawah
switcher. Ini menentukan **dapur mana** yang sedang Anda perankan — semua data
(Input Pengiriman, Distribusi Saya, Analisis Dapur) terkunci ke vendor itu.

**Langkah:** pilih peran Vendor → pilih vendor pada dropdown "Bertindak sebagai".

## Reset data demo

Semua perubahan (registrasi baru, distribusi, feedback, scan dapur) disimpan di
browser (localStorage). Untuk mengembalikan ke kondisi awal:

**Langkah:** sidebar bagian bawah → tombol **"Reset Data Demo"** → konfirmasi.

## Tentang peta

- Peta memakai **Leaflet + OpenStreetMap** (peta jalan asli area **BSD /
  Tangerang Selatan**).
- Di **Command Center** dan **Monitoring**, titik berdekatan **dikelompokkan
  (cluster)**: lingkaran hijau = kumpulan **dapur**, biru = kumpulan **titik
  distribusi**, dengan angka jumlahnya. **Zoom in** untuk memecah cluster
  menjadi marker individual.
- Peta menarik data dari internet, jadi area peta tidak tampil saat benar-benar
  offline (sisa aplikasi tetap jalan sebagai PWA).

## Install sebagai aplikasi (PWA)

Pada build produksi (HTTPS / `npm start`), klik **"Install Aplikasi (PWA)"** di
sidebar, atau menu browser → *Install / Add to Home Screen*.

## Label "Simulasi"

Fitur ber-label ⚡ **Simulasi / AI Simulasi** (OCR, GPS, sentimen, kamera dapur)
menghasilkan data tiruan untuk demo — bukan model/sensor nyata.
