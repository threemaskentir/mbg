"use client";

import Link from "next/link";
import { Store, CheckCircle2, Clock, Utensils, Star } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { KpiCard } from "@/components/KpiCard";
import { VendorStatusBadge } from "@/components/badges";
import { useStore, useHydrated } from "@/lib/store";
import { formatNumber } from "@/lib/utils";

export default function VendorDashboardPage() {
  const hydrated = useHydrated();
  const vendors = useStore((s) => s.vendors);
  const distributions = useStore((s) => s.distributions);

  if (!hydrated)
    return <div className="py-20 text-center text-slate-400">Memuat…</div>;

  const verified = vendors.filter((v) => v.status === "verified").length;
  const pending = vendors.filter((v) => v.status === "review").length;
  const totalCapacity = vendors.reduce((s, v) => s + v.capacity, 0);

  const distCount = (id: string) =>
    distributions.filter((d) => d.vendorId === id).length;

  return (
    <div>
      <PageHeader
        title="Vendor Dashboard"
        desc="Ringkasan vendor terdaftar beserta status verifikasinya."
        action={
          <Link href="/vendor/register" className="btn-primary">
            + Vendor Baru
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Vendor" value={vendors.length} icon={Store} />
        <KpiCard
          label="Terverifikasi"
          value={verified}
          icon={CheckCircle2}
          tone="brand"
        />
        <KpiCard
          label="Menunggu Review"
          value={pending}
          icon={Clock}
          tone="amber"
        />
        <KpiCard
          label="Total Kapasitas"
          value={formatNumber(totalCapacity)}
          sub="porsi / hari"
          icon={Utensils}
          tone="sky"
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vendors.map((v) => (
          <Link
            key={v.id}
            href={`/vendor/profile/${v.id}`}
            className="card group p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <span
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-sm font-bold text-white"
                style={{ background: v.color }}
              >
                {v.name.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{v.name}</p>
                <p className="text-xs text-slate-400">{v.city}</p>
              </div>
              <VendorStatusBadge status={v.status} />
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-slate-500">
                {formatNumber(v.capacity)} porsi/hari
              </span>
              {v.rating > 0 ? (
                <span className="inline-flex items-center gap-1 font-medium text-ink">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  {v.rating.toFixed(1)}
                </span>
              ) : (
                <span className="text-xs text-slate-300">Belum ada rating</span>
              )}
            </div>
            <div className="mt-1 text-xs text-slate-400">
              {distCount(v.id)} distribusi tercatat
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
