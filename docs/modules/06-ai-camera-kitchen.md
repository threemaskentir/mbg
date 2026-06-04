# Modul 6 — AI Kamera: Analisis Dapur

Pemantauan dapur berbasis "computer vision" (simulasi): mendeteksi jumlah
karyawan, kebersihan, kerapihan, kepatuhan APD, dan temuan pelanggaran dari feed
kamera.

- **Peran:** Vendor (dapur sendiri), Regulator (pilih vendor mana pun)
- **Halaman:** `/vendor/kitchen`
- **Output:** Skor kepatuhan dapur, deteksi karyawan + APD, daftar temuan

---

## Menjalankan analisis

**Langkah:**
1. Buka halaman:
   - Peran **Vendor** → sidebar **Analisis Dapur (AI)** (terkunci ke dapur yang
     diperankan via "Bertindak sebagai").
   - Peran **Regulator** → sidebar **Analisis Dapur (AI)**, lalu **pilih vendor**
     pada dropdown kanan atas.
2. (Opsional) klik **Unggah Foto Dapur** untuk memakai gambar Anda sebagai latar
   feed; jika tidak, dipakai feed kamera simulasi.
3. Klik **Jalankan Analisis AI**.
4. Tunggu animasi **scanline** memindai frame (±1,6 dtk).
5. Hasil muncul: overlay kotak deteksi di feed + panel hasil di kanan.

---

## Membaca hasil

### Pada feed kamera
- Setiap karyawan **dikotaki** dengan label *Karyawan + confidence%*.
- Di bawah kotak ada tag APD: **Masker / Sarung / Hairnet** (✓ hijau bila patuh,
  ✕ merah bila tidak). Warna kotak: hijau (APD lengkap), amber/merah (ada yang
  kurang).

### Panel hasil
- **Skor Kepatuhan Dapur** (ring + status **Baik / Perlu Perhatian / Buruk**).
- **Karyawan Terdeteksi** (jumlah orang).
- Bar **Kebersihan** & **Kerapihan Area**.
- **Kepatuhan APD**: bar Masker / Sarung Tangan / Penutup Kepala.
- **Temuan**: daftar pelanggaran (mis. "2 karyawan tidak memakai masker") atau
  "Tidak ada pelanggaran terdeteksi".

> Hasil tersimpan per vendor (ikut di-reset oleh **Reset Data Demo**) dan
> ringkasannya tampil di **Profil Digital Vendor** ([Modul 1](01-vendor-registration-verification.md)).

---

## Skor & status
`Skor ≥ 85 → Baik` · `70–84 → Perlu Perhatian` · `< 70 → Buruk`.
Skor = gabungan kebersihan (35%), kerapihan (25%), dan rata-rata APD (40%).

## Catatan simulasi
- **Tidak ada model CV / kamera nyata.** Deteksi & skor dihasilkan acak namun
  masuk akal (jumlah orang 2–6, APD, kebersihan, dll) — diberi label
  **AI Simulasi**.
- Untuk produksi dapat diganti model deteksi (mis. person + APD detection) dan
  CCTV; struktur data `KitchenAnalysis` sudah siap menampung hasil model asli.
