import { cn } from "@/lib/utils";

/** Logo MB Guardian (gambar). object-cover agar pas sebagai badge persegi. */
export function Logo({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo/mbg-logo.jpeg"
      alt="MB Guardian"
      className={cn("object-cover", className)}
    />
  );
}
