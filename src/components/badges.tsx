import { cn } from "@/lib/utils";
import type { VendorStatus, DistributionStatus, Sentiment } from "@/lib/types";

const VENDOR_MAP: Record<VendorStatus, { label: string; cls: string }> = {
  draft: { label: "Draft", cls: "bg-slate-100 text-slate-600" },
  review: { label: "Menunggu Review", cls: "bg-amber-100 text-amber-700" },
  verified: { label: "Terverifikasi", cls: "bg-brand-100 text-brand-700" },
  rejected: { label: "Ditolak", cls: "bg-rose-100 text-rose-700" },
};

const DIST_MAP: Record<DistributionStatus, { label: string; cls: string }> = {
  scheduled: { label: "Dijadwalkan", cls: "bg-slate-100 text-slate-600" },
  enroute: { label: "Dalam Perjalanan", cls: "bg-sky-100 text-sky-700" },
  arrived: { label: "Tiba di Lokasi", cls: "bg-amber-100 text-amber-700" },
  done: { label: "Selesai", cls: "bg-brand-100 text-brand-700" },
};

const SENT_MAP: Record<Sentiment, { label: string; cls: string }> = {
  positive: { label: "Positif", cls: "bg-brand-100 text-brand-700" },
  neutral: { label: "Netral", cls: "bg-slate-100 text-slate-600" },
  negative: { label: "Negatif", cls: "bg-rose-100 text-rose-700" },
};

function Pill({ label, cls }: { label: string; cls: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        cls
      )}
    >
      {label}
    </span>
  );
}

export function VendorStatusBadge({ status }: { status: VendorStatus }) {
  return <Pill {...VENDOR_MAP[status]} />;
}
export function DistStatusBadge({ status }: { status: DistributionStatus }) {
  return <Pill {...DIST_MAP[status]} />;
}
export function SentimentBadge({ sentiment }: { sentiment: Sentiment }) {
  return <Pill {...SENT_MAP[sentiment]} />;
}

export function SimTag({ label = "Simulasi" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-700">
      ⚡ {label}
    </span>
  );
}
