"use client";

import Link from "next/link";
import { PackageCheck, MapPin, CheckCircle2, Clock, Star } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { DistStatusBadge } from "@/components/badges";
import { useStore, useHydrated } from "@/lib/store";
import { formatNumber, formatDate } from "@/lib/utils";

export default function KonfirmasiPage() {
  const hydrated = useHydrated();
  const distributions = useStore((s) => s.distributions);
  const vendors = useStore((s) => s.vendors);
  const confirmReceived = useStore((s) => s.confirmReceived);

  if (!hydrated)
    return <div className="py-20 text-center text-slate-400">Memuat…</div>;

  const vendorName = (id: string) =>
    vendors.find((v) => v.id === id)?.name ?? "—";

  // hanya kiriman yang sedang menuju / sudah tiba yang relevan untuk dikonfirmasi
  const list = distributions.filter(
    (d) => d.status === "enroute" || d.status === "arrived" || d.status === "done"
  );

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Konfirmasi Kiriman Sampai"
        desc="Konfirmasikan bahwa kiriman makanan telah diterima di lokasi Anda."
      />

      <div className="space-y-3">
        {list.length === 0 && (
          <div className="card py-12 text-center text-sm text-slate-400">
            Belum ada kiriman menuju lokasi Anda.
          </div>
        )}
        {list.map((d) => {
          const confirmed = !!d.receivedConfirmedAt;
          return (
            <div key={d.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">
                    {d.destination}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPin size={12} /> {d.address}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {vendorName(d.vendorId)} • {formatNumber(d.portions)} porsi
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">{d.menu}</p>
                </div>
                <DistStatusBadge status={d.status} />
              </div>

              <div className="mt-4">
                {confirmed ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700">
                      <CheckCircle2 size={16} /> Dikonfirmasi sampai
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                      <Clock size={12} /> {formatDate(d.receivedConfirmedAt!, true)}
                    </span>
                    <Link
                      href={`/feedback/${d.id}`}
                      className="btn-outline ml-auto py-2 text-xs"
                    >
                      <Star size={14} /> Beri Feedback
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={() => confirmReceived(d.id)}
                    className="btn-primary w-full"
                  >
                    <PackageCheck size={16} /> Konfirmasi Kiriman Sampai
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
