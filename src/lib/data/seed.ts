import type {
  Vendor,
  Distribution,
  Feedback,
  VendorDoc,
  KitchenAnalysis,
} from "@/lib/types";

const now = Date.now();
const iso = (offsetMin: number) => new Date(now + offsetMin * 60000).toISOString();

function docs(filled: VendorDoc["type"][]): VendorDoc[] {
  const all: { type: VendorDoc["type"]; label: string }[] = [
    { type: "NIB", label: "Nomor Induk Berusaha (NIB)" },
    { type: "NPWP", label: "NPWP" },
    { type: "HALAL", label: "Sertifikat Halal" },
    { type: "PIRT", label: "Izin PIRT" },
    { type: "FOTO_DAPUR", label: "Foto Dapur" },
  ];
  return all.map((d) => ({
    ...d,
    fileName: filled.includes(d.type) ? `${d.type.toLowerCase()}_dokumen.pdf` : "",
    uploaded: filled.includes(d.type),
  }));
}

export const SEED_VENDORS: Vendor[] = [
  {
    id: "VND-001",
    name: "Dapur Sehat Bunda",
    owner: "Siti Aminah",
    phone: "0812-3456-7890",
    email: "dapurbunda@mail.com",
    address: "Jl. Pahlawan Seribu, BSD City",
    city: "Serpong",
    lat: -6.3019, lng: 106.6527,
    capacity: 1200,
    color: "#1d5c39",
    status: "verified",
    docs: docs(["NIB", "NPWP", "HALAL", "PIRT", "FOTO_DAPUR"]),
    ocr: { nib: "1289301920031", npwp: "09.254.131.4-021.000" },
    rating: 4.6,
    createdAt: iso(-60 * 24 * 30),
  },
  {
    id: "VND-002",
    name: "Katering Nusantara Jaya",
    owner: "Budi Santoso",
    phone: "0813-9988-7766",
    email: "nusantarajaya@mail.com",
    address: "Jl. Jalur Sutera, Alam Sutera",
    city: "Serpong Utara",
    lat: -6.2440, lng: 106.6560,
    capacity: 2500,
    color: "#0ea5e9",
    status: "verified",
    docs: docs(["NIB", "NPWP", "HALAL", "PIRT", "FOTO_DAPUR"]),
    ocr: { nib: "2390112090114", npwp: "31.118.992.2-018.000" },
    rating: 4.2,
    createdAt: iso(-60 * 24 * 25),
  },
  {
    id: "VND-003",
    name: "Warung Gizi Sejahtera",
    owner: "Dewi Lestari",
    phone: "0857-1122-3344",
    email: "gizisejahtera@mail.com",
    address: "Jl. Siliwangi, Pamulang",
    city: "Pamulang",
    lat: -6.3430, lng: 106.7380,
    capacity: 800,
    color: "#f97316",
    status: "review",
    docs: docs(["NIB", "NPWP", "FOTO_DAPUR"]),
    ocr: { nib: "5510023411902", npwp: "44.901.220.1-077.000" },
    rating: 0,
    createdAt: iso(-60 * 24 * 3),
  },
  {
    id: "VND-004",
    name: "Dapur Berkah Mandiri",
    owner: "Ahmad Fauzi",
    phone: "0819-4455-6677",
    email: "berkahmandiri@mail.com",
    address: "Jl. Ir. H. Juanda, Ciputat",
    city: "Ciputat",
    lat: -6.3120, lng: 106.7510,
    capacity: 1500,
    color: "#8b5cf6",
    status: "review",
    docs: docs(["NIB", "NPWP", "HALAL", "FOTO_DAPUR"]),
    ocr: { nib: "7781290033415", npwp: "52.330.118.9-099.000" },
    rating: 0,
    createdAt: iso(-60 * 24 * 1),
  },
  {
    id: "VND-005",
    name: "Kantin Bahari",
    owner: "Rina Marlina",
    phone: "0812-7788-9900",
    email: "kantinbahari@mail.com",
    address: "Jl. Bintaro Utama, Pondok Aren",
    city: "Pondok Aren",
    lat: -6.2750, lng: 106.7200,
    capacity: 600,
    color: "#ec4899",
    status: "rejected",
    docs: docs(["NIB"]),
    ocr: { nib: "1102938475610", npwp: "" },
    rating: 0,
    reviewNote: "Dokumen NPWP & sertifikasi halal belum dilengkapi.",
    createdAt: iso(-60 * 24 * 5),
  },
  {
    id: "VND-006",
    name: "Dapur Anak Bangsa",
    owner: "Hendra Wijaya",
    phone: "0838-1010-2020",
    email: "anakbangsa@mail.com",
    address: "Jl. Grand Boulevard, BSD City",
    city: "Serpong",
    lat: -6.3010, lng: 106.6420,
    capacity: 1000,
    color: "#14b8a6",
    status: "verified",
    docs: docs(["NIB", "NPWP", "HALAL", "PIRT", "FOTO_DAPUR"]),
    ocr: { nib: "9920183746501", npwp: "18.776.554.3-066.000" },
    rating: 4.8,
    createdAt: iso(-60 * 24 * 40),
  },
];

