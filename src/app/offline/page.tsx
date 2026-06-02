import Link from "next/link";
import { WifiOff } from "lucide-react";

export const metadata = {
  title: "Offline — MBG Monitor",
};

export default function OfflinePage() {
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-b from-brand-50 to-canvas px-6">
      <div className="card max-w-sm p-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-slate-500">
          <WifiOff size={30} />
        </div>
        <h1 className="mt-4 text-xl font-bold text-ink">Anda sedang offline</h1>
        <p className="mt-2 text-sm text-slate-500">
          Halaman ini belum tersimpan di cache. Periksa koneksi internet Anda,
          lalu coba lagi. Halaman yang pernah dibuka tetap dapat diakses offline.
        </p>
        <Link href="/" className="btn-primary mt-6 w-full">
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
