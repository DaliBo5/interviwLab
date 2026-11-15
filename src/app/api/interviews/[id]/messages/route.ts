import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { askNextQuestion, errorMessage, finishInterview } from "@/lib/interview";
import { prisma } from "@/lib/prisma";

// POST /api/interviews/:id/messages : enregistre la réponse du candidat
// puis renvoie la question suivante, ou clôture l'entretien.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as { content?: unknown };
  const content = typeof body.content === "string" ? body.content.trim() : "";

  if (!content) {
    return NextResponse.json({ error: "Réponse vide" }, { status: 400 });
  }
  if (content.length > 5000) {
    return NextResponse.json({ error: "Réponse trop longue (5000 caractères max)" }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Session expirée : reconnecte-toi." }, { status: 401 });
  }

  const interview = await prisma.interview.findUnique({ where: { id } });
  if (!interview || interview.userId !== user.id) {
    return NextResponse.json({ error: "Entretien introuvable" }, { status: 404 });
  }
  if (interview.status !== "IN_PROGRESS") {
    return NextResponse.json({ error: "Cet entretien est terminé" }, { status: 409 });
  }

  const candidateMessage = await prisma.message.create({
    data: { interviewId: id, author: "candidate", content },
  });

  try {
    if (interview.questionCount >= interview.maxQuestions) {
      await finishInterview(id);
      return NextResponse.json({ done: true, candidateMessage });
    }
    const next = await askNextQuestion(id);
    return NextResponse.json({ done: false, candidateMessage, message: next });
  } catch (error) {
    // On retire la réponse pour que le candidat puisse la renvoyer
    await prisma.message.delete({ where: { id: candidateMessage.id } });
    return NextResponse.json({ error: errorMessage(error) }, { status: 502 });
  }
}
