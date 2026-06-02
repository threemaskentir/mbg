import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreHydrator } from "@/components/StoreHydrator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mbg-monitor.local"),
  title: "MBG Monitor — Makan Bergizi Gratis",
  description:
    "Mockup interaktif sistem monitoring program Makan Bergizi Gratis: registrasi vendor, distribusi, feedback, command center, dan analitik sentimen.",
  manifest: "/manifest.json",
  applicationName: "MBG Monitor",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MBG Monitor",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full" suppressHydrationWarning>
        <StoreHydrator />
        {children}
      </body>
    </html>
  );
}
