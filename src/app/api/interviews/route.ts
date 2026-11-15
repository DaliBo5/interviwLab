import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { askNextQuestion, errorMessage } from "@/lib/interview";
import { prisma } from "@/lib/prisma";
import { isLevelId, isRoleId } from "@/lib/roles";

const MIN_OFFER_LENGTH = 80;
const MAX_OFFER_LENGTH = 15000;

// POST /api/interviews : crée un entretien et génère la première question.
// Deux modes :
//  - poste type : { role, level, maxQuestions }
//  - offre      : { mode: "offre", jobTitle?, jobDescription, level, maxQuestions }
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Connecte-toi pour lancer un entretien." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    mode?: unknown;
    role?: unknown;
    level?: unknown;
    maxQuestions?: unknown;
    jobTitle?: unknown;
    jobDescription?: unknown;
  };

  if (!isLevelId(body.level)) {
    return NextResponse.json({ error: "Niveau invalide" }, { status: 400 });
  }
  const maxQuestions = Math.min(12, Math.max(3, Number(body.maxQuestions) || 6));

  let data: {
    role: string;
    level: string;
    maxQuestions: number;
    jobTitle?: string;
    jobDescription?: string;
  };

  if (body.mode === "offre") {
    const jobDescription = typeof body.jobDescription === "string" ? body.jobDescription.trim() : "";
    const jobTitle = typeof body.jobTitle === "string" ? body.jobTitle.trim().slice(0, 120) : "";

    if (jobDescription.length < MIN_OFFER_LENGTH) {
      return NextResponse.json(
        { error: `Colle la description complète du poste (au moins ${MIN_OFFER_LENGTH} caractères).` },
        { status: 400 },
      );
    }
    if (jobDescription.length > MAX_OFFER_LENGTH) {
      return NextResponse.json(
        { error: `L'offre est trop longue (${MAX_OFFER_LENGTH} caractères maximum).` },
        { status: 400 },
      );
    }
    data = {
      role: "offre",
      level: body.level,
      maxQuestions,
      jobDescription,
      ...(jobTitle ? { jobTitle } : {}),
    };
  } else {
    if (!isRoleId(body.role) || body.role === "offre") {
      return NextResponse.json({ error: "Poste invalide" }, { status: 400 });
    }
    data = { role: body.role, level: body.level, maxQuestions };
  }

  const interview = await prisma.interview.create({ data: { ...data, userId: user.id } });

  try {
    await askNextQuestion(interview.id);
  } catch (error) {
    // On supprime l'entretien vide si l'IA n'a pas répondu
    await prisma.interview.delete({ where: { id: interview.id } });
    return NextResponse.json({ error: errorMessage(error) }, { status: 502 });
  }

  return NextResponse.json({ id: interview.id }, { status: 201 });
}
