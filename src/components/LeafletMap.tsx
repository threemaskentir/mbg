"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import type { MapMarker } from "@/components/MapCanvas";

interface LatLng {
  lat: number;
  lng: number;
}

interface RouteSpec {
  from: LatLng;
  to: LatLng;
  animate?: boolean; // kurir bergerak (status: dalam perjalanan)
  progress?: number; // 0..1 posisi kurir saat tidak beranimasi
}

interface Props {
  markers: MapMarker[];
  route?: RouteSpec;
  cluster?: boolean; // gabungkan titik berdekatan (mode regulator)
  onMarkerClick?: (id: string) => void;
}

/** Marker titik berwarna (divIcon) + cincin pulse opsional. */
function dotIcon(color: string, pulse?: boolean) {
  const ring = pulse
    ? `<span class="animate-pulse-ring" style="position:absolute;left:50%;top:50%;width:26px;height:26px;margin:-13px 0 0 -13px;border-radius:9999px;background:${color}"></span>`
    : "";
  return L.divIcon({
    className: "mbg-pin",
    html: `<span style="position:relative;display:block;width:16px;height:16px">${ring}<span style="position:absolute;inset:0;border-radius:9999px;background:${color};border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.45)"></span></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

/** Ikon kurir (truk) dengan cincin pulse. */
function courierIcon() {
  return L.divIcon({
    className: "mbg-courier",
    html: `<span style="position:relative;display:grid;place-items:center;width:30px;height:30px">
      <span class="animate-pulse-ring" style="position:absolute;left:50%;top:50%;width:30px;height:30px;margin:-15px 0 0 -15px;border-radius:9999px;background:#0ea5e9"></span>
      <span style="position:relative;display:grid;place-items:center;width:26px;height:26px;border-radius:9999px;background:#0ea5e9;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4);font-size:14px;line-height:1">🚚</span>
    </span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

type Pt = [number, number]; // [lat, lng]

/** Posisi pada polyline berdasarkan fraksi 0..1 dari total panjang. */
function pointAtFraction(line: Pt[], f: number): Pt {
  if (line.length === 1) return line[0];
  const segs: number[] = [];
  let total = 0;
  for (let i = 0; i < line.length - 1; i++) {
    const d = L.latLng(line[i]).distanceTo(L.latLng(line[i + 1]));
    segs.push(d);
    total += d;
  }
  const target = Math.max(0, Math.min(1, f)) * total;
  let acc = 0;
  for (let i = 0; i < segs.length; i++) {
    if (acc + segs[i] >= target) {
      const t = segs[i] === 0 ? 0 : (target - acc) / segs[i];
      const a = line[i];
      const b = line[i + 1];
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    }
    acc += segs[i];
  }
  return line[line.length - 1];
}

const ANIM_DURATION = 90000; // 90 detik menyusuri rute (gerak kurir lebih lambat)

/** Sesuaikan tampilan peta agar pas dengan semua titik. */
function FitBounds({ points }: { points: Pt[] }) {
  const map = useMap();
  const key = points.map((p) => p.join(",")).join("|");
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 14);
      return;
    }
    map.fitBounds(L.latLngBounds(points), { padding: [36, 36], maxZoom: 15 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, map]);
  return null;
}

/** Ikon cluster: lingkaran berwarna + jumlah titik di dalamnya. */
function clusterIcon(color: string, count: number) {
  return L.divIcon({
    html: `<div style="position:relative;display:grid;place-items:center;width:42px;height:42px">
      <span style="position:absolute;inset:0;border-radius:9999px;background:${color};opacity:.25"></span>
      <span style="position:relative;display:grid;place-items:center;width:32px;height:32px;border-radius:9999px;background:${color};color:#fff;font-weight:700;font-size:13px;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)">${count}</span>
    </div>`,
    className: "mbg-cluster",
    iconSize: [42, 42],
    iconAnchor: [21, 21],
  });
}

function makeClusterGroup(color: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (L as any).markerClusterGroup({
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: true,
    maxClusterRadius: 55,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    iconCreateFunction: (c: any) => clusterIcon(color, c.getChildCount()),
  });
}

/** Marker dengan clustering, dipisah per jenis: dapur (hijau) & titik (biru). */
function ClusteredMarkers({
  markers,
  onMarkerClick,
}: {
  markers: MapMarker[];
  onMarkerClick?: (id: string) => void;
}) {
  const map = useMap();
  useEffect(() => {
    const vendorGrp = makeClusterGroup("#1d5c39");
    const destGrp = makeClusterGroup("#0ea5e9");
    markers.forEach((m) => {
      const mk = L.marker([m.lat, m.lng], {
        icon: dotIcon(m.color ?? "#1d5c39", m.pulse),
      });
      if (m.label) mk.bindTooltip(m.label, { direction: "top", offset: [0, -8] });
      if (onMarkerClick) mk.on("click", () => onMarkerClick(m.id));
      (m.kind === "vendor" ? vendorGrp : destGrp).addLayer(mk);
    });
    map.addLayer(vendorGrp);
    map.addLayer(destGrp);
    return () => {
      map.removeLayer(vendorGrp);
      map.removeLayer(destGrp);
    };
  }, [markers, map, onMarkerClick]);
  return null;
}

export function LeafletMap({ markers, route, cluster, onMarkerClick }: Props) {
  // geometri jalan dari OSRM (mengikuti jalan sungguhan)
  const [road, setRoad] = useState<Pt[]>([]);
  const courierRef = useRef<L.Marker>(null);

  useEffect(() => {
    if (!route) {
      setRoad([]);
      return;
    }
    const { from, to } = route;
    const straight: Pt[] = [
      [from.lat, from.lng],
      [to.lat, to.lng],
    ];
    let cancelled = false;
    const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const line = d?.routes?.[0]?.geometry?.coordinates as
          | [number, number][]
          | undefined;
        setRoad(line ? line.map(([lng, lat]) => [lat, lng] as Pt) : straight);
      })
      .catch(() => !cancelled && setRoad(straight));
    return () => {
      cancelled = true;
    };
  }, [route?.from.lat, route?.from.lng, route?.to.lat, route?.to.lng]);

  // gerakkan kurir di sepanjang jalan
  useEffect(() => {
    if (road.length === 0) return;
    const marker = courierRef.current;
    if (!marker) return;

    if (!route?.animate) {
      const p = pointAtFraction(road, route?.progress ?? 1);
      marker.setLatLng(p);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const f = Math.min(1, (now - start) / ANIM_DURATION);
      marker.setLatLng(pointAtFraction(road, f));
      if (f < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [road, route?.animate, route?.progress]);

  const fitPoints: Pt[] = [
    ...markers.map((m) => [m.lat, m.lng] as Pt),
    ...road,
  ];

  return (
    <MapContainer
      center={[-6.3, 106.66]}
      zoom={12}
      scrollWheelZoom
      className="h-full w-full"
      style={{ background: "#e8eef0" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {road.length > 1 && (
        <Polyline
          positions={road}
          pathOptions={{ color: "#1d5c39", weight: 4, opacity: 0.75 }}
        />
      )}

      {cluster ? (
        <ClusteredMarkers markers={markers} onMarkerClick={onMarkerClick} />
      ) : (
        markers.map((m) => (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            icon={dotIcon(m.color ?? "#1d5c39", m.pulse)}
            eventHandlers={
              onMarkerClick ? { click: () => onMarkerClick(m.id) } : undefined
            }
          >
            {m.label && (
              <Tooltip direction="top" offset={[0, -8]}>
                {m.label}
              </Tooltip>
            )}
          </Marker>
        ))
      )}

      {route && road.length > 0 && (
        <Marker ref={courierRef} position={road[0]} icon={courierIcon()}>
          <Tooltip direction="top" offset={[0, -12]}>
            Kurir (simulasi)
          </Tooltip>
        </Marker>
      )}

      <FitBounds points={fitPoints} />
    </MapContainer>
  );
}
