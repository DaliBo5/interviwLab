import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { errorMessage, finishInterview } from "@/lib/interview";
import { prisma } from "@/lib/prisma";

// POST /api/interviews/:id/finish : termine l'entretien maintenant et génère le rapport
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Session expirée : reconnecte-toi." }, { status: 401 });
  }

  const interview = await prisma.interview.findUnique({
    where: { id },
    include: { messages: { where: { author: "candidate" }, select: { id: true } } },
  });
  if (!interview || interview.userId !== user.id) {
    return NextResponse.json({ error: "Entretien introuvable" }, { status: 404 });
  }
  if (interview.messages.length === 0) {
    return NextResponse.json(
      { error: "Réponds au moins à une question avant de terminer" },
      { status: 400 },
    );
  }

  try {
    await finishInterview(id);
    return NextResponse.json({ done: true });
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 502 });
  }
}
