import type { Sentiment } from "@/lib/types";

const POSITIVE = [
  "enak", "lezat", "bergizi", "segar", "mantap", "baik", "bagus", "ramah",
  "tepat waktu", "bersih", "hangat", "puas", "terima kasih", "suka", "nikmat",
  "sehat", "memuaskan", "cepat", "rapi",
];
const NEGATIVE = [
  "basi", "telat", "terlambat", "dingin", "sedikit", "kurang", "buruk",
  "tidak enak", "hambar", "kotor", "kecewa", "lambat", "rusak", "pahit",
  "asin", "mentah", "bau", "sakit perut", "porsi kecil", "kemasan rusak",
];

export interface SentimentResult {
  sentiment: Sentiment;
  score: number; // -1..1
  hits: { positive: string[]; negative: string[] };
}

/**
 * SIMULASI sentiment analysis (rule-based keyword).
 * Bukan model AI nyata — untuk keperluan mockup/demo.
 */
export function analyzeSentiment(text: string): SentimentResult {
  const t = ` ${text.toLowerCase()} `;
  const posHits = POSITIVE.filter((w) => t.includes(w));
  const negHits = NEGATIVE.filter((w) => t.includes(w));
  const raw = posHits.length - negHits.length;
  let sentiment: Sentiment = "neutral";
  if (raw > 0) sentiment = "positive";
  else if (raw < 0) sentiment = "negative";
  const total = posHits.length + negHits.length || 1;
  const score = Math.max(-1, Math.min(1, raw / total));
  return { sentiment, score, hits: { positive: posHits, negative: negHits } };
}

export function isComplaint(rating: number, sentiment: Sentiment): boolean {
  return rating <= 2 || sentiment === "negative";
}
