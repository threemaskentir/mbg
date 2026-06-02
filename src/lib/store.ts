"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Vendor,
  Distribution,
  Feedback,
  Role,
  VendorStatus,
  DistributionStatus,
} from "@/lib/types";
import {
  SEED_VENDORS,
  SEED_DISTRIBUTIONS,
  SEED_FEEDBACK,
} from "@/lib/data/seed";
import { analyzeSentiment, isComplaint } from "@/lib/sim/sentiment";
import { ROLE_ORDER } from "@/lib/roles";

interface MBGState {
  role: Role;
  actingVendorId: string; // vendor yang sedang "diperankan" (mode vendor)
  vendors: Vendor[];
  distributions: Distribution[];
  feedback: Feedback[];

  setRole: (r: Role) => void;
  setActingVendor: (id: string) => void;
  resetData: () => void;

  addVendor: (v: Omit<Vendor, "id" | "createdAt" | "status" | "rating"> & {
    status?: VendorStatus;
  }) => string;
  setVendorStatus: (id: string, status: VendorStatus, note?: string) => void;

  addDistribution: (
    d: Omit<Distribution, "id" | "status" | "photos" | "events">
  ) => string;
  setDistributionStatus: (id: string, status: DistributionStatus) => void;
  checkIn: (id: string) => void;
  checkOut: (id: string) => void;
  confirmReceived: (id: string) => void;
  addPhoto: (id: string, label: string) => void;

  addFeedback: (f: {
    distributionId: string;
    vendorId: string;
    rating: number;
    comment: string;
    photo?: string;
  }) => void;
}

const nowIso = () => new Date().toISOString();

function rand(prefix: string, base: number) {
  return `${prefix}-${base + Math.floor(Math.random() * 9000)}`;
}

export const useStore = create<MBGState>()(
  persist(
    (set) => ({
      role: "regulator",
      actingVendorId: "VND-001",
      vendors: SEED_VENDORS,
      distributions: SEED_DISTRIBUTIONS,
      feedback: SEED_FEEDBACK,

      setRole: (role) => set({ role }),
      setActingVendor: (actingVendorId) => set({ actingVendorId }),

      resetData: () =>
        set({
          vendors: SEED_VENDORS,
          distributions: SEED_DISTRIBUTIONS,
          feedback: SEED_FEEDBACK,
        }),

      addVendor: (v) => {
        const id = rand("VND", 7000);
        const vendor: Vendor = {
          ...v,
          id,
          status: v.status ?? "review",
          rating: 0,
          createdAt: nowIso(),
        };
        set((s) => ({ vendors: [vendor, ...s.vendors] }));
        return id;
      },

      setVendorStatus: (id, status, note) =>
        set((s) => ({
          vendors: s.vendors.map((v) =>
            v.id === id ? { ...v, status, reviewNote: note ?? v.reviewNote } : v
          ),
        })),

      addDistribution: (d) => {
        const id = rand("DST", 5000);
        const dist: Distribution = {
          ...d,
          id,
          status: "scheduled",
          photos: [],
          events: [{ label: "Distribusi dijadwalkan", at: nowIso() }],
        };
        set((s) => ({ distributions: [dist, ...s.distributions] }));
        return id;
      },

      setDistributionStatus: (id, status) =>
        set((s) => ({
          distributions: s.distributions.map((d) =>
            d.id === id
              ? {
                  ...d,
                  status,
                  events: [
                    ...d.events,
                    { label: `Status: ${status}`, at: nowIso() },
                  ],
                }
              : d
          ),
        })),

      checkIn: (id) =>
        set((s) => ({
          distributions: s.distributions.map((d) =>
            d.id === id
              ? {
                  ...d,
                  status: "arrived",
                  checkInAt: nowIso(),
                  events: [
                    ...d.events,
                    { label: "Check-in lokasi", at: nowIso() },
                  ],
                }
              : d
          ),
        })),

      checkOut: (id) =>
        set((s) => ({
          distributions: s.distributions.map((d) =>
            d.id === id
              ? {
                  ...d,
                  status: "done",
                  checkOutAt: nowIso(),
                  events: [
                    ...d.events,
                    { label: "Serah-terima selesai (check-out)", at: nowIso() },
                  ],
                }
              : d
          ),
        })),

      confirmReceived: (id) =>
        set((s) => ({
          distributions: s.distributions.map((d) =>
            d.id === id
              ? {
                  ...d,
                  receivedConfirmedAt: nowIso(),
                  events: [
                    ...d.events,
                    { label: "Kiriman dikonfirmasi sampai oleh penerima", at: nowIso() },
                  ],
                }
              : d
          ),
        })),

      addPhoto: (id, label) =>
        set((s) => ({
          distributions: s.distributions.map((d) =>
            d.id === id ? { ...d, photos: [...d.photos, label] } : d
          ),
        })),

      addFeedback: ({ distributionId, vendorId, rating, comment, photo }) => {
        const { sentiment } = analyzeSentiment(comment);
        const fb: Feedback = {
          id: rand("FB", 9000),
          distributionId,
          vendorId,
          rating,
          comment,
          photo,
          sentiment,
          isComplaint: isComplaint(rating, sentiment),
          createdAt: nowIso(),
        };
        set((s) => ({ feedback: [fb, ...s.feedback] }));
      },
    }),
    {
      name: "mbg-monitor-store-v2",
      version: 2,
      // Jangan hydrate otomatis saat store dibuat (localStorage dibaca sinkron
      // di klien → menyebabkan mismatch dengan HTML server). Rehydrate manual
      // setelah mount via <StoreHydrator />.
      skipHydration: true,
      // Sanitasi state ter-persist: peran lama yang sudah dihapus (mis.
      // "penerima_manfaat") dikoreksi ke "regulator" agar tidak crash.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<MBGState>;
        const role: Role =
          p.role && ROLE_ORDER.includes(p.role) ? p.role : "regulator";
        return { ...current, ...p, role };
      },
    }
  )
);

/**
 * Hook untuk menghindari hydration mismatch dengan data ter-persist.
 * Mengembalikan true hanya setelah rehydrasi dari localStorage selesai.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (useStore.persist.hasHydrated()) setHydrated(true);
    const unsub = useStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);
  return hydrated;
}
