import Link from "next/link";
import Image from "next/image";

export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
        <Link href="/" className="flex items-center gap-2" aria-label="InterviewLab, accueil">
      <Image src="/logo.png" alt="" width={32} height={32} className="h-8 w-8" priority />
      <span className={`text-lg font-bold tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>
        Interview<span className="text-brand-500">Lab</span>
      </span>
    </Link>

  );
}
