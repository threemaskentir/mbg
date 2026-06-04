"use client";

import { useRef, useState } from "react";
import {
  Camera,
  ScanLine,
  Users,
  Sparkles,
  Boxes,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  ImagePlus,
} from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { SimTag } from "@/components/badges";
import { useStore, useHydrated } from "@/lib/store";
import { analyzeKitchen } from "@/lib/sim/camera";
import { cn, formatDate } from "@/lib/utils";
import type { KitchenAnalysis } from "@/lib/types";

const STATUS_META: Record<
  KitchenAnalysis["status"],
  { label: string; cls: string; ring: string }
> = {
  baik: { label: "Baik", cls: "text-brand-700 bg-brand-100", ring: "#1d5c39" },
  perhatian: { label: "Perlu Perhatian", cls: "text-amber-700 bg-amber-100", ring: "#d97706" },
  buruk: { label: "Buruk", cls: "text-rose-700 bg-rose-100", ring: "#e11d48" },
};

export default function KitchenAIPage() {
  const hydrated = useHydrated();
  const role = useStore((s) => s.role);
  const actingVendorId = useStore((s) => s.actingVendorId);
  const vendors = useStore((s) => s.vendors);
  const kitchenScans = useStore((s) => s.kitchenScans);
  const setKitchenScan = useStore((s) => s.setKitchenScan);

  const [selVendor, setSelVendor] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!hydrated)
    return <div className="py-20 text-center text-slate-400">Memuat…</div>;

  const isVendor = role === "vendor";
  const vendorId = isVendor ? actingVendorId : selVendor || vendors[0]?.id || "";
  const vendor = vendors.find((v) => v.id === vendorId);
  const result = kitchenScans[vendorId];

  async function runScan() {
    if (!vendorId) return;
    setAnalyzing(true);
    const res = await analyzeKitchen();
    setKitchenScan(vendorId, res);
    setAnalyzing(false);
  }

  return (
    <div>
      <PageHeader
        title={
          <span className="flex items-center gap-2">
            Analisis Kamera Dapur <SimTag label="AI Simulasi" />
          </span>
        }
        desc="Deteksi jumlah karyawan, kebersihan, kerapihan, & kepatuhan APD dari kamera dapur."
        action={
          !isVendor ? (
            <select
              className="input w-56"
              value={vendorId}
              onChange={(e) => setSelVendor(e.target.value)}
            >
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          ) : undefined
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Camera feed */}
        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-semibold text-ink">
              <Camera size={18} className="text-sky-500" /> Feed Kamera —{" "}
              {vendor?.name ?? "—"}
            </h3>
            <span className="text-xs text-slate-400">CCTV-01 • Area Produksi</span>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="Dapur" className="h-full w-full object-cover opacity-90" />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e293b,#0f172a)]">
                <div className="absolute inset-0 opacity-20 [background:repeating-linear-gradient(0deg,transparent,transparent_22px,#64748b22_23px),repeating-linear-gradient(90deg,transparent,transparent_22px,#64748b22_23px)]" />
                <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-xs text-slate-500">
                  <Camera size={26} className="mx-auto mb-1 opacity-60" />
                  Simulasi feed kamera dapur
                </p>
              </div>
            )}

            {/* corner brackets */}
            {["left-2 top-2 border-l-2 border-t-2", "right-2 top-2 border-r-2 border-t-2", "left-2 bottom-2 border-l-2 border-b-2", "right-2 bottom-2 border-r-2 border-b-2"].map((c) => (
              <span key={c} className={cn("absolute h-5 w-5 border-sky-400/70", c)} />
            ))}

            {/* scanning line */}
            {analyzing && (
              <span className="absolute left-0 h-0.5 w-full animate-scan bg-sky-400 shadow-[0_0_12px_#38bdf8]" />
            )}

            {/* detections */}
            {!analyzing &&
              result?.detections.map((d) => {
                const ok = d.mask && d.gloves && d.hairnet;
                const color = ok ? "#22c55e" : d.mask ? "#f59e0b" : "#f43f5e";
                return (
                  <div
                    key={d.id}
                    className="absolute rounded-md border-2"
                    style={{
                      left: `${d.x * 100}%`,
                      top: `${d.y * 100}%`,
                      width: `${d.w * 100}%`,
                      height: `${d.h * 100}%`,
                      borderColor: color,
                      boxShadow: `0 0 0 1px #0006`,
                    }}
                  >
                    <span
                      className="absolute -top-5 left-0 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-semibold text-white"
                      style={{ background: color }}
                    >
                      Karyawan {Math.round(d.conf * 100)}%
                    </span>
                    <span className="absolute -bottom-5 left-0 flex gap-1 text-[9px]">
                      <Tag ok={d.mask}>Masker</Tag>
                      <Tag ok={d.gloves}>Sarung</Tag>
                      <Tag ok={d.hairnet}>Hairnet</Tag>
                    </span>
                  </div>
                );
              })}

            {analyzing && (
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-sky-300">
                Menganalisis frame…
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={runScan} disabled={analyzing} className="btn-primary">
              {analyzing ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Menganalisis…
                </>
              ) : (
                <>
                  <ScanLine size={16} /> Jalankan Analisis AI
                </>
              )}
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="btn-outline"
            >
              <ImagePlus size={16} /> Unggah Foto Dapur
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setPhoto(URL.createObjectURL(f));
              }}
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {!result ? (
            <div className="card flex flex-col items-center py-14 text-center text-slate-400">
              <ScanLine size={30} />
              <p className="mt-2 text-sm">
                Belum ada hasil analisis.
                <br />
                Klik <strong>Jalankan Analisis AI</strong>.
              </p>
            </div>
          ) : (
            <>
              {/* Overall score */}
              <div className="card flex items-center gap-4 p-5">
                <ScoreRing
                  value={result.overallScore}
                  color={STATUS_META[result.status].ring}
                />
                <div>
                  <p className="text-xs text-slate-400">Skor Kepatuhan Dapur</p>
                  <p className="text-2xl font-bold text-ink">
                    {result.overallScore}/100
                  </p>
                  <span
                    className={cn(
                      "mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      STATUS_META[result.status].cls
                    )}
                  >
                    {STATUS_META[result.status].label}
                  </span>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Dianalisis {formatDate(result.at, true)}
                  </p>
                </div>
              </div>

              {/* Metrics */}
              <div className="card space-y-3 p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-50 text-sky-600">
                    <Users size={20} />
                  </span>
                  <div>
                    <p className="text-xs text-slate-400">Karyawan Terdeteksi</p>
                    <p className="text-lg font-bold text-ink">
                      {result.staffCount} orang
                    </p>
                  </div>
                </div>
                <Bar icon={Sparkles} label="Kebersihan" value={result.cleanliness} />
                <Bar icon={Boxes} label="Kerapihan Area" value={result.tidiness} />
              </div>

              {/* APD compliance */}
              <div className="card space-y-3 p-5">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <ShieldCheck size={16} className="text-brand-600" /> Kepatuhan APD
                </h4>
                <Bar label="Masker" value={result.apd.mask} />
                <Bar label="Sarung Tangan" value={result.apd.gloves} />
                <Bar label="Penutup Kepala" value={result.apd.hairnet} />
              </div>

              {/* Violations */}
              <div className="card p-5">
                <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
                  <AlertTriangle size={16} className="text-amber-500" /> Temuan
                </h4>
                {result.violations.length === 0 ? (
                  <p className="flex items-center gap-2 text-sm text-brand-700">
                    <CheckCircle2 size={16} /> Tidak ada pelanggaran terdeteksi.
                  </p>
                ) : (
                  <ul className="space-y-1.5">
                    {result.violations.map((v, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 rounded-lg bg-rose-50/60 px-3 py-2 text-sm text-rose-700"
                      >
                        <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                        {v}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Tag({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "rounded px-1 py-0.5 font-semibold text-white",
        ok ? "bg-emerald-600" : "bg-rose-600"
      )}
    >
      {ok ? "✓" : "✕"} {children}
    </span>
  );
}

function Bar({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon?: typeof Users;
}) {
  const color =
    value >= 85 ? "bg-brand-500" : value >= 70 ? "bg-amber-400" : "bg-rose-500";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-slate-600">
          {Icon && <Icon size={14} className="text-slate-400" />}
          {label}
        </span>
        <span className="font-semibold text-ink">{value}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ScoreRing({ value, color }: { value: number; color: string }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" className="shrink-0">
      <circle cx="34" cy="34" r={r} fill="none" stroke="#e2e8f0" strokeWidth="7" />
      <circle
        cx="34"
        cy="34"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={off}
        transform="rotate(-90 34 34)"
      />
      <text x="34" y="39" textAnchor="middle" className="fill-ink text-[16px] font-bold">
        {value}
      </text>
    </svg>
  );
}
