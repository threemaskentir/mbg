import type { Vendor, Distribution, Feedback, VendorDoc } from "@/lib/types";

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
    address: "Jl. Kramat Raya No. 12",
    city: "Jakarta Pusat",
    lat: -6.1865, lng: 106.8412,
    capacity: 1200,
    color: "#059669",
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
    address: "Jl. Sudirman Kav. 21",
    city: "Jakarta Selatan",
    lat: -6.2241, lng: 106.8090,
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
    address: "Jl. Otista No. 88",
    city: "Jakarta Timur",
    lat: -6.2266, lng: 106.8702,
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
    address: "Jl. Daan Mogot No. 45",
    city: "Jakarta Barat",
    lat: -6.1681, lng: 106.7642,
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
    address: "Jl. Pluit Raya No. 3",
    city: "Jakarta Utara",
    lat: -6.1214, lng: 106.7905,
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
    address: "Jl. Matraman No. 17",
    city: "Jakarta Timur",
    lat: -6.2008, lng: 106.8557,
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
  { name: "SDN Menteng 01", type: "Sekolah" as const, addr: "Jl. Menteng Raya", lat: -6.1958, lng: 106.8389 },
  { name: "Posyandu Melati", type: "Posyandu" as const, addr: "Jl. Cikini IV", lat: -6.1944, lng: 106.8412 },
  { name: "PAUD Tunas Bangsa", type: "PAUD" as const, addr: "Jl. Tebet Barat", lat: -6.2376, lng: 106.8456 },
  { name: "SDN Pluit 05", type: "Sekolah" as const, addr: "Jl. Pluit Selatan", lat: -6.1289, lng: 106.7991 },
  { name: "Ponpes Al-Hidayah", type: "Pesantren" as const, addr: "Jl. Condet Raya", lat: -6.2701, lng: 106.8612 },
  { name: "SDN Cengkareng 03", type: "Sekolah" as const, addr: "Jl. Cengkareng Indah", lat: -6.1466, lng: 106.7388 },
  { name: "Posyandu Anggrek", type: "Posyandu" as const, addr: "Jl. Matraman Dalam", lat: -6.2031, lng: 106.8533 },
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
