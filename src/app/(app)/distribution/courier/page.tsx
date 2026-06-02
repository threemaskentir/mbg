"use client";

import Link from "next/link";
import { Truck, LogIn, LogOut, CheckCircle2, MapPin, Navigation } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { DistStatusBadge } from "@/components/badges";
import { KpiCard } from "@/components/KpiCard";
import { useStore, useHydrated } from "@/lib/store";
import { formatNumber, formatDate } from "@/lib/utils";

export default function CourierConsolePage() {
  const hydrated = useHydrated();
  const distributions = useStore((s) => s.distributions);
  const vendors = useStore((s) => s.vendors);
  const setStatus = useStore((s) => s.setDistributionStatus);
  const checkIn = useStore((s) => s.checkIn);
  const checkOut = useStore((s) => s.checkOut);

  if (!hydrated)
    return <div className="py-20 text-center text-slate-400">Memuat…</div>;

  const vendorName = (id: string) =>
    vendors.find((v) => v.id === id)?.name ?? "—";

  // tugas aktif (perlu aksi) di atas, selesai di bawah
  const order = { scheduled: 0, enroute: 1, arrived: 2, done: 3 } as const;
  const list = [...distributions].sort(
    (a, b) => order[a.status] - order[b.status]
  );
  const todo = list.filter((d) => d.status !== "done");
  const done = list.filter((d) => d.status === "done");

  return (
    <div>
      <PageHeader
        title="Check-in & Check-out"
        desc="Konsol kurir: berangkatkan, check-in saat tiba, dan check-out saat serah-terima."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Perlu Aksi" value={todo.length} icon={Truck} tone="sky" />
        <KpiCard
          label="Tiba di Lokasi"
          value={distributions.filter((d) => d.status === "arrived").length}
          icon={LogIn}
          tone="amber"
        />
        <KpiCard label="Selesai" value={done.length} icon={CheckCircle2} tone="brand" />
      </div>

      <h3 className="mt-6 mb-2 text-sm font-semibold text-slate-600">
        Tugas Aktif
      </h3>
      <div className="space-y-2">
        {todo.length === 0 && (
          <div className="card py-10 text-center text-sm text-slate-400">
            Tidak ada tugas aktif. 🎉
          </div>
        )}
        {todo.map((d) => (
          <div key={d.id} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">{d.destination}</p>
                <p className="flex items-center gap-1 text-xs text-slate-400">
                  <MapPin size={12} /> {d.address}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {vendorName(d.vendorId)} • {formatNumber(d.portions)} porsi •
                  Kurir {d.courier}
                </p>
              </div>
              <DistStatusBadge status={d.status} />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {d.status === "scheduled" && (
                <button
                  onClick={() => setStatus(d.id, "enroute")}
                  className="btn-primary py-2 text-xs"
                >
                  <Truck size={14} /> Berangkatkan
                </button>
              )}
              {d.status === "enroute" && (
                <button
                  onClick={() => checkIn(d.id)}
                  className="btn-primary py-2 text-xs"
                >
                  <LogIn size={14} /> Check-in di Lokasi
                </button>
              )}
              {d.status === "arrived" && (
                <button
                  onClick={() => checkOut(d.id)}
                  className="btn py-2 text-xs bg-brand-600 text-white hover:bg-brand-700"
                >
                  <LogOut size={14} /> Check-out (Selesai)
                </button>
              )}
              <Link
                href={`/distribution/track/${d.id}`}
                className="btn-outline py-2 text-xs"
              >
                <Navigation size={14} /> Detail & Peta
              </Link>
            </div>

            {(d.checkInAt || d.checkOutAt) && (
              <div className="mt-2 flex gap-4 text-[11px] text-slate-400">
                {d.checkInAt && <span>In: {formatDate(d.checkInAt, true)}</span>}
                {d.checkOutAt && <span>Out: {formatDate(d.checkOutAt, true)}</span>}
              </div>
            )}
          </div>
        ))}
      </div>

      {done.length > 0 && (
        <>
          <h3 className="mt-6 mb-2 text-sm font-semibold text-slate-600">
            Selesai Hari Ini
          </h3>
          <div className="space-y-2">
            {done.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between rounded-xl border border-line bg-white px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">
                    {d.destination}
                  </p>
                  <p className="text-xs text-slate-400">
                    {vendorName(d.vendorId)} • {formatNumber(d.portions)} porsi
                  </p>
                </div>
                <DistStatusBadge status={d.status} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
