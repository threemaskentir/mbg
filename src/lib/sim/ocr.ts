/**
 * SIMULASI OCR dokumen. Bukan OCR nyata — menghasilkan field terstruktur
 * dummy dengan jeda tiruan, seolah hasil ekstraksi dokumen.
 */
export interface OcrResult {
  nib: string;
  npwp: string;
  businessName: string;
  confidence: number;
}

function randDigits(n: number): string {
  let s = "";
  for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10);
  return s;
}

export function runOcr(file?: { name: string } | null): Promise<OcrResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const npwpRaw = randDigits(15);
      resolve({
        nib: randDigits(13),
        npwp: `${npwpRaw.slice(0, 2)}.${npwpRaw.slice(2, 5)}.${npwpRaw.slice(
          5,
          8
        )}.${npwpRaw.slice(8, 9)}-${npwpRaw.slice(9, 12)}.${npwpRaw.slice(12)}`,
        businessName: file?.name?.replace(/\.[^.]+$/, "") || "Hasil OCR",
        confidence: 0.9 + Math.random() * 0.09,
      });
    }, 1400);
  });
}
