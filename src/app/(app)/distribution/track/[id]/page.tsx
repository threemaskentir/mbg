"use client";

import { use } from "react";
import Link from "next/link";
import {
  Navigation,
  LogIn,
  LogOut,
  Camera,
  Clock,
  MapPin,
  QrCode,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { DistStatusBadge, SimTag } from "@/components/badges";
import { MapCanvas } from "@/components/MapCanvas";
import { PhotoUpload } from "@/components/PhotoUpload";
import { useStore, useHydrated } from "@/lib/store";
import { ORIGIN, etaMinutes } from "@/lib/sim/gps";
import { formatDate, formatNumber } from "@/lib/utils";

export default function TrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const hydrated = useHydrated();
  const role = useStore((s) => s.role);
  const dist = useStore((s) => s.distributions.find((d) => d.id === id));
  const vendor = useStore((s) =>
    s.vendors.find((v) => v.id === dist?.vendorId)
  );
  const setStatus = useStore((s) => s.setDistributionStatus);
  const checkIn = useStore((s) => s.checkIn);
  const checkOut = useStore((s) => s.checkOut);
  const addPhoto = useStore((s) => s.addPhoto);

  if (!hydrated)
    return <div className="py-20 text-center text-slate-400">Memuat…</div>;
  if (!dist)
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500">Distribusi tidak ditemukan.</p>
        <Link href="/distribution/monitor" className="btn-outline mt-4">
          Kembali
        </Link>
      </div>
    );

  return (
    <div>
      <PageHeader
        title="Tracking Distribusi"
        desc={`${dist.id} • ${dist.destination}`}
        action={<DistStatusBadge status={dist.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Left: Map + actions */}
        <div className="space-y-6">
          <div className="card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-semibold text-ink">
                <Navigation size={18} className="text-sky-500" /> GPS Tracking{" "}
                <SimTag />
              </h3>
              {(dist.status === "enroute" || dist.status === "scheduled") && (
                <span className="text-sm text-slate-500">
                  ETA ± {etaMinutes(dist)} menit
                </span>
              )}
            </div>
            <MapCanvas
              height="h-80"
              markers={[
                {
                  id: "origin",
                  lat: ORIGIN.lat,
                  lng: ORIGIN.lng,
                  color: "#64748b",
                  label: "Dapur (asal)",
                  kind: "vendor",
                },
                {
                  id: "dest",
                  lat: dist.lat,
                  lng: dist.lng,
                  color: "#1d5c39",
                  label: dist.destination,
                  pulse: dist.status === "arrived" || dist.status === "done",
                  kind: "dest",
                },
              ]}
              route={{
                from: ORIGIN,
                to: { lat: dist.lat, lng: dist.lng },
                animate: dist.status === "enroute",
                progress: dist.status === "scheduled" ? 0 : 1,
              }}
            />
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-500" /> Posisi
              kurir (simulasi) • <MapPin size={13} /> {dist.address}
            </div>
          </div>

          {/* Action buttons by status (hanya untuk kurir) */}
          <div className="card p-5">
            <h3 className="mb-3 font-semibold text-ink">Aksi Kurir</h3>
            {role === "kurir" ? (
              <div className="flex flex-wrap gap-3">
                {dist.status === "scheduled" && (
                  <button
                    onClick={() => setStatus(dist.id, "enroute")}
                    className="btn-primary"
                  >
                    <Truck size={16} /> Berangkatkan Kurir
                  </button>
                )}
                {dist.status === "enroute" && (
                  <button onClick={() => checkIn(dist.id)} className="btn-primary">
                    <LogIn size={16} /> Check-in di Lokasi
                  </button>
                )}
                {dist.status === "arrived" && (
                  <button
                    onClick={() => checkOut(dist.id)}
                    className="btn bg-brand-600 text-white hover:bg-brand-700"
                  >
                    <LogOut size={16} /> Check-out (Selesai)
                  </button>
                )}
                {dist.status === "done" && (
                  <span className="inline-flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700">
                    <CheckCircle2 size={16} /> Distribusi selesai
                  </span>
                )}
              </div>
            ) : (
              <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">
                Aksi check-in/check-out hanya dapat dilakukan oleh{" "}
                <strong>Kurir</strong>. Ganti peran ke Kurir pada switcher untuk
                memperbaruinya.
              </p>
            )}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-3 text-sm">
                <p className="text-xs text-slate-400">Check-in</p>
                <p className="font-medium text-ink">
                  {dist.checkInAt ? formatDate(dist.checkInAt, true) : "—"}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-sm">
                <p className="text-xs text-slate-400">Check-out</p>
                <p className="font-medium text-ink">
                  {dist.checkOutAt ? formatDate(dist.checkOutAt, true) : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Photo evidence */}
          <div className="card p-5">
            <h3 className="mb-3 font-semibold text-ink">Foto Bukti</h3>
            {role === "kurir" && (
              <PhotoUpload
                label="Upload foto makanan / serah-terima"
                hint="JPG/PNG"
                onPicked={(name) => addPhoto(dist.id, name)}
              />
            )}
            {role !== "kurir" && dist.photos.length === 0 && (
              <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-400">
                Belum ada foto bukti.
              </p>
            )}
            {dist.photos.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {dist.photos.map((p, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700"
                  >
                    <Camera size={13} /> {p}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Info + timeline + QR */}
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="mb-3 font-semibold text-ink">Detail</h3>
            <dl className="space-y-2.5 text-sm">
              <Row k="Vendor" v={vendor?.name ?? "—"} />
              <Row k="Tujuan" v={`${dist.destination} (${dist.destinationType})`} />
              <Row k="Porsi" v={`${formatNumber(dist.portions)} porsi`} />
              <Row k="Menu" v={dist.menu} />
              <Row k="Kurir" v={dist.courier} />
              <Row k="Jadwal" v={formatDate(dist.scheduledAt, true)} />
            </dl>
          </div>

          <div className="card p-5">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-ink">
              <Clock size={17} /> Timeline
            </h3>
            <ol className="relative space-y-4 border-l border-line pl-5">
              {dist.events.map((e, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[1.45rem] top-1 h-2.5 w-2.5 rounded-full bg-brand-500 ring-4 ring-brand-50" />
                  <p className="text-sm font-medium text-ink">{e.label}</p>
                  <p className="text-xs text-slate-400">
                    {formatDate(e.at, true)}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="card p-5 text-center">
            <h3 className="mb-1 flex items-center justify-center gap-2 font-semibold text-ink">
              <QrCode size={17} /> Feedback Penerima
            </h3>
            <p className="mb-3 text-xs text-slate-400">
              Buka form penilaian untuk distribusi ini.
            </p>
            <Link href={`/feedback/${dist.id}`} className="btn-primary w-full">
              Buka Halaman Feedback (QR)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="shrink-0 text-slate-400">{k}</dt>
      <dd className="text-right font-medium text-ink">{v}</dd>
    </div>
  );
}
