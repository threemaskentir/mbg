"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ScanLine,
  Loader2,
  PartyPopper,
} from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { DocUpload } from "@/components/PhotoUpload";
import { SimTag } from "@/components/badges";
import { useStore } from "@/lib/store";
import { runOcr, type OcrResult } from "@/lib/sim/ocr";
import { cn } from "@/lib/utils";
import type { VendorDoc } from "@/lib/types";

const STEPS = ["Data Usaha", "PIC & Lokasi", "Dokumen + OCR", "Review"];
const COLORS = ["#1d5c39", "#0ea5e9", "#f97316", "#8b5cf6", "#ec4899", "#14b8a6"];

const DOC_DEFS: { type: VendorDoc["type"]; label: string }[] = [
  { type: "NIB", label: "Nomor Induk Berusaha (NIB)" },
  { type: "NPWP", label: "NPWP" },
  { type: "HALAL", label: "Sertifikat Halal" },
  { type: "PIRT", label: "Izin PIRT" },
  { type: "FOTO_DAPUR", label: "Foto Dapur" },
];

export default function VendorRegisterPage() {
  const router = useRouter();
  const addVendor = useStore((s) => s.addVendor);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    owner: "",
    phone: "",
    email: "",
    address: "",
    city: "Serpong",
    capacity: 500,
  });
  const [docs, setDocs] = useState<VendorDoc[]>(
    DOC_DEFS.map((d) => ({ ...d, fileName: "", uploaded: false }))
  );
  const [ocr, setOcr] = useState<OcrResult | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);

  const set = (k: keyof typeof form, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  function uploadDoc(type: VendorDoc["type"], fileName: string) {
    setDocs((d) =>
      d.map((x) => (x.type === type ? { ...x, fileName, uploaded: true } : x))
    );
  }

  async function doOcr() {
    setOcrLoading(true);
    setOcr(null);
    const res = await runOcr({ name: form.name || "dokumen" });
    setOcr(res);
    setOcrLoading(false);
  }

  const canNext = () => {
    if (step === 0) return form.name && form.email;
    if (step === 1) return form.owner && form.phone && form.address;
    if (step === 2) return docs.some((d) => d.uploaded);
    return true;
  };

  function submit() {
    const id = addVendor({
      ...form,
      lat: -6.30 + (Math.random() - 0.5) * 0.1,
      lng: 106.67 + (Math.random() - 0.5) * 0.12,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      docs,
      ocr: { nib: ocr?.nib ?? "", npwp: ocr?.npwp ?? "" },
      status: "review",
    });
    setDone(id);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md py-10 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-100 text-brand-600">
          <PartyPopper size={30} />
        </div>
        <h2 className="mt-4 text-xl font-bold text-ink">Registrasi Terkirim!</h2>
        <p className="mt-2 text-sm text-slate-500">
          Vendor <strong>{form.name}</strong> ({done}) berhasil didaftarkan dan
          kini berstatus <strong>Menunggu Review</strong> regulator.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => router.push(`/vendor/profile/${done}`)} className="btn-primary">
            Lihat Profil Digital
          </button>
          <button onClick={() => router.push("/vendor/dashboard")} className="btn-outline">
            Ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Registrasi Vendor"
        desc="Lengkapi data, unggah dokumen, dan kirim untuk verifikasi."
      />

      {/* Stepper */}
      <div className="mb-8 flex items-center">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-full text-sm font-semibold transition",
                  i < step
                    ? "bg-brand-600 text-white"
                    : i === step
                    ? "bg-brand-100 text-brand-700 ring-2 ring-brand-500"
                    : "bg-slate-100 text-slate-400"
                )}
              >
                {i < step ? <Check size={16} /> : i + 1}
              </div>
              <span className="mt-1.5 hidden text-[11px] font-medium text-slate-500 sm:block">
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 flex-1 rounded",
                  i < step ? "bg-brand-500" : "bg-slate-200"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className="card p-6">
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="label">Nama Usaha / Dapur</label>
              <input
                className="input"
                placeholder="cth. Dapur Sehat Bunda"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="vendor@email.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Kapasitas Produksi (porsi/hari)</label>
              <input
                className="input"
                type="number"
                value={form.capacity}
                onChange={(e) => set("capacity", Number(e.target.value))}
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="label">Nama Penanggung Jawab (PIC)</label>
              <input
                className="input"
                placeholder="cth. Siti Aminah"
                value={form.owner}
                onChange={(e) => set("owner", e.target.value)}
              />
            </div>
            <div>
              <label className="label">No. Telepon</label>
              <input
                className="input"
                placeholder="0812-xxxx-xxxx"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Alamat</label>
              <input
                className="input"
                placeholder="Jl. ..."
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Kota / Wilayah</label>
              <select
                className="input"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
              >
                {[
                  "Serpong",
                  "Serpong Utara",
                  "Pondok Aren",
                  "Ciputat",
                  "Ciputat Timur",
                  "Pamulang",
                  "Setu",
                ].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            {docs.map((d) => (
              <DocUpload
                key={d.type}
                label={d.label}
                uploaded={d.uploaded}
                onUpload={(fn) => uploadDoc(d.type, fn)}
              />
            ))}

            <div className="mt-4 rounded-xl border border-violet-200 bg-violet-50/60 p-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-semibold text-violet-800">
                  <ScanLine size={18} /> OCR Dokumen <SimTag />
                </span>
                <button
                  onClick={doOcr}
                  disabled={ocrLoading || !docs.some((d) => d.uploaded)}
                  className="btn-primary py-2"
                >
                  {ocrLoading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Memindai…
                    </>
                  ) : (
                    "Jalankan OCR"
                  )}
                </button>
              </div>
              {ocr && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="label">NIB (terdeteksi)</label>
                    <input className="input" value={ocr.nib} readOnly />
                  </div>
                  <div>
                    <label className="label">NPWP (terdeteksi)</label>
                    <input className="input" value={ocr.npwp} readOnly />
                  </div>
                  <p className="text-xs text-violet-600 sm:col-span-2">
                    Akurasi simulasi: {(ocr.confidence * 100).toFixed(1)}% —
                    silakan koreksi bila perlu sebelum mengirim.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-ink">Ringkasan</h3>
            <dl className="grid gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
              <Row k="Nama Usaha" v={form.name} />
              <Row k="Email" v={form.email} />
              <Row k="PIC" v={form.owner} />
              <Row k="Telepon" v={form.phone} />
              <Row k="Alamat" v={`${form.address}, ${form.city}`} />
              <Row k="Kapasitas" v={`${form.capacity} porsi/hari`} />
              <Row k="NIB (OCR)" v={ocr?.nib || "—"} />
              <Row k="NPWP (OCR)" v={ocr?.npwp || "—"} />
              <Row
                k="Dokumen"
                v={`${docs.filter((d) => d.uploaded).length}/${docs.length} terupload`}
              />
            </dl>
            <p className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
              Dengan mengirim, vendor masuk antrean verifikasi regulator.
            </p>
          </div>
        )}

        {/* Footer nav */}
        <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="btn-ghost"
          >
            <ChevronLeft size={16} /> Kembali
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext()}
              className="btn-primary"
            >
              Lanjut <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={submit} className="btn-primary">
              <Check size={16} /> Kirim Registrasi
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line py-1.5 sm:block sm:border-0 sm:py-0">
      <dt className="text-slate-400">{k}</dt>
      <dd className="text-right font-medium text-ink sm:text-left">{v}</dd>
    </div>
  );
}
