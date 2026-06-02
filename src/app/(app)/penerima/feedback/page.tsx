"use client";

import Link from "next/link";
import { MessageSquareHeart, MapPin, ChevronRight, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { DistStatusBadge } from "@/components/badges";
import { StarRating } from "@/components/StarRating";
import { useStore, useHydrated } from "@/lib/store";
import { formatNumber } from "@/lib/utils";

export default function PenerimaFeedbackPage() {
  const hydrated = useHydrated();
  const distributions = useStore((s) => s.distributions);
  const vendors = useStore((s) => s.vendors);
  const feedback = useStore((s) => s.feedback);

  if (!hydrated)
    return <div className="py-20 text-center text-slate-400">Memuat…</div>;

  const vendorName = (id: string) =>
    vendors.find((v) => v.id === id)?.name ?? "—";

  // kiriman yang sudah tiba/selesai layak diberi feedback
  const list = distributions.filter(
    (d) => d.status === "arrived" || d.status === "done"
  );

  const fbFor = (distId: string) =>
    feedback.filter((f) => f.distributionId === distId);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Feedback Penerima"
        desc="Pilih distribusi yang Anda terima lalu beri rating & komentar."
      />

      <div className="space-y-3">
        {list.length === 0 && (
          <div className="card py-12 text-center text-sm text-slate-400">
            Belum ada kiriman yang dapat dinilai.
          </div>
        )}
        {list.map((d) => {
          const fbs = fbFor(d.id);
          const avg =
            fbs.length > 0
              ? fbs.reduce((s, f) => s + f.rating, 0) / fbs.length
              : 0;
          return (
            <Link
              key={d.id}
              href={`/feedback/${d.id}`}
              className="card flex items-center gap-3 p-4 transition hover:bg-slate-50"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600">
                <MessageSquareHeart size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{d.destination}</p>
                <p className="flex items-center gap-1 text-xs text-slate-400">
                  <MapPin size={12} /> {vendorName(d.vendorId)} •{" "}
                  {formatNumber(d.portions)} porsi
                </p>
                {fbs.length > 0 && (
                  <span className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-500">
                    <StarRating value={avg} size={12} /> {avg.toFixed(1)} (
                    {fbs.length})
                  </span>
                )}
              </div>
              {d.receivedConfirmedAt && (
                <CheckCircle2 size={16} className="text-brand-500" />
              )}
              <DistStatusBadge status={d.status} />
              <ChevronRight size={16} className="text-slate-300" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
