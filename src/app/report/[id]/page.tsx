import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { readStoredReport } from "@/lib/interview";
import { prisma } from "@/lib/prisma";
import { LEVELS, interviewLabel, isLevelId } from "@/lib/roles";

export const dynamic = "force-dynamic";

function scoreColor(score: number, max: number) {
  const ratio = score / max;
  if (ratio >= 0.7) return "text-emerald-600";
  if (ratio >= 0.4) return "text-amber-600";
  return "text-red-600";
}

function barColor(score: number) {
  if (score >= 7) return "bg-emerald-500";
  if (score >= 4) return "bg-amber-500";
  return "bg-red-500";
}

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser(`/report/${id}`);
  const interview = await prisma.interview.findUnique({
    where: { id },
    include: { report: true, messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!interview || interview.userId !== user.id) notFound();
  if (!interview.report) redirect(`/interview/${id}`);

  const report = readStoredReport(interview.report);
  const roleLabel = interviewLabel(interview);
  const levelLabel = isLevelId(interview.level) ? LEVELS[interview.level] : interview.level;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Rapport d&apos;entretien</h1>
          <p className="text-sm text-slate-500">
            {roleLabel} · {levelLabel} ·{" "}
            {interview.createdAt.toLocaleDateString("fr-FR", { dateStyle: "long" })}
          </p>
        </div>
        <div className="text-right">
          <p className={`text-5xl font-bold ${scoreColor(report.overallScore, 100)}`}>
            {report.overallScore}
            <span className="text-xl text-slate-400">/100</span>
          </p>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-2 font-semibold">Synthèse</h2>
        <p className="text-slate-700">{report.summary}</p>
      </section>

      {report.skills.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold">Compétences évaluées</h2>
          <ul className="space-y-4">
            {report.skills.map((skill, i) => (
              <li key={`${skill.name}-${i}`} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{skill.name}</span>
                  <span className={scoreColor(skill.score, 10)}>{skill.score}/10</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full ${barColor(skill.score)}`}
                    style={{ width: `${skill.score * 10}%` }}
                  />
                </div>
                {skill.comment && <p className="text-sm text-slate-500">{skill.comment}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <ListCard title="Points forts" items={report.strengths} accent="border-emerald-400" />
        <ListCard title="À améliorer" items={report.weaknesses} accent="border-amber-400" />
      </div>
      <ListCard title="Conseils pour progresser" items={report.advice} accent="border-brand-500" />

      <details className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <summary className="cursor-pointer font-semibold">Revoir la transcription</summary>
        <div className="mt-4 space-y-3 text-sm">
          {interview.messages.map((m) => (
            <p key={m.id} className="whitespace-pre-wrap">
              <span className="font-semibold">
                {m.author === "interviewer" ? "Recruteur" : "Toi"} :
              </span>{" "}
              {m.content}
            </p>
          ))}
        </div>
      </details>

      <Link
        href="/new"
        className="inline-block rounded-lg bg-brand-600 px-5 py-2 font-semibold text-white hover:bg-brand-700"
      >
        Nouvel entretien
      </Link>
    </div>
  );
}

function ListCard({ title, items, accent }: { title: string; items: string[]; accent: string }) {
  if (items.length === 0) return null;
  return (
    <section className={`rounded-xl border-l-4 bg-white p-5 shadow-sm ${accent}`}>
      <h2 className="mb-2 font-semibold">{title}</h2>
      <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
