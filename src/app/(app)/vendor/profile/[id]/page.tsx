"use client";

import { use } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Utensils,
  BadgeCheck,
  FileCheck2,
  FileX2,
  ShieldQuestion,
  Camera,
} from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { VendorStatusBadge, DistStatusBadge, SimTag } from "@/components/badges";
import { StarRating } from "@/components/StarRating";
import { useStore, useHydrated } from "@/lib/store";
import { formatNumber, formatDate, cn } from "@/lib/utils";

export default function VendorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const hydrated = useHydrated();
  // Pilih array stabil dari store; filter di body (selektor tak boleh
  // mengembalikan array baru tiap render → loop tak terbatas).
  const vendor = useStore((s) => s.vendors.find((v) => v.id === id));
  const allDistributions = useStore((s) => s.distributions);
  const allFeedback = useStore((s) => s.feedback);
  const kitchen = useStore((s) => s.kitchenScans[id]);
  const distributions = allDistributions.filter((d) => d.vendorId === id);
  const feedback = allFeedback.filter((f) => f.vendorId === id);

  if (!hydrated)
    return <div className="py-20 text-center text-slate-400">Memuat…</div>;

  if (!vendor)
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500">Vendor tidak ditemukan.</p>
        <Link href="/vendor/dashboard" className="btn-outline mt-4">
          Kembali ke Dashboard
        </Link>
      </div>
    );

  const avgRating =
    feedback.length > 0
      ? feedback.reduce((s, f) => s + f.rating, 0) / feedback.length
      : vendor.rating;

  return (
    <div>
      <PageHeader title="Profil Digital Vendor" desc={vendor.id} />

      {/* Profile card */}
      <div className="card overflow-hidden">
        <div
          className="h-24"
          style={{
            background: `linear-gradient(135deg, ${vendor.color}, ${vendor.color}cc)`,
          }}
        />
        <div className="px-6 pb-6">
          <div className="-mt-9 flex flex-wrap items-end gap-4">
            <span
              className="grid h-18 w-18 place-items-center rounded-2xl border-4 border-white text-xl font-bold text-white shadow"
              style={{ background: vendor.color, height: 72, width: 72 }}
            >
              {vendor.name.slice(0, 2).toUpperCase()}
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-ink">{vendor.name}</h2>
                {vendor.status === "verified" && (
                  <BadgeCheck size={20} className="text-brand-600" />
                )}
              </div>
              <p className="text-sm text-slate-500">PIC: {vendor.owner}</p>
            </div>
            <VendorStatusBadge status={vendor.status} />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Info icon={MapPin} text={`${vendor.address}, ${vendor.city}`} />
            <Info icon={Phone} text={vendor.phone} />
            <Info icon={Mail} text={vendor.email} />
            <Info
              icon={Utensils}
              text={`${formatNumber(vendor.capacity)} porsi/hari`}
            />
          </div>

          {avgRating > 0 && (
            <div className="mt-5 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <StarRating value={avgRating} size={18} />
              <span className="font-semibold text-ink">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-sm text-slate-400">
                dari {feedback.length} ulasan
              </span>
            </div>
          )}

          {vendor.reviewNote && (
            <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
              Catatan reviewer: {vendor.reviewNote}
            </p>
          )}
        </div>
      </div>

      {/* Kitchen AI summary */}
      <Link
        href="/vendor/kitchen"
        className="card mt-6 flex flex-wrap items-center gap-4 p-5 transition hover:bg-slate-50"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600">
          <Camera size={22} />
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-semibold text-ink">
            Analisis Dapur (AI) <SimTag label="AI" />
          </p>
          <p className="text-xs text-slate-400">
            {kitchen
              ? `${kitchen.staffCount} karyawan • kebersihan ${kitchen.cleanliness}% • APD masker ${kitchen.apd.mask}%`
              : "Belum ada hasil analisis kamera dapur."}
          </p>
        </div>
        {kitchen && (
          <span
            className={cn(
              "ml-auto rounded-xl px-3 py-2 text-center text-sm font-bold",
              kitchen.status === "baik"
                ? "bg-brand-100 text-brand-700"
                : kitchen.status === "perhatian"
                ? "bg-amber-100 text-amber-700"
                : "bg-rose-100 text-rose-700"
            )}
          >
            {kitchen.overallScore}
            <span className="block text-[10px] font-medium">skor</span>
          </span>
        )}
        <span className="text-sm font-semibold text-brand-700">Buka →</span>
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Documents */}
        <div className="card p-5">
          <h3 className="mb-3 font-semibold text-ink">Kelengkapan Dokumen</h3>
          <div className="space-y-2">
            {vendor.docs.map((d) => (
              <div
                key={d.type}
                className="flex items-center justify-between rounded-xl border border-line px-3.5 py-2.5 text-sm"
              >
                <span className="flex items-center gap-2 text-slate-700">
                  {d.uploaded ? (
                    <FileCheck2 size={17} className="text-brand-600" />
                  ) : (
                    <FileX2 size={17} className="text-slate-300" />
                  )}
                  {d.label}
                </span>
                <span
                  className={
                    d.uploaded
                      ? "text-xs font-semibold text-brand-600"
                      : "text-xs text-slate-400"
                  }
                >
                  {d.uploaded ? "Lengkap" : "Belum ada"}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-sm">
            <div>
              <p className="text-xs text-slate-400">NIB (OCR)</p>
              <p className="font-medium text-ink">{vendor.ocr.nib || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">NPWP (OCR)</p>
              <p className="font-medium text-ink">{vendor.ocr.npwp || "—"}</p>
            </div>
          </div>
        </div>

        {/* Distributions */}
        <div className="card p-5">
          <h3 className="mb-3 font-semibold text-ink">Riwayat Distribusi</h3>
          {distributions.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-slate-400">
              <ShieldQuestion size={28} />
              <p className="mt-2 text-sm">Belum ada distribusi.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {distributions.slice(0, 6).map((d) => (
                <Link
                  key={d.id}
                  href={`/distribution/track/${d.id}`}
                  className="flex items-center justify-between rounded-xl border border-line px-3.5 py-2.5 text-sm hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">
                      {d.destination}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatNumber(d.portions)} porsi •{" "}
                      {formatDate(d.scheduledAt, true)}
                    </p>
                  </div>
                  <DistStatusBadge status={d.status} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({
  icon: Icon,
  text,
}: {
  icon: typeof MapPin;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-slate-600">
      <Icon size={17} className="shrink-0 text-slate-400" />
      <span>{text}</span>
    </div>
  );
}
