import type { Distribution } from "@/lib/types";

/** Titik asal dapur pusat (simulasi) — BSD City, Serpong. */
export const ORIGIN = { lat: -6.3025, lng: 106.6520 };

export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * SIMULASI GPS tracking. Interpolasi posisi kurir antara ORIGIN dan tujuan
 * berdasarkan progress 0..1. Bukan GPS perangkat nyata.
 */
export function interpolate(a: LatLng, b: LatLng, t: number): LatLng {
  return {
    lat: a.lat + (b.lat - a.lat) * t,
    lng: a.lng + (b.lng - a.lng) * t,
  };
}

/** Progress perjalanan berdasarkan status distribusi. */
export function progressForStatus(d: Distribution): number {
  switch (d.status) {
    case "scheduled":
      return 0;
    case "enroute":
      return 0.55;
    case "arrived":
    case "done":
      return 1;
  }
}

export function etaMinutes(d: Distribution): number {
  // jarak kasar -> menit (simulasi)
  const dx = d.lat - ORIGIN.lat;
  const dy = d.lng - ORIGIN.lng;
  const km = Math.sqrt(dx * dx + dy * dy) * 111;
  return Math.max(3, Math.round((km / 25) * 60));
}
