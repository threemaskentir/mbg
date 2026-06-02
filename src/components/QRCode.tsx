"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function QR({ value, size = 180 }: { value: string; size?: number }) {
  const [url, setUrl] = useState<string>("");
  useEffect(() => {
    QRCode.toDataURL(value, {
      width: size,
      margin: 1,
      color: { dark: "#064e3b", light: "#ffffff" },
    }).then(setUrl);
  }, [value, size]);

  if (!url)
    return (
      <div
        className="animate-pulse rounded-xl bg-slate-100"
        style={{ width: size, height: size }}
      />
    );
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt="QR Code"
      width={size}
      height={size}
      className="rounded-xl border border-line"
    />
  );
}