const DEST = [
  { name: "SDN Lengkong Wetan 01", type: "Sekolah" as const, addr: "Jl. Lengkong Wetan, BSD", lat: -6.2960, lng: 106.6760 },
  { name: "Posyandu Melati Rawa Buntu", type: "Posyandu" as const, addr: "Jl. Rawa Buntu Raya", lat: -6.3150, lng: 106.6700 },
  { name: "PAUD Tunas Bangsa Pamulang", type: "PAUD" as const, addr: "Jl. Pamulang Permai", lat: -6.3420, lng: 106.7390 },
  { name: "SDN Serpong 03", type: "Sekolah" as const, addr: "Jl. Raya Serpong", lat: -6.3170, lng: 106.6650 },
  { name: "Ponpes Al-Hidayah Ciputat", type: "Pesantren" as const, addr: "Jl. Dewi Sartika, Ciputat", lat: -6.3220, lng: 106.7560 },
  { name: "SDN Pondok Aren 05", type: "Sekolah" as const, addr: "Jl. Pondok Aren Raya", lat: -6.2740, lng: 106.7240 },
  { name: "Posyandu Anggrek Bintaro", type: "Posyandu" as const, addr: "Jl. Bintaro Jaya Sektor 9", lat: -6.2820, lng: 106.7300 },
];

const MENUS = [
  "Nasi + Ayam + Sayur + Buah",
  "Nasi + Telur Balado + Tumis Buncis + Pisang",
  "Nasi + Ikan + Capcay + Jeruk",
  "Nasi + Tempe Orek + Sup Ayam + Semangka",
  "Nasi + Rendang + Sayur Asem + Apel",
];
const COURIERS = ["Joko", "Andi", "Rahmat", "Sari", "Tono"];

function mkDist(
  i: number,
  vendorId: string,
  status: Distribution["status"],
  schedOffsetMin: number
): Distribution {
  const d = DEST[i % DEST.length];
  const events: Distribution["events"] = [
    { label: "Distribusi dijadwalkan", at: iso(schedOffsetMin - 120) },
  ];
  let checkInAt: string | undefined;
  let checkOutAt: string | undefined;
  if (status === "enroute" || status === "arrived" || status === "done") {
    events.push({ label: "Kurir berangkat", at: iso(schedOffsetMin - 40) });
  }
  if (status === "arrived" || status === "done") {
    checkInAt = iso(schedOffsetMin - 5);
    events.push({ label: "Check-in lokasi", at: checkInAt });
  }
  if (status === "done") {
    checkOutAt = iso(schedOffsetMin + 20);
    events.push({ label: "Serah-terima selesai (check-out)", at: checkOutAt });
  }
  return {
    id: `DST-${String(1000 + i)}`,
    vendorId,
    destination: d.name,
    destinationType: d.type,
    address: d.addr,
    lat: d.lat,
    lng: d.lng,
    portions: 150 + (i % 5) * 50,
    menu: MENUS[i % MENUS.length],
    courier: COURIERS[i % COURIERS.length],
    scheduledAt: iso(schedOffsetMin),
    status,
    checkInAt,
    checkOutAt,
    photos:
      status === "done" || status === "arrived"
        ? ["Foto makanan", "Foto serah-terima"]
        : [],
    events,
  };
}

export const SEED_DISTRIBUTIONS: Distribution[] = [
  mkDist(0, "VND-001", "done", -180),
  mkDist(1, "VND-002", "done", -150),
  mkDist(2, "VND-006", "done", -120),
  mkDist(3, "VND-001", "arrived", -20),
  mkDist(4, "VND-002", "enroute", 10),
  mkDist(5, "VND-006", "enroute", 25),
  mkDist(6, "VND-001", "scheduled", 90),
  mkDist(0, "VND-002", "scheduled", 120),
  mkDist(4, "VND-006", "scheduled", 150),
];

