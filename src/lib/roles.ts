import type { Role } from "@/lib/types";

/** Urutan tampil peran di switcher. */
export const ROLE_ORDER: Role[] = ["regulator", "vendor", "kurir", "penerima"];

export const ROLE_LABEL: Record<Role, string> = {
  regulator: "Regulator",
  vendor: "Vendor",
  kurir: "Kurir",
  penerima: "Penerima",
};

/** Halaman utama (landing) untuk tiap peran — dituju saat berganti peran. */
export const ROLE_HOME: Record<Role, string> = {
  regulator: "/admin/command-center",
  vendor: "/distribution/monitor",
  kurir: "/distribution/courier",
  penerima: "/penerima/konfirmasi",
};

/** Deskripsi singkat peran (ditampilkan di shell). */
export const ROLE_DESC: Record<Role, string> = {
  regulator: "Awasi seluruh program lewat command center.",
  vendor: "Kelola registrasi, pengiriman, & tracking dapur Anda.",
  kurir: "Check-in & check-out pengiriman di lokasi.",
  penerima: "Konfirmasi kiriman sampai & beri penilaian.",
};
