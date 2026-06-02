"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  X,
  FileCheck2,
  FileX2,
  ChevronRight,
  Inbox,
} from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { VendorStatusBadge } from "@/components/badges";
import { useStore, useHydrated } from "@/lib/store";
import { formatNumber, formatDate, cn } from "@/lib/utils";

export default function VerificationPage() {
  const hydrated = useHydrated();
  const vendors = useStore((s) => s.vendors);
  const setVendorStatus = useStore((s) => s.setVendorStatus);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [filter, setFilter] = useState<"review" | "all">("review");

  if (!hydrated)
    return <div className="py-20 text-center text-slate-400">Memuat…</div>;

  const list =
    filter === "review"
      ? vendors.filter((v) => v.status === "review")
      : vendors;
  const selected = vendors.find((v) => v.id === selectedId);

  return (
    <div>
      <PageHeader
        title="Verifikasi Vendor"
        desc="Review dokumen vendor lalu setujui atau tolak."
        action={
          <div className="flex rounded-xl border border-line bg-white p-1 text-sm">
            {(["review", "all"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-lg px-3 py-1.5 font-medium transition",
                  filter === f
                    ? "bg-brand-600 text-white"
                    : "text-slate-500 hover:bg-slate-100"
                )}
              >
                {f === "review" ? "Antrean Review" : "Semua"}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* List */}
        <div className="space-y-2">
          {list.length === 0 ? (
            <div className="card flex flex-col items-center py-12 text-slate-400">
              <Inbox size={30} />
              <p className="mt-2 text-sm">Tidak ada vendor di antrean.</p>
            </div>
          ) : (
            list.map((v) => (
              <button
                key={v.id}
                onClick={() => {
                  setSelectedId(v.id);
                  setNote("");
                }}
                className={cn(
                  "card flex w-full items-center gap-3 p-4 text-left transition",
                  selectedId === v.id
                    ? "ring-2 ring-brand-500"
                    : "hover:bg-slate-50"
                )}
              >
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-bold text-white"
                  style={{ background: v.color }}
                >
                  {v.name.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">{v.name}</p>
                  <p className="text-xs text-slate-400">
                    {v.city} • {formatDate(v.createdAt)}
                  </p>
                </div>
                <VendorStatusBadge status={v.status} />
                <ChevronRight size={16} className="text-slate-300" />
              </button>
            ))
          )}
        </div>

        {/* Detail / review panel */}
        <div className="card p-6">
          {!selected ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-slate-400">
              <FileCheck2 size={32} />
              <p className="mt-2 text-sm">
                Pilih vendor untuk meninjau dokumen.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-ink">
                    {selected.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    PIC: {selected.owner} • {formatNumber(selected.capacity)}{" "}
                    porsi/hari
                  </p>
                </div>
                <Link
                  href={`/vendor/profile/${selected.id}`}
                  className="text-sm font-semibold text-brand-600 hover:underline"
                >
                  Profil →
                </Link>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-sm">
                <div>
                  <p className="text-xs text-slate-400">NIB (OCR)</p>
                  <p className="font-medium text-ink">
                    {selected.ocr.nib || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">NPWP (OCR)</p>
                  <p className="font-medium text-ink">
                    {selected.ocr.npwp || "—"}
                  </p>
                </div>
              </div>

              <h4 className="mt-5 mb-2 text-sm font-semibold text-slate-700">
                Dokumen
              </h4>
              <div className="space-y-2">
                {selected.docs.map((d) => (
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
                    <span className="text-xs text-slate-400">
                      {d.uploaded ? d.fileName : "Belum ada"}
                    </span>
                  </div>
                ))}
              </div>

              {selected.status === "review" ? (
                <>
                  <textarea
                    className="input mt-4 min-h-20"
                    placeholder="Catatan untuk vendor (opsional bila menyetujui, wajib bila menolak)…"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                  <div className="mt-3 flex gap-3">
                    <button
                      onClick={() =>
                        setVendorStatus(selected.id, "verified", note || undefined)
                      }
                      className="btn-primary flex-1"
                    >
                      <Check size={16} /> Setujui
                    </button>
                    <button
                      onClick={() =>
                        setVendorStatus(
                          selected.id,
                          "rejected",
                          note || "Dokumen tidak lengkap."
                        )
                      }
                      className="btn flex-1 bg-rose-600 text-white hover:bg-rose-700"
                    >
                      <X size={16} /> Tolak
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm">
                  <span className="text-slate-500">Status saat ini:</span>
                  <VendorStatusBadge status={selected.status} />
                  <button
                    onClick={() => setVendorStatus(selected.id, "review")}
                    className="ml-auto text-xs font-semibold text-brand-600 hover:underline"
                  >
                    Kembalikan ke review
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
