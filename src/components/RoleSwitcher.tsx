"use client";

import {
  Store,
  Bike,
  ShieldCheck,
  Users,
  HeartHandshake,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { ROLE_HOME, ROLE_LABEL, ROLE_ORDER } from "@/lib/roles";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICON: Record<Role, LucideIcon> = {
  regulator: ShieldCheck,
  vendor: Store,
  kurir: Bike,
  penerima: Users,
  penerima_manfaat: HeartHandshake,
};

export function RoleSwitcher() {
  const router = useRouter();
  const role = useStore((s) => s.role);
  const setRole = useStore((s) => s.setRole);
  const [open, setOpen] = useState(false);
  const CurrentIcon = ICON[role];

  function pick(r: Role) {
    setRole(r);
    setOpen(false);
    router.push(ROLE_HOME[r]);
  }

  return (
    <div className="relative">
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        Mode Demo — Peran
      </p>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-xl border border-line bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        <span className="flex items-center gap-2">
          <CurrentIcon size={17} className="text-brand-600" />
          {ROLE_LABEL[role]}
        </span>
        <ChevronDown size={16} className={cn("transition", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-line bg-white shadow-lg">
          {ROLE_ORDER.map((r) => {
            const Icon = ICON[r];
            return (
              <button
                key={r}
                onClick={() => pick(r)}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-slate-50",
                  r === role ? "font-semibold text-brand-700" : "text-slate-600"
                )}
              >
                <Icon size={17} />
                {ROLE_LABEL[r]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
