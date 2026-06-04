import type { KitchenAnalysis, KitchenDetection } from "@/lib/types";

/**
 * SIMULASI analisis kamera dapur berbasis "computer vision".
 * Bukan model AI nyata — menghasilkan deteksi & skor dummy yang masuk akal
 * untuk keperluan mockup/demo (deteksi orang, APD, kebersihan, kerapihan).
 */

function rnd(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
function chance(p: number) {
  return Math.random() < p;
}

function buildDetections(count: number): KitchenDetection[] {
  const dets: KitchenDetection[] = [];
  for (let i = 0; i < count; i++) {
    const w = rnd(0.12, 0.2);
    const h = rnd(0.34, 0.5);
    const x = Math.min(0.96 - w, 0.04 + (i / Math.max(1, count)) * 0.9 + rnd(-0.04, 0.04));
    const y = rnd(0.22, 0.45);
    dets.push({
      id: `det-${i + 1}`,
      x,
      y,
      w,
      h,
      mask: chance(0.78),
      gloves: chance(0.62),
      hairnet: chance(0.7),
      conf: rnd(0.82, 0.98),
    });
  }
  return dets;
}

function pct(arr: KitchenDetection[], key: "mask" | "gloves" | "hairnet") {
  if (arr.length === 0) return 100;
  return Math.round((arr.filter((d) => d[key]).length / arr.length) * 100);
}

export function analyzeKitchen(): Promise<KitchenAnalysis> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const staffCount = Math.round(rnd(2, 6));
      const detections = buildDetections(staffCount);
      const apd = {
        mask: pct(detections, "mask"),
        gloves: pct(detections, "gloves"),
        hairnet: pct(detections, "hairnet"),
      };
      const cleanliness = Math.round(rnd(62, 97));
      const tidiness = Math.round(rnd(60, 96));
      const apdAvg = (apd.mask + apd.gloves + apd.hairnet) / 3;
      const overallScore = Math.round(
        cleanliness * 0.35 + tidiness * 0.25 + apdAvg * 0.4
      );

      const violations: string[] = [];
      const noMask = detections.filter((d) => !d.mask).length;
      const noGloves = detections.filter((d) => !d.gloves).length;
      const noHairnet = detections.filter((d) => !d.hairnet).length;
      if (noMask) violations.push(`${noMask} karyawan tidak memakai masker`);
      if (noGloves) violations.push(`${noGloves} karyawan tanpa sarung tangan`);
      if (noHairnet) violations.push(`${noHairnet} karyawan tanpa penutup kepala`);
      if (cleanliness < 75) violations.push("Kebersihan area di bawah standar");
      if (tidiness < 70) violations.push("Area kerja kurang rapi / berantakan");

      const status: KitchenAnalysis["status"] =
        overallScore >= 85 ? "baik" : overallScore >= 70 ? "perhatian" : "buruk";

      resolve({
        at: new Date().toISOString(),
        staffCount,
        cleanliness,
        tidiness,
        apd,
        overallScore,
        status,
        violations,
        detections,
      });
    }, 1600);
  });
}
