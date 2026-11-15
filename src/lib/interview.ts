import type { Message } from "@prisma/client";
import { chat, type ChatMessage } from "./llm";
import { prisma } from "./prisma";
import { FIRST_TURN_INSTRUCTION, interviewerSystemPrompt, reportSystemPrompt } from "./prompts";
import { isLevelId, isRoleId } from "./roles";

export type SkillScore = { name: string; score: number; comment: string };

export type ParsedReport = {
  overallScore: number;
  summary: string;
  skills: SkillScore[];
  strengths: string[];
  weaknesses: string[];
  advice: string[];
};

async function loadInterview(interviewId: string) {
  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!interview) throw new Error("Entretien introuvable");
  if (!isRoleId(interview.role) || !isLevelId(interview.level)) {
    throw new Error("Poste ou niveau invalide");
  }
  return { ...interview, role: interview.role, level: interview.level };
}

function toChatHistory(messages: Message[]): ChatMessage[] {
  return messages.map((m) => ({
    role: m.author === "interviewer" ? "assistant" : "user",
    content: m.content,
  }));
}

/** Demande au recruteur IA la question suivante et l'enregistre. */
export async function askNextQuestion(interviewId: string): Promise<Message> {
  const interview = await loadInterview(interviewId);
  const questionNumber = interview.questionCount + 1;

  const history = toChatHistory(interview.messages);
  const messages: ChatMessage[] = [
    {
      role: "system",
      content: interviewerSystemPrompt({
        role: interview.role,
        level: interview.level,
        questionNumber,
        maxQuestions: interview.maxQuestions,
        jobTitle: interview.jobTitle,
        jobDescription: interview.jobDescription,
      }),
    },
    ...(history.length === 0 ? [{ role: "user" as const, content: FIRST_TURN_INSTRUCTION }] : history),
  ];

  const content = await chat(messages);

  const [message] = await prisma.$transaction([
    prisma.message.create({ data: { interviewId, author: "interviewer", content } }),
    prisma.interview.update({ where: { id: interviewId }, data: { questionCount: questionNumber } }),
  ]);
  return message;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

function clamp(n: unknown, min: number, max: number): number {
  const num = typeof n === "number" ? n : Number(n);
  if (Number.isNaN(num)) return min;
  return Math.max(min, Math.min(max, Math.round(num)));
}

function parseReport(raw: string): ParsedReport {
  // Certains modèles entourent le JSON de ```json ... ```
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  const data = JSON.parse(cleaned) as Record<string, unknown>;

  const skills = Array.isArray(data.skills)
    ? data.skills
        .filter((s): s is Record<string, unknown> => typeof s === "object" && s !== null)
        .map((s) => ({
          name: String(s.name ?? "Compétence"),
          score: clamp(s.score, 0, 10),
          comment: String(s.comment ?? ""),
        }))
    : [];

  return {
    overallScore: clamp(data.overallScore, 0, 100),
    summary: String(data.summary ?? ""),
    skills,
    strengths: asStringArray(data.strengths),
    weaknesses: asStringArray(data.weaknesses),
    advice: asStringArray(data.advice),
  };
}

/** Clôture l'entretien et génère le rapport d'évaluation. */
export async function finishInterview(interviewId: string) {
  const interview = await loadInterview(interviewId);

  const existing = await prisma.report.findUnique({ where: { interviewId } });
  if (existing) return existing;

  const transcript = interview.messages
    .map((m) => `${m.author === "interviewer" ? "RECRUTEUR" : "CANDIDAT"} : ${m.content}`)
    .join("\n\n");

  const raw = await chat(
    [
      {
        role: "system",
        content: reportSystemPrompt({
          role: interview.role,
          level: interview.level,
          jobTitle: interview.jobTitle,
          jobDescription: interview.jobDescription,
        }),
      },
      { role: "user", content: `Transcription de l'entretien :\n\n${transcript}` },
    ],
    { json: true, temperature: 0.2 },
  );

  const report = parseReport(raw);

  const [saved] = await prisma.$transaction([
    prisma.report.create({
      data: {
        interviewId,
        overallScore: report.overallScore,
        summary: report.summary,
        skills: JSON.stringify(report.skills),
        strengths: JSON.stringify(report.strengths),
        weaknesses: JSON.stringify(report.weaknesses),
        advice: JSON.stringify(report.advice),
      },
    }),
    prisma.interview.update({ where: { id: interviewId }, data: { status: "COMPLETED" } }),
  ]);
  return saved;
}

/** Convertit un rapport stocké (champs JSON en texte) en objet exploitable. */
export function readStoredReport(report: {
  overallScore: number;
  summary: string;
  skills: string;
  strengths: string;
  weaknesses: string;
  advice: string;
}): ParsedReport {
  const safe = <T,>(text: string, fallback: T): T => {
    try {
      return JSON.parse(text) as T;
    } catch {
      return fallback;
    }
  };
  return {
    overallScore: report.overallScore,
    summary: report.summary,
    skills: safe<SkillScore[]>(report.skills, []),
    strengths: safe<string[]>(report.strengths, []),
    weaknesses: safe<string[]>(report.weaknesses, []),
    advice: safe<string[]>(report.advice, []),
  };
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Erreur inattendue";
}
