"use client";

import { useState } from "react";
import Link from "next/link";
import { Truck, MapPin, QrCode, CheckCircle2, Navigation } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { DistStatusBadge } from "@/components/badges";
import { KpiCard } from "@/components/KpiCard";
import { MapCanvas, type MapMarker } from "@/components/MapCanvas";
import { useStore, useHydrated } from "@/lib/store";
import { formatNumber, formatDate, cn } from "@/lib/utils";
import type { DistributionStatus } from "@/lib/types";

const STATUS_FILTERS: { id: DistributionStatus | "all"; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "scheduled", label: "Dijadwalkan" },
  { id: "enroute", label: "Dalam Perjalanan" },
  { id: "arrived", label: "Tiba" },
  { id: "done", label: "Selesai" },
];

const STATUS_COLOR: Record<DistributionStatus, string> = {
  scheduled: "#94a3b8",
  enroute: "#0ea5e9",
  arrived: "#f59e0b",
  done: "#1d5c39",
};

export default function MonitorPage() {
  const hydrated = useHydrated();
  const role = useStore((s) => s.role);
  const actingVendorId = useStore((s) => s.actingVendorId);
  const allDistributions = useStore((s) => s.distributions);
  const vendors = useStore((s) => s.vendors);
  const [filter, setFilter] = useState<DistributionStatus | "all">("all");

  if (!hydrated)
    return <div className="py-20 text-center text-slate-400">Memuat…</div>;

  const isVendor = role === "vendor";
  // Mode vendor: hanya distribusi milik vendor yang sedang diperankan
  const distributions = isVendor
    ? allDistributions.filter((d) => d.vendorId === actingVendorId)
    : allDistributions;

  const vendorName = (id: string) =>
    vendors.find((v) => v.id === id)?.name ?? "—";

  const active = distributions.filter(
    (d) => d.status === "enroute" || d.status === "arrived"
  );
  const todayPortions = distributions
    .filter((d) => d.status !== "scheduled")
    .reduce((s, d) => s + d.portions, 0);
  const doneCount = distributions.filter((d) => d.status === "done").length;

  const filtered =
    filter === "all"
      ? distributions
      : distributions.filter((d) => d.status === filter);

  const markers: MapMarker[] = distributions.map((d) => ({
    id: d.id,
    lat: d.lat,
    lng: d.lng,
    color: STATUS_COLOR[d.status],
    label: d.destination,
    pulse: d.status === "enroute" || d.status === "arrived",
    kind: "dest",
  }));

  return (
    <div>
      <PageHeader
        title={isVendor ? "Distribusi Saya" : "Monitoring Distribusi"}
        desc={
          isVendor
            ? "Pantau & lacak pengiriman dari dapur Anda."
            : "Pantau seluruh pengiriman makanan secara real-time."
        }
        action={
          <Link href="/distribution/new" className="btn-primary">
            + Pengiriman Baru
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Distribusi" value={distributions.length} icon={Truck} />
        <KpiCard label="Sedang Aktif" value={active.length} icon={Navigation} tone="sky" />
        <KpiCard label="Selesai" value={doneCount} icon={CheckCircle2} tone="brand" />
        <KpiCard
          label="Porsi Terdistribusi"
          value={formatNumber(todayPortions)}
          icon={MapPin}
          tone="amber"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Map */}
        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-ink">Peta Distribusi</h3>
            <div className="flex flex-wrap gap-2 text-[11px]">
              {Object.entries(STATUS_COLOR).map(([k, c]) => (
                <span key={k} className="inline-flex items-center gap-1 text-slate-500">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
                  {STATUS_FILTERS.find((s) => s.id === k)?.label}
                </span>
              ))}
            </div>
          </div>
          <MapCanvas markers={markers} height="h-[360px]" />
        </div>

        {/* List */}
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition",
                  filter === f.id
                    ? "bg-brand-600 text-white"
                    : "bg-white text-slate-500 ring-1 ring-line hover:bg-slate-50"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filtered.map((d) => (
              <div key={d.id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink">
                      {d.destination}
                    </p>
                    <p className="text-xs text-slate-400">
                      {vendorName(d.vendorId)} • {formatNumber(d.portions)} porsi
                    </p>
                  </div>
                  <DistStatusBadge status={d.status} />
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Kurir {d.courier} • {formatDate(d.scheduledAt, true)}
                </p>
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/distribution/track/${d.id}`}
                    className="btn-outline flex-1 py-2 text-xs"
                  >
                    <Navigation size={14} /> Tracking
                  </Link>
                  <Link
                    href={`/feedback/${d.id}`}
                    className="btn-outline flex-1 py-2 text-xs"
                  >
                    <QrCode size={14} /> Feedback
                  </Link>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="card py-10 text-center text-sm text-slate-400">
                Tidak ada distribusi pada filter ini.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