interface SeedFb {
  dist: number; // index into SEED_DISTRIBUTIONS
  rating: number;
  comment: string;
  sentiment: Feedback["sentiment"];
  complaint: boolean;
  offset: number;
}
const FB: SeedFb[] = [
  { dist: 0, rating: 5, comment: "Makanannya enak dan masih hangat, anak-anak suka!", sentiment: "positive", complaint: false, offset: -170 },
  { dist: 0, rating: 4, comment: "Bergizi dan bersih, terima kasih.", sentiment: "positive", complaint: false, offset: -168 },
  { dist: 0, rating: 5, comment: "Porsinya pas dan lezat.", sentiment: "positive", complaint: false, offset: -165 },
  { dist: 1, rating: 2, comment: "Sayur agak dingin saat sampai, pengiriman telat.", sentiment: "negative", complaint: true, offset: -140 },
  { dist: 1, rating: 3, comment: "Lumayan, tapi porsi sedikit kurang.", sentiment: "negative", complaint: true, offset: -138 },
  { dist: 1, rating: 4, comment: "Cukup baik dan tepat waktu.", sentiment: "positive", complaint: false, offset: -135 },
  { dist: 2, rating: 5, comment: "Mantap, sehat dan rapi kemasannya.", sentiment: "positive", complaint: false, offset: -110 },
  { dist: 2, rating: 5, comment: "Anak saya senang sekali, terima kasih.", sentiment: "positive", complaint: false, offset: -108 },
  { dist: 2, rating: 1, comment: "Nasinya agak basi, kecewa.", sentiment: "negative", complaint: true, offset: -106 },
  { dist: 3, rating: 4, comment: "Ramah petugasnya, makanan bagus.", sentiment: "positive", complaint: false, offset: -10 },
  { dist: 3, rating: 3, comment: "Biasa saja.", sentiment: "neutral", complaint: false, offset: -8 },
];

export const SEED_FEEDBACK: Feedback[] = FB.map((f, i) => ({
  id: `FB-${String(2000 + i)}`,
  distributionId: SEED_DISTRIBUTIONS[f.dist].id,
  vendorId: SEED_DISTRIBUTIONS[f.dist].vendorId,
  rating: f.rating,
  comment: f.comment,
  sentiment: f.sentiment,
  isComplaint: f.complaint,
  createdAt: iso(f.offset),
}));

function kitchen(
  staff: number,
  cleanliness: number,
  tidiness: number,
  maskPct: number,
  glovesPct: number,
  hairnetPct: number,
  offsetMin: number
): KitchenAnalysis {
  const within = (i: number, pct: number) => i < Math.round((staff * pct) / 100);
  const detections = [...Array(staff)].map((_, i) => ({
    id: `det-${i + 1}`,
    x: 0.05 + i * 0.18,
    y: 0.3,
    w: 0.15,
    h: 0.42,
    mask: within(i, maskPct),
    gloves: within(i, glovesPct),
    hairnet: within(i, hairnetPct),
    conf: 0.9,
  }));
  const apdAvg = (maskPct + glovesPct + hairnetPct) / 3;
  const overallScore = Math.round(
    cleanliness * 0.35 + tidiness * 0.25 + apdAvg * 0.4
  );
  const status: KitchenAnalysis["status"] =
    overallScore >= 85 ? "baik" : overallScore >= 70 ? "perhatian" : "buruk";
  const noMask = detections.filter((d) => !d.mask).length;
  const noGloves = detections.filter((d) => !d.gloves).length;
  const noHairnet = detections.filter((d) => !d.hairnet).length;
  const violations: string[] = [];
  if (noMask) violations.push(`${noMask} karyawan tidak memakai masker`);
  if (noGloves) violations.push(`${noGloves} karyawan tanpa sarung tangan`);
  if (noHairnet) violations.push(`${noHairnet} karyawan tanpa penutup kepala`);
  if (cleanliness < 75) violations.push("Kebersihan area di bawah standar");
  if (tidiness < 70) violations.push("Area kerja kurang rapi / berantakan");
  return {
    at: iso(offsetMin),
    staffCount: staff,
    cleanliness,
    tidiness,
    apd: { mask: maskPct, gloves: glovesPct, hairnet: hairnetPct },
    overallScore,
    status,
    violations,
    detections,
  };
}

export const SEED_KITCHEN: Record<string, KitchenAnalysis> = {
  "VND-001": kitchen(4, 92, 88, 100, 75, 100, -60 * 6),
  "VND-002": kitchen(6, 80, 78, 83, 67, 83, -60 * 10),
  "VND-006": kitchen(3, 95, 94, 100, 100, 100, -60 * 3),
};
