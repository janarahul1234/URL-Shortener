import Link from "next/link";
import { cmdClass } from "@/components/terminal/cx";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center py-24">
      <div className="w-full max-w-lg rounded-md border border-white/10 bg-window px-6 py-8 shadow-[0_10px_28px_rgba(0,0,0,0.35)]">
        <p className="text-lg text-bad">FATAL ERROR 404: ROUTE NOT FOUND</p>
        <p className="mt-2 text-sm text-ink-muted">
          # THE DOS YOU ARE LOOKING FOR IS IN ANOTHER CASTLE.
        </p>
        <Link href="/" className={`${cmdClass("primary")} mt-4`}>
          RETURN TO BOOT
        </Link>
      </div>
    </main>
  );
}
