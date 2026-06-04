"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PackageCheck, Send } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { useStore, useHydrated } from "@/lib/store";
import type { Distribution } from "@/lib/types";

const DESTINATIONS: {
  name: string;
  type: Distribution["destinationType"];
  address: string;
  lat: number;
  lng: number;
}[] = [
  { name: "SDN Lengkong Wetan 01", type: "Sekolah", address: "Jl. Lengkong Wetan, BSD", lat: -6.2960, lng: 106.6760 },
  { name: "Posyandu Melati Rawa Buntu", type: "Posyandu", address: "Jl. Rawa Buntu Raya", lat: -6.3150, lng: 106.6700 },
  { name: "PAUD Tunas Bangsa Pamulang", type: "PAUD", address: "Jl. Pamulang Permai", lat: -6.3420, lng: 106.7390 },
  { name: "SDN Serpong 03", type: "Sekolah", address: "Jl. Raya Serpong", lat: -6.3170, lng: 106.6650 },
  { name: "Ponpes Al-Hidayah Ciputat", type: "Pesantren", address: "Jl. Dewi Sartika, Ciputat", lat: -6.3220, lng: 106.7560 },
  { name: "SDN Pondok Aren 05", type: "Sekolah", address: "Jl. Pondok Aren Raya", lat: -6.2740, lng: 106.7240 },
];
const MENUS = [
  "Nasi + Ayam + Sayur + Buah",
  "Nasi + Telur Balado + Tumis Buncis + Pisang",
  "Nasi + Ikan + Capcay + Jeruk",
  "Nasi + Tempe Orek + Sup Ayam + Semangka",
];

export default function NewDistributionPage() {
  const hydrated = useHydrated();
  const router = useRouter();
  const role = useStore((s) => s.role);
  const actingVendorId = useStore((s) => s.actingVendorId);
  const vendors = useStore((s) => s.vendors);
  const addDistribution = useStore((s) => s.addDistribution);

  const verified = vendors.filter((v) => v.status === "verified");
  const [vendorId, setVendorId] = useState("");
  const [destIdx, setDestIdx] = useState(0);
  const [portions, setPortions] = useState(150);
  const [menu, setMenu] = useState(MENUS[0]);
  const [courier, setCourier] = useState("");
  const [when, setWhen] = useState("");

  if (!hydrated)
    return <div className="py-20 text-center text-slate-400">Memuat…</div>;

  const isVendor = role === "vendor";
  const actingVendor = vendors.find((v) => v.id === actingVendorId);
  // Mode vendor: terkunci ke dapur sendiri
  const effectiveVendorId = isVendor ? actingVendorId : vendorId;
  const valid = effectiveVendorId && courier && portions > 0;

  function submit() {
    const d = DESTINATIONS[destIdx];
    const id = addDistribution({
      vendorId: effectiveVendorId,
      destination: d.name,
      destinationType: d.type,
      address: d.address,
      lat: d.lat,
      lng: d.lng,
      portions,
      menu,
      courier,
      scheduledAt: when ? new Date(when).toISOString() : new Date().toISOString(),
    });
    router.push(`/distribution/track/${id}`);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Input Pengiriman Makanan"
        desc="Buat jadwal distribusi dari vendor ke titik penerima."
      />

      {verified.length === 0 ? (
        <div className="card p-6 text-center text-slate-500">
          Belum ada vendor terverifikasi. Verifikasi vendor terlebih dahulu di{" "}
          <a href="/admin/verification" className="font-semibold text-brand-600">
            menu Verifikasi
          </a>
          .
        </div>
      ) : (
        <div className="card space-y-4 p-6">
          <div>
            <label className="label">Vendor</label>
            {isVendor ? (
              <div className="flex items-center gap-3 rounded-xl border border-line bg-slate-50 px-3.5 py-2.5">
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-bold text-white"
                  style={{ background: actingVendor?.color ?? "#1d5c39" }}
                >
                  {(actingVendor?.name ?? "VN").slice(0, 2).toUpperCase()}
                </span>
                <span className="text-sm font-medium text-ink">
                  {actingVendor?.name ?? "—"}
                </span>
                <span className="ml-auto text-xs text-slate-400">dapur Anda</span>
              </div>
            ) : (
              <select
                className="input"
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
              >
                <option value="">— Pilih vendor terverifikasi —</option>
                {verified.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.city})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="label">Titik Tujuan</label>
            <select
              className="input"
              value={destIdx}
              onChange={(e) => setDestIdx(Number(e.target.value))}
            >
              {DESTINATIONS.map((d, i) => (
                <option key={d.name} value={i}>
                  {d.name} — {d.type}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Jumlah Porsi</label>
              <input
                className="input"
                type="number"
                value={portions}
                onChange={(e) => setPortions(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label">Petugas / Kurir</label>
              <input
                className="input"
                placeholder="cth. Joko"
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label">Menu</label>
            <select
              className="input"
              value={menu}
              onChange={(e) => setMenu(e.target.value)}
            >
              {MENUS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Jadwal Pengiriman</label>
            <input
              className="input"
              type="datetime-local"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
            />
            <p className="mt-1 text-xs text-slate-400">
              Kosongkan untuk menggunakan waktu sekarang.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-brand-50 p-3 text-sm text-brand-700">
            <PackageCheck size={18} />
            Setelah dibuat, lanjutkan ke halaman tracking untuk GPS &
            check-in/out.
          </div>

          <button onClick={submit} disabled={!valid} className="btn-primary w-full">
            <Send size={16} /> Buat Distribusi
          </button>
        </div>
      )}
    </div>
  );
}
