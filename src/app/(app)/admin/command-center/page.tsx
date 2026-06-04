"use client";

import Link from "next/link";
import {
  Store,
  Activity,
  Truck,
  AlertTriangle,
  Star,
  Soup,
  Users,
  Salad,
  ShieldCheck,
  HeartPulse,
  Wallet,
  Smile,
  Clock,
  BadgeCheck,
  ShieldAlert,
  Trash2,
  Database,
  Target,
} from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { KpiCard } from "@/components/KpiCard";
import { MetricCard, type Metric } from "@/components/MetricCard";
import { MapCanvas, type MapMarker } from "@/components/MapCanvas";
import { TrendArea, SentimentDonut } from "@/components/charts";
import { SentimentBadge } from "@/components/badges";
import { StarRating } from "@/components/StarRating";
import { useStore, useHydrated } from "@/lib/store";
import { formatNumber, timeAgo } from "@/lib/utils";

// KPI dampak program (stakeholder) — capaian vs target nasional (data demo)
const STAKEHOLDER_KPI: Metric[] = [
  { label: "Penerima manfaat aktif", value: "99,3%", target: "≥ 99% target nasional", icon: Users, progress: 99.3 },
  { label: "Ketepatan distribusi makanan", value: "99,4%", target: "≥ 99%", icon: Truck, progress: 99.4 },
  { label: "Kepatuhan standar gizi", value: "98,6%", target: "≥ 98%", icon: Salad, progress: 98.6 },
  { label: "Food safety", value: "100%", target: "100%", icon: ShieldCheck, progress: 100 },
  { label: "Food poisoning outbreak", value: "0 kasus", target: "0 kasus", icon: HeartPulse },
  { label: "Serapan anggaran", value: "97,8%", target: "95% – 100%", icon: Wallet, progress: 97.8 },
  { label: "Kepuasan penerima manfaat", value: "92,4%", target: "≥ 90%", icon: Smile, progress: 92.4 },
];

// KPI dampak platform (penyedia solusi) — capaian vs target (data demo)
const PLATFORM_KPI: Metric[] = [
  { label: "Waktu perizinan vendor", value: "72%", target: "turun ≥ 70%", icon: Clock, trend: "down" },
  { label: "Vendor bersertifikasi wajib", value: "97,5%", target: "min. 97%", icon: BadgeCheck, progress: 97.5 },
  { label: "Insiden kualitas makanan", value: "54%", target: "turun ≥ 50%", icon: ShieldAlert, trend: "down" },
  { label: "Food waste", value: "33%", target: "turun ≥ 30%", icon: Trash2, trend: "down" },
  { label: "Partisipasi UMKM lokal", value: "43%", target: "naik ≥ 40%", icon: Store, trend: "up" },
  { label: "Kecepatan respon pengaduan", value: "18 jam", target: "< 24 jam", icon: Clock },
  { label: "Akurasi data monitoring nasional", value: "95,6%", target: "≥ 95%", icon: Database, progress: 95.6 },
  { label: "Kepuasan penerima manfaat", value: "90,8%", target: "≥ 90%", icon: Smile, progress: 90.8 },
];

