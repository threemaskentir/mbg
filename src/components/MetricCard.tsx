import { CheckCircle2, TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Metric {
  label: string;
  value: string;
  target: string;
  icon: LucideIcon;
  trend?: "up" | "down"; // arah perubahan (sudah dianggap "baik")
  progress?: number; // 0..100 → tampilkan bar
}

export function MetricCard({ label, value, target, icon: Icon, trend, progress }: Metric) {
  const TrendIcon = trend === "down" ? TrendingDown : TrendingUp;
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
          <Icon size={18} />
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-semibold text-brand-700">
          <CheckCircle2 size={12} /> Tercapai
        </span>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-2xl font-bold tracking-tight text-ink">
        {trend && <TrendIcon size={20} className="text-brand-600" />}
        {value}
      </p>
      <p className="text-xs text-slate-500">{label}</p>
      {progress != null ? (
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-brand-500"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      ) : (
        <div className="mt-2 h-1.5" />
      )}
      <p className={cn("mt-1.5 text-[11px] text-slate-400")}>Target: {target}</p>
    </div>
  );
}
