"use client";

import Link from "next/link";
import {
  Soup,
  FilePlus2,
  Truck,
  MessageSquareHeart,
  Gauge,
  Brain,
  ArrowRight,
  Smartphone,
  Wifi,
  Sparkles,
} from "lucide-react";

const MODULES = [
  {
    n: 1,
    title: "Registrasi & Verifikasi Vendor",
    desc: "Registrasi, upload dokumen, OCR, dan workflow approval/rejection.",
    href: "/vendor/register",
    icon: FilePlus2,
    color: "bg-brand-50 text-brand-600",
  },
  {
    n: 2,
    title: "Monitoring Distribusi",
    desc: "Input pengiriman, GPS tracking, check-in/out, & foto bukti.",
    href: "/distribution/monitor",
    icon: Truck,
    color: "bg-sky-50 text-sky-600",
  },
  {
    n: 3,
    title: "Feedback & Keluhan",
    desc: "QR Code per distribusi, rating 1–5, komentar, dan foto.",
    href: "/distribution/monitor",
    icon: MessageSquareHeart,
    color: "bg-amber-50 text-amber-600",
  },
  {
    n: 4,
    title: "Command Center",
    desc: "KPI program, peta distribusi, keluhan, dan tren rating.",
    href: "/admin/command-center",
    icon: Gauge,
    color: "bg-violet-50 text-violet-600",
  },
  {
    n: 5,
    title: "AI Analitik Sentimen",
    desc: "Klasifikasi komentar penerima: Positif / Netral / Negatif.",
    href: "/admin/analytics",
    icon: Brain,
    color: "bg-rose-50 text-rose-600",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 text-white">
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_20%,#fff,transparent_40%),radial-gradient(circle_at_80%_0%,#fff,transparent_30%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
            <Sparkles size={14} /> Mockup Interaktif • Data Dummy
          </div>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 backdrop-blur">
              <Soup size={26} />
            </span>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
              MBG Monitor
            </h1>
          </div>
          <p className="mt-4 max-w-2xl text-base text-white sm:text-lg">
            Sistem Monitoring <strong>Makan Bergizi Gratis</strong> — pantau
            rantai distribusi dari registrasi vendor, pengiriman, umpan balik
            penerima, hingga command center regulator dengan analitik AI.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/admin/command-center"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50"
            >
              <Gauge size={18} /> Buka Command Center
            </Link>
            <Link
              href="/vendor/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-5 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/25"
            >
              <FilePlus2 size={18} /> Daftarkan Vendor
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-5 text-sm text-white">
            <span className="inline-flex items-center gap-2">
              <Smartphone size={16} /> Mobile-friendly
            </span>
            <span className="inline-flex items-center gap-2">
              <Wifi size={16} /> PWA — installable &amp; offline shell
            </span>
            <span className="inline-flex items-center gap-2">
              <Sparkles size={16} /> UI/UX modern
            </span>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-xl font-bold text-ink">5 Modul Utama</h2>
        <p className="mt-1 text-sm text-slate-500">
          Klik kartu untuk menjelajah tiap modul. Gunakan{" "}
          <strong>Mode Demo — Peran</strong> di sidebar untuk berpindah sudut
          pandang.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m) => (
            <Link
              key={m.n}
              href={m.href}
              className="card group p-6 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`grid h-12 w-12 place-items-center rounded-xl ${m.color}`}
                >
                  <m.icon size={24} />
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Modul {m.n}
                </span>
              </div>
              <h3 className="mt-4 font-semibold text-ink">{m.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{m.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                Buka{" "}
                <ArrowRight
                  size={15}
                  className="transition group-hover:translate-x-1"
                />
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-10 rounded-2xl border border-dashed border-line bg-white p-4 text-center text-xs text-slate-500">
          ⚡ Seluruh data bersifat dummy. Fitur OCR, GPS, dan analisis sentimen
          adalah <strong>simulasi</strong> untuk keperluan demo, bukan layanan
          produksi.
        </p>
      </section>
    </main>
  );
}
