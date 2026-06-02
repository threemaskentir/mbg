"use client";

import { useState } from "react";
import { Brain, ThumbsUp, Minus, ThumbsDown, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { KpiCard } from "@/components/KpiCard";
import { SentimentBadge, SimTag } from "@/components/badges";
import { StarRating } from "@/components/StarRating";
import { SentimentDonut } from "@/components/charts";
import { useStore, useHydrated } from "@/lib/store";
import { analyzeSentiment } from "@/lib/sim/sentiment";
import { timeAgo, cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const hydrated = useHydrated();
  const feedback = useStore((s) => s.feedback);
  const vendors = useStore((s) => s.vendors);
  const [vendorId, setVendorId] = useState("all");

  if (!hydrated)
    return <div className="py-20 text-center text-slate-400">Memuat…</div>;

  const list =
    vendorId === "all"
      ? feedback
      : feedback.filter((f) => f.vendorId === vendorId);

  const counts = {
    positive: list.filter((f) => f.sentiment === "positive").length,
    neutral: list.filter((f) => f.sentiment === "neutral").length,
    negative: list.filter((f) => f.sentiment === "negative").length,
  };
  const donut = [
    { name: "Positif", value: counts.positive },
    { name: "Netral", value: counts.neutral },
    { name: "Negatif", value: counts.negative },
  ];

  // top keywords across filtered comments (simulasi)
  const kw: Record<string, { pos: number; neg: number }> = {};
  list.forEach((f) => {
    const r = analyzeSentiment(f.comment);
    r.hits.positive.forEach((w) => {
      kw[w] = kw[w] || { pos: 0, neg: 0 };
      kw[w].pos++;
    });
    r.hits.negative.forEach((w) => {
      kw[w] = kw[w] || { pos: 0, neg: 0 };
      kw[w].neg++;
    });
  });
  const keywords = Object.entries(kw)
    .sort((a, b) => b[1].pos + b[1].neg - (a[1].pos + a[1].neg))
    .slice(0, 12);

  const vendorName = (id: string) =>
    vendors.find((v) => v.id === id)?.name ?? "—";

  return (
    <div>
      <PageHeader
        title={
          <span className="flex items-center gap-2">
            Analitik Sentimen <SimTag label="AI Simulasi" />
          </span>
        }
        desc="Klasifikasi otomatis komentar penerima manfaat."
        action={
          <select
            className="input w-56"
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
          >
            <option value="all">Semua Vendor</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Komentar" value={list.length} icon={MessageSquare} />
        <KpiCard label="Positif" value={counts.positive} icon={ThumbsUp} tone="brand" />
        <KpiCard label="Netral" value={counts.neutral} icon={Minus} tone="sky" />
        <KpiCard label="Negatif" value={counts.negative} icon={ThumbsDown} tone="rose" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        {/* Donut + keywords */}
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="mb-2 flex items-center gap-2 font-semibold text-ink">
              <Brain size={18} className="text-violet-500" /> Distribusi Sentimen
            </h3>
            {list.length > 0 ? (
              <>
                <SentimentDonut data={donut} />
                <div className="mt-2 flex justify-center gap-4 text-xs">
                  <Legend color="#059669" label={`Positif ${counts.positive}`} />
                  <Legend color="#94a3b8" label={`Netral ${counts.neutral}`} />
                  <Legend color="#f43f5e" label={`Negatif ${counts.negative}`} />
                </div>
              </>
            ) : (
              <p className="py-10 text-center text-sm text-slate-400">
                Belum ada komentar.
              </p>
            )}
          </div>

          <div className="card p-5">
            <h3 className="mb-3 font-semibold text-ink">Kata Kunci Terdeteksi</h3>
            <div className="flex flex-wrap gap-2">
              {keywords.length === 0 && (
                <p className="text-sm text-slate-400">—</p>
              )}
              {keywords.map(([w, c]) => (
                <span
                  key={w}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    c.neg > c.pos
                      ? "bg-rose-50 text-rose-700"
                      : "bg-brand-50 text-brand-700"
                  )}
                >
                  {w} · {c.pos + c.neg}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Comment feed */}
        <div className="card p-5">
          <h3 className="mb-3 font-semibold text-ink">
            Komentar Penerima ({list.length})
          </h3>
          <div className="max-h-[560px] space-y-3 overflow-y-auto pr-1">
            {list.map((f) => (
              <div
                key={f.id}
                className={cn(
                  "rounded-xl border p-3.5",
                  f.isComplaint
                    ? "border-rose-200 bg-rose-50/40"
                    : "border-line bg-white"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <StarRating value={f.rating} size={14} />
                  <SentimentBadge sentiment={f.sentiment} />
                </div>
                <p className="mt-2 text-sm text-slate-700">“{f.comment}”</p>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                  <span>{vendorName(f.vendorId)}</span>
                  <span>{timeAgo(f.createdAt)}</span>
                </div>
                {f.isComplaint && (
                  <span className="mt-2 inline-block rounded-md bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
                    ⚠ Keluhan
                  </span>
                )}
              </div>
            ))}
            {list.length === 0 && (
              <p className="py-10 text-center text-sm text-slate-400">
                Tidak ada komentar untuk filter ini.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-slate-500">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
