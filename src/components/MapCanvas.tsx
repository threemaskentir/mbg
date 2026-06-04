"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  color?: string;
  label?: string;
  pulse?: boolean;
  kind?: "vendor" | "dest" | "courier";
}

interface LatLng {
  lat: number;
  lng: number;
}

export interface MapCanvasProps {
  markers: MapMarker[];
  route?: { from: LatLng; to: LatLng; animate?: boolean; progress?: number };
  cluster?: boolean;
  height?: string;
  onMarkerClick?: (id: string) => void;
  className?: string;
}

// Leaflet butuh `window`, jadi dimuat hanya di klien (tanpa SSR).
const LeafletMap = dynamic(
  () => import("@/components/LeafletMap").then((m) => m.LeafletMap),
  {
    ssr: false,
    loading: () => <div className="h-full w-full animate-pulse bg-slate-100" />,
  }
);

export function MapCanvas({
  markers,
  route,
  cluster,
  height = "h-80",
  onMarkerClick,
  className,
}: MapCanvasProps) {
  return (
    <div
      className={cn(
        "relative z-0 w-full overflow-hidden rounded-2xl border border-line",
        height,
        className
      )}
    >
      <LeafletMap
        markers={markers}
        route={route}
        cluster={cluster}
        onMarkerClick={onMarkerClick}
      />
    </div>
  );
}
