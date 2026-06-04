"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Heart, CheckCircle2, MapPin } from "lucide-react";
import { Logo } from "@/components/Logo";
import { StarInput } from "@/components/StarRating";
import { PhotoUpload } from "@/components/PhotoUpload";
import { SentimentBadge, SimTag } from "@/components/badges";
import { QR } from "@/components/QRCode";
import { useStore, useHydrated } from "@/lib/store";
import { analyzeSentiment } from "@/lib/sim/sentiment";
import { formatNumber } from "@/lib/utils";

export default function FeedbackPage({
  params,
}: {
  params: Promise<{ distributionId: string }>;
}) {
  const { distributionId } = use(params);
  const hydrated = useHydrated();
  const dist = useStore((s) =>
    s.distributions.find((d) => d.id === distributionId)
  );
  const vendor = useStore((s) => s.vendors.find((v) => v.id === dist?.vendorId));
  const addFeedback = useStore((s) => s.addFeedback);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState<string | undefined>();
  const [submitted, setSubmitted] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") setUrl(window.location.href);
  }, []);

  const live = comment.trim() ? analyzeSentiment(comment).sentiment : null;

  if (!hydrated)
    return (
      <div className="grid min-h-screen place-items-center text-slate-400">
        Memuat…
      </div>
    );

  if (!dist)
    return (
      <div className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <p className="text-slate-500">Distribusi tidak ditemukan.</p>
          <Link href="/" className="btn-outline mt-4">
            Ke Beranda
          </Link>
        </div>
      </div>
    );

  function submit() {
    if (!dist || !rating) return;
    addFeedback({
      distributionId: dist.id,
      vendorId: dist.vendorId,
      rating,
      comment: comment.trim(),
      photo,
    });
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-canvas">
      <div className="mx-auto max-w-md px-4 py-8">
        {/* Brand header */}
        <div className="mb-5 flex items-center justify-center gap-2 text-brand-700">
          <Logo className="h-9 w-9 rounded-xl ring-1 ring-line" />
          <span className="font-bold">MB Guardian</span>
        </div>

        {submitted ? (
          <div className="card p-8 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-100 text-brand-600">
              <CheckCircle2 size={32} />
            </div>
            <h1 className="mt-4 text-xl font-bold text-ink">Terima Kasih! 🙏</h1>
            <p className="mt-2 text-sm text-slate-500">
              Penilaian Anda untuk{" "}
              <strong>{dist.destination}</strong> telah terkirim dan membantu
              kami meningkatkan kualitas program.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm">
              <span className="text-slate-400">Sentimen terdeteksi:</span>
              <SentimentBadge sentiment={analyzeSentiment(comment).sentiment} />
              <SimTag />
            </div>
          </div>
        ) : (
          <>
            {/* Context */}
            <div className="card mb-4 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                Form Kepuasan Penerima
              </p>
              <h1 className="mt-1 text-lg font-bold text-ink">
                {dist.destination}
              </h1>
              <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-500">
                <MapPin size={14} /> {dist.address}
              </p>
              <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm">
                <p className="text-slate-600">
                  <strong>Menu:</strong> {dist.menu}
                </p>
                <p className="text-slate-600">
                  <strong>Vendor:</strong> {vendor?.name ?? "—"} •{" "}
                  {formatNumber(dist.portions)} porsi
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="card space-y-5 p-5">
              <div className="text-center">
                <label className="label">Seberapa puas Anda?</label>
                <div className="mt-1 flex justify-center">
                  <StarInput value={rating} onChange={setRating} />
                </div>
                {rating > 0 && (
                  <p className="mt-1 text-sm font-medium text-brand-600">
                    {["", "Sangat Kurang", "Kurang", "Cukup", "Baik", "Sangat Baik"][rating]}
                  </p>
                )}
              </div>

              <div>
                <label className="label">Komentar</label>
                <textarea
                  className="input min-h-24"
                  placeholder="Bagaimana rasa, porsi, dan ketepatan waktunya?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                {live && (
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-400">
                    Analisis langsung: <SentimentBadge sentiment={live} />
                    <SimTag />
                  </div>
                )}
              </div>

              <div>
                <label className="label">Foto (opsional)</label>
                <PhotoUpload
                  label="Tambahkan foto makanan"
                  onPicked={(name) => setPhoto(name)}
                />
              </div>

              <button
                onClick={submit}
                disabled={!rating}
                className="btn-primary w-full"
              >
                <Heart size={16} /> Kirim Penilaian
              </button>
            </div>

            {/* QR share */}
            {url && (
              <div className="card mt-4 flex flex-col items-center p-5 text-center">
                <p className="mb-3 text-xs text-slate-400">
                  QR Code distribusi ini — tempel di titik distribusi agar
                  penerima dapat memindai & menilai.
                </p>
                <QR value={url} size={150} />
                <p className="mt-2 font-mono text-[11px] text-slate-400">
                  {dist.id}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