export default function CommandCenterPage() {
  const hydrated = useHydrated();
  const vendors = useStore((s) => s.vendors);
  const distributions = useStore((s) => s.distributions);
  const feedback = useStore((s) => s.feedback);

  if (!hydrated)
    return <div className="py-20 text-center text-slate-400">Memuat…</div>;

  const verified = vendors.filter((v) => v.status === "verified");
  const activeVendorIds = new Set(distributions.map((d) => d.vendorId));
  const todayPortions = distributions
    .filter((d) => d.status !== "scheduled")
    .reduce((s, d) => s + d.portions, 0);
  const complaints = feedback.filter((f) => f.isComplaint);
  const avgRating =
    feedback.length > 0
      ? feedback.reduce((s, f) => s + f.rating, 0) / feedback.length
      : 0;

  // tren 7 hari (berdasarkan scheduledAt)
  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const trend = days.map((d) => {
    const key = d.toDateString();
    const value = distributions.filter(
      (x) => new Date(x.scheduledAt).toDateString() === key
    ).length;
    return {
      name: d.toLocaleDateString("id-ID", { weekday: "short" }),
      value,
    };
  });

  const donut = [
    { name: "Positif", value: feedback.filter((f) => f.sentiment === "positive").length },
    { name: "Netral", value: feedback.filter((f) => f.sentiment === "neutral").length },
    { name: "Negatif", value: feedback.filter((f) => f.sentiment === "negative").length },
  ];

  const markers: MapMarker[] = [
    ...verified.map((v) => ({
      id: `v-${v.id}`,
      lat: v.lat,
      lng: v.lng,
      color: "#1d5c39",
      label: v.name,
      kind: "vendor" as const,
    })),
    ...distributions.map((d) => ({
      id: `d-${d.id}`,
      lat: d.lat,
      lng: d.lng,
      color: "#0ea5e9",
      label: d.destination,
      pulse: d.status === "enroute" || d.status === "arrived",
      kind: "dest" as const,
    })),
  ];

  const vendorName = (id: string) =>
    vendors.find((v) => v.id === id)?.name ?? "—";

  return (
    <div>
      <PageHeader
        title="Command Center"
        desc="Pusat kendali program Makan Bergizi Gratis untuk regulator."
      />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Jumlah Vendor" value={vendors.length} icon={Store} />
        <KpiCard
          label="Vendor Aktif"
          value={activeVendorIds.size}
          icon={Activity}
          tone="brand"
        />
        <KpiCard
          label="Distribusi"
          value={distributions.length}
          sub="total tercatat"
          icon={Truck}
          tone="sky"
        />
        <KpiCard
          label="Porsi"
          value={formatNumber(todayPortions)}
          sub="terdistribusi"
          icon={Soup}
          tone="amber"
        />
        <KpiCard
          label="Keluhan"
          value={complaints.length}
          icon={AlertTriangle}
          tone="rose"
        />
        <KpiCard
          label="Rating Rata-rata"
          value={avgRating.toFixed(1)}
          icon={Star}
          tone="violet"
        />
      </div>

      {/* Map + Trend */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-ink">Peta Distribusi</h3>
            <div className="flex gap-3 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-600" /> Vendor
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-500" /> Titik
                distribusi
              </span>
            </div>
          </div>
          <MapCanvas markers={markers} cluster height="h-[340px]" />
        </div>

        <div className="card p-5">
          <h3 className="mb-1 font-semibold text-ink">Tren Distribusi (7 hari)</h3>
          <p className="mb-2 text-xs text-slate-400">Jumlah distribusi per hari</p>
          <TrendArea data={trend} />
        </div>
      </div>

      {/* Sentiment + Complaints */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="card p-5">
          <h3 className="mb-2 font-semibold text-ink">Sentimen Penerima</h3>
          <SentimentDonut data={donut} />
          <Link
            href="/admin/analytics"
            className="mt-2 block text-center text-sm font-semibold text-brand-600 hover:underline"
          >
            Lihat analitik lengkap →
          </Link>
        </div>

        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-ink">Keluhan Terbaru</h3>
            <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
              {complaints.length} keluhan
            </span>
          </div>
          {complaints.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              Tidak ada keluhan. 🎉
            </p>
          ) : (
            <div className="space-y-2">
              {complaints.slice(0, 6).map((f) => (
                <div
                  key={f.id}
                  className="rounded-xl border border-rose-200 bg-rose-50/40 p-3.5"
                >
                  <div className="flex items-center justify-between">
                    <StarRating value={f.rating} size={14} />
                    <SentimentBadge sentiment={f.sentiment} />
                  </div>
                  <p className="mt-1.5 text-sm text-slate-700">“{f.comment}”</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {vendorName(f.vendorId)} • {timeAgo(f.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* KPI dampak program (stakeholder) */}
      <div className="mt-8 flex items-center gap-2">
        <Target size={18} className="text-brand-600" />
        <h2 className="text-lg font-bold text-ink">KPI Program (Stakeholder)</h2>
        <span className="text-xs text-slate-400">capaian vs target nasional</span>
      </div>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {STAKEHOLDER_KPI.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      {/* KPI dampak platform (penyedia solusi) */}
      <div className="mt-8 flex items-center gap-2">
        <Activity size={18} className="text-brand-600" />
        <h2 className="text-lg font-bold text-ink">KPI Platform (Penyedia Solusi)</h2>
        <span className="text-xs text-slate-400">dampak digitalisasi MBG</span>
      </div>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {PLATFORM_KPI.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>
    </div>
  );
}
