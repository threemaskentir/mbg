import Link from "next/link";
import { Home } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-b from-brand-50 to-canvas px-6">
      <div className="card max-w-sm p-8 text-center">
        <Logo className="mx-auto h-16 w-16 rounded-2xl ring-1 ring-line" />
        <p className="mt-5 text-5xl font-bold tracking-tight text-brand-700">
          404
        </p>
        <h1 className="mt-2 text-lg font-bold text-ink">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Maaf, halaman yang Anda cari tidak tersedia.
        </p>
        <Link href="/" className="btn-primary mt-6 w-full">
          <Home size={16} /> Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
