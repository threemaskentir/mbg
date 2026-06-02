export type Role =
  | "regulator"
  | "vendor"
  | "kurir"
  | "penerima"
  | "penerima_manfaat";

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
