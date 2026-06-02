"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

/**
 * Memicu rehydrasi store dari localStorage setelah mount (karena store
 * memakai `skipHydration`). Ditempatkan sekali di root layout.
 */
export function StoreHydrator() {
  useEffect(() => {
    useStore.persist.rehydrate();
  }, []);
  return null;
}
