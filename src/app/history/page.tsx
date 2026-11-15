import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LEVELS, interviewLabel, isLevelId } from "@/lib/roles";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const user = await requireUser("/history");
  const interviews = await prisma.interview.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { report: { select: { overallScore: true } } },
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold">Historique</h1>

      {interviews.length === 0 ? (
        <p className="text-slate-600">
          Aucun entretien pour l&apos;instant.{" "}
          <Link href="/new" className="text-brand-600 underline">
            Lance ton premier entretien
          </Link>
          .
        </p>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm">
          {interviews.map((it) => {
            const levelLabel = isLevelId(it.level) ? LEVELS[it.level] : it.level;
            const href = it.report ? `/report/${it.id}` : `/interview/${it.id}`;
            return (
              <li key={it.id}>
                <Link
                  href={href}
                  className="flex items-center justify-between px-5 py-4 hover:bg-slate-50"
                >
                  <div>
                    <p className="font-medium">{interviewLabel(it)}</p>
                    <p className="text-sm text-slate-500">
                      {levelLabel} ·{" "}
                      {it.createdAt.toLocaleDateString("fr-FR", { dateStyle: "medium" })}
                    </p>
                  </div>
                  {it.report ? (
                    <span className="text-lg font-bold">{it.report.overallScore}/100</span>
                  ) : (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-800">
                      En cours
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
