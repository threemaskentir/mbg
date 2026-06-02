"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, FileText, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function PhotoUpload({
  label = "Upload foto",
  hint,
  onPicked,
}: {
  label?: string;
  hint?: string;
  onPicked?: (name: string, dataUrl?: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  function handle(file?: File) {
    if (!file) return;
    setName(file.name);
    const url = URL.createObjectURL(file);
    setPreview(url);
    onPicked?.(file.name, url);
  }

  return (
    <div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handle(e.target.files?.[0])}
      />
      {preview ? (
        <div className="relative overflow-hidden rounded-xl border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt={name ?? ""} className="h-44 w-full object-cover" />
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              setName(null);
              if (ref.current) ref.current.value = "";
            }}
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-slate-50 px-4 py-8 text-slate-500 transition hover:border-brand-400 hover:bg-brand-50/50"
        >
          <ImagePlus size={26} className="text-brand-500" />
          <span className="text-sm font-medium">{label}</span>
          {hint && <span className="text-xs text-slate-400">{hint}</span>}
        </button>
      )}
    </div>
  );
}

export function DocUpload({
  label,
  uploaded,
  onUpload,
}: {
  label: string;
  uploaded: boolean;
  onUpload: (fileName: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl border px-4 py-3",
        uploaded ? "border-brand-200 bg-brand-50/50" : "border-line bg-white"
      )}
    >
      <div className="flex items-center gap-3">
        <FileText
          size={20}
          className={uploaded ? "text-brand-600" : "text-slate-400"}
        />
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      <input
        ref={ref}
        type="file"
        className="hidden"
        onChange={(e) =>
          e.target.files?.[0] && onUpload(e.target.files[0].name)
        }
      />
      {uploaded ? (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600">
          <CheckCircle2 size={15} /> Terupload
        </span>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="text-xs font-semibold text-brand-600 hover:underline"
        >
          Pilih file
        </button>
      )}
    </div>
  );
}
