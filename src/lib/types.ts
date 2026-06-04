export type Role = "regulator" | "vendor" | "kurir" | "penerima";

export type VendorStatus = "draft" | "review" | "verified" | "rejected";

export interface VendorDoc {
  type: "NIB" | "NPWP" | "HALAL" | "PIRT" | "FOTO_DAPUR";
  label: string;
  fileName: string;
  uploaded: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  owner: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  capacity: number; // porsi / hari
  color: string; // avatar color
  status: VendorStatus;
  docs: VendorDoc[];
  ocr: { nib: string; npwp: string };
  rating: number;
  reviewNote?: string;
  createdAt: string;
}

export type DistributionStatus = "scheduled" | "enroute" | "arrived" | "done";

export interface DistributionEvent {
  label: string;
  at: string;
}

export interface Distribution {
  id: string;
  vendorId: string;
  destination: string;
  destinationType: "Sekolah" | "Posyandu" | "Pesantren" | "PAUD";
  address: string;
  lat: number;
  lng: number;
  portions: number;
  menu: string;
  courier: string;
  scheduledAt: string;
  status: DistributionStatus;
  checkInAt?: string;
  checkOutAt?: string;
  receivedConfirmedAt?: string; // konfirmasi "kiriman sampai" oleh penerima
  photos: string[]; // labels / data urls
  events: DistributionEvent[];
}

export interface KitchenDetection {
  id: string;
  x: number; // 0..1 (kiri)
  y: number; // 0..1 (atas)
  w: number; // 0..1
  h: number; // 0..1
  mask: boolean; // pakai masker
  gloves: boolean; // pakai sarung tangan
  hairnet: boolean; // pakai penutup kepala
  conf: number; // 0..1
}

export interface KitchenAnalysis {
  at: string;
  staffCount: number;
  cleanliness: number; // 0..100
  tidiness: number; // 0..100 (kerapihan)
  apd: { mask: number; gloves: number; hairnet: number }; // % kepatuhan
  overallScore: number; // 0..100
  status: "baik" | "perhatian" | "buruk";
  violations: string[];
  detections: KitchenDetection[];
}

export type Sentiment = "positive" | "neutral" | "negative";

export interface Feedback {
  id: string;
  distributionId: string;
  vendorId: string;
  rating: number; // 1..5
  comment: string;
  photo?: string;
  sentiment: Sentiment;
  isComplaint: boolean;
  createdAt: string;
}
