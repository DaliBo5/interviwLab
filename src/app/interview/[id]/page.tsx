import { notFound, redirect } from "next/navigation";
import InterviewChat from "@/components/InterviewChat";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LEVELS, interviewLabel, isLevelId } from "@/lib/roles";

export const dynamic = "force-dynamic";

export default async function InterviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser(`/interview/${id}`);
  const interview = await prisma.interview.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "asc" } }, report: { select: { id: true } } },
  });

  if (!interview || interview.userId !== user.id) notFound();
  if (interview.report) redirect(`/report/${id}`);

  const roleLabel = interviewLabel(interview);
  const levelLabel = isLevelId(interview.level) ? LEVELS[interview.level] : interview.level;

  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">Entretien {roleLabel}</h1>
        <p className="text-sm text-slate-500">
          {levelLabel} · {interview.maxQuestions} questions
          {interview.jobDescription ? " · basé sur ton offre" : ""}
        </p>
      </div>
      {interview.jobDescription && (
        <details className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
          <summary className="cursor-pointer font-medium text-slate-700">Voir l&apos;offre</summary>
          <p className="mt-3 whitespace-pre-wrap text-slate-600">{interview.jobDescription}</p>
        </details>
      )}
      <InterviewChat
        interviewId={interview.id}
        maxQuestions={interview.maxQuestions}
        initialQuestionCount={interview.questionCount}
        initialMessages={interview.messages.map((m) => ({
          id: m.id,
          author: m.author === "interviewer" ? ("interviewer" as const) : ("candidate" as const),
          content: m.content,
        }))}
      />
    </div>
  );
}
