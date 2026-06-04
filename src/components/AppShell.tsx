"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FilePlus2,
  Truck,
  PackagePlus,
  PackageCheck,
  MessageSquareHeart,
  Bike,
  Gauge,
  ShieldCheck,
  BarChart3,
  RotateCcw,
  Download,
  Menu,
  type LucideIcon,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { Logo } from "@/components/Logo";
import { ROLE_DESC } from "@/lib/roles";
import type { Role } from "@/lib/types";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: Role[];
}
interface NavGroup {
  group: string;
  items: NavItem[];
}

const NAV: NavGroup[] = [
  {
    group: "Regulator",
    items: [
      { href: "/admin/command-center", label: "Command Center", icon: Gauge, roles: ["regulator"] },
      { href: "/vendor/dashboard", label: "Dashboard Vendor", icon: LayoutDashboard, roles: ["regulator"] },
      { href: "/admin/verification", label: "Verifikasi Vendor", icon: ShieldCheck, roles: ["regulator"] },
      { href: "/distribution/monitor", label: "Monitoring Distribusi", icon: Truck, roles: ["regulator"] },
      { href: "/admin/analytics", label: "Analitik & Feedback", icon: BarChart3, roles: ["regulator"] },
    ],
  },
  {
    group: "Vendor",
    items: [
      { href: "/vendor/register", label: "Registrasi Vendor", icon: FilePlus2, roles: ["vendor"] },
      { href: "/distribution/new", label: "Input Pengiriman", icon: PackagePlus, roles: ["vendor"] },
      { href: "/distribution/monitor", label: "Distribusi Saya", icon: Truck, roles: ["vendor"] },
    ],
  },
  {
    group: "Kurir",
    items: [
      { href: "/distribution/courier", label: "Check-in & Check-out", icon: Bike, roles: ["kurir"] },
    ],
  },
  {
    group: "Penerima",
    items: [
      { href: "/penerima/konfirmasi", label: "Konfirmasi Kiriman", icon: PackageCheck, roles: ["penerima"] },
      { href: "/penerima/feedback", label: "Feedback", icon: MessageSquareHeart, roles: ["penerima"] },
    ],
  },
];

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const role = useStore((s) => s.role);
  const resetData = useStore((s) => s.resetData);
  const vendors = useStore((s) => s.vendors);
  const actingVendorId = useStore((s) => s.actingVendorId);
  const setActingVendor = useStore((s) => s.setActingVendor);
  const [installEvt, setInstallEvt] = useState<BeforeInstallPromptEvent | null>(null);

  // Tampilkan hanya menu yang relevan untuk peran aktif
  const visibleNav = NAV.map((g) => ({
    ...g,
    items: g.items.filter((it) => it.roles.includes(role)),
  })).filter((g) => g.items.length > 0);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar (desktop) / Drawer (mobile) */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 transform border-r border-line bg-white transition-transform md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <Link href="/" className="flex items-center gap-2.5 px-5 py-4">
            <Logo className="h-10 w-10 rounded-xl ring-1 ring-line" />
            <span>
              <span className="block text-sm font-bold leading-tight text-ink">
                MB Guardian
              </span>
              <span className="block text-[11px] text-slate-400">
                Makan Bergizi Gratis
              </span>
            </span>
          </Link>

          <div className="px-4 pb-3">
            <RoleSwitcher />
            <p className="mt-2 px-1 text-[11px] leading-snug text-slate-400">
              {ROLE_DESC[role]}
            </p>
            {role === "vendor" && (
              <div className="mt-3">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Bertindak sebagai
                </p>
                <select
                  className="input py-2 text-sm"
                  value={actingVendorId}
                  onChange={(e) => setActingVendor(e.target.value)}
                >
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-2">
            {visibleNav.map((g) => (
              <div key={g.group}>
                <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {g.group}
                </p>
                <div className="space-y-0.5">
                  {g.items.map((it) => {
                    const active = pathname.startsWith(it.href);
                    return (
                      <Link
                        key={it.href}
                        href={it.href}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                          active
                            ? "bg-brand-50 text-brand-700"
                            : "text-slate-600 hover:bg-slate-100"
                        )}
                      >
                        <it.icon size={18} />
                        {it.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="space-y-2 border-t border-line p-3">
            {installEvt && (
              <button
                onClick={() => installEvt.prompt()}
                className="btn-primary w-full"
              >
                <Download size={16} /> Install Aplikasi (PWA)
              </button>
            )}
            <button
              onClick={() => {
                if (confirm("Reset semua data demo ke kondisi awal?")) resetData();
              }}
              className="btn-outline w-full"
            >
              <RotateCcw size={16} /> Reset Data Demo
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-white/80 px-4 py-3 backdrop-blur md:hidden">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg p-1.5 hover:bg-slate-100"
          >
            <Menu size={22} />
          </button>
          <Logo className="h-7 w-7 rounded-lg ring-1 ring-line" />
          <span className="font-bold text-ink">MB Guardian</span>
        </header>

        <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  desc,
  action,
}: {
  title: React.ReactNode;
  desc?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1>
        {desc && <p className="mt-1 text-sm text-slate-500">{desc}</p>}
      </div>
      {action}
    </div>
  );
}
