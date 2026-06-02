"use client";

import { cn } from "@/lib/utils";

/** Bounding box wilayah demo (Jakarta). */
const BBOX = { latMax: -6.08, latMin: -6.32, lngMin: 106.68, lngMax: 106.94 };

export function project(lat: number, lng: number) {
  const x = ((lng - BBOX.lngMin) / (BBOX.lngMax - BBOX.lngMin)) * 100;
  const y = ((BBOX.latMax - lat) / (BBOX.latMax - BBOX.latMin)) * 100;
  return {
    x: Math.max(2, Math.min(98, x)),
    y: Math.max(2, Math.min(98, y)),
  };
}

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  color?: string;
  label?: string;
  pulse?: boolean;
  kind?: "vendor" | "dest" | "courier";
}

export function MapCanvas({
  markers,
  route,
  height = "h-80",
  onMarkerClick,
  className,
}: {
  markers: MapMarker[];
  route?: { from: { lat: number; lng: number }; to: { lat: number; lng: number }; courier: { lat: number; lng: number } };
  height?: string;
  onMarkerClick?: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-line",
        height,
        className
      )}
      style={{
        background:
          "linear-gradient(135deg,#eef6f1 0%,#e7f0f7 60%,#eaf3ee 100%)",
      }}
    >
      {/* decorative water + land blobs */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0H0V28" fill="none" stroke="#cdd9e5" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <ellipse cx="20%" cy="85%" rx="160" ry="70" fill="#dbe9f4" opacity="0.7" />
        <ellipse cx="82%" cy="22%" rx="130" ry="60" fill="#e3efe6" opacity="0.7" />
      </svg>

      {/* route line + courier */}
      {route && (
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line
            x1={project(route.from.lat, route.from.lng).x}
            y1={project(route.from.lat, route.from.lng).y}
            x2={project(route.to.lat, route.to.lng).x}
            y2={project(route.to.lat, route.to.lng).y}
            stroke="#059669"
            strokeWidth="0.6"
            strokeDasharray="2 1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}

      {route && <CourierDot lat={route.courier.lat} lng={route.courier.lng} />}

      {markers.map((m) => {
        const { x, y } = project(m.lat, m.lng);
        const color = m.color ?? "#059669";
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onMarkerClick?.(m.id)}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            {m.pulse && (
              <span
                className="animate-pulse-ring absolute left-1/2 top-1/2 -ml-3 -mt-3 h-6 w-6 rounded-full"
                style={{ background: color }}
              />
            )}
            <span
              className="relative block h-3.5 w-3.5 rounded-full border-2 border-white shadow"
              style={{ background: color }}
            />
            {m.label && (
              <span className="pointer-events-none absolute left-1/2 top-5 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-ink/90 px-2 py-0.5 text-[10px] font-medium text-white group-hover:block">
                {m.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function CourierDot({ lat, lng }: { lat: number; lng: number }) {
  const { x, y } = project(lat, lng);
  return (
    <div
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <span className="animate-pulse-ring absolute left-1/2 top-1/2 -ml-3 -mt-3 h-6 w-6 rounded-full bg-sky-500" />
      <span className="relative block h-4 w-4 rounded-full border-2 border-white bg-sky-500 shadow-lg" />
    </div>
  );
}
