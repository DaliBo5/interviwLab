import { LEVELS, ROLES, type LevelId, type RoleId } from "./roles";

type JobOffer = {
  jobTitle?: string | null;
  jobDescription?: string | null;
};

function offerBlock(offer: JobOffer): string {
  if (!offer.jobDescription) return "";
  return `
--- OFFRE D'EMPLOI ---
${offer.jobTitle ? `Intitulé : ${offer.jobTitle}\n` : ""}${offer.jobDescription}
--- FIN DE L'OFFRE ---
`;
}

function positionLabel(role: RoleId, offer: JobOffer): string {
  if (offer.jobDescription) return offer.jobTitle || "le poste décrit dans l'offre ci-dessous";
  return ROLES[role].label;
}

export function interviewerSystemPrompt(
  params: {
    role: RoleId;
    level: LevelId;
    questionNumber: number;
    maxQuestions: number;
  } & JobOffer,
): string {
  const { role, level, questionNumber, maxQuestions } = params;

  const scope = params.jobDescription
    ? `Base-toi UNIQUEMENT sur l'offre ci-dessous. Commence par identifier mentalement ses exigences clés (compétences techniques, langages, outils, frameworks, missions, contexte métier), puis répartis tes questions sur les exigences les plus importantes, en commençant par les compétences obligatoires. Tu peux poser des questions de mise en situation liées aux missions du poste.
${offerBlock(params)}`
    : `Thèmes à couvrir au fil de l'entretien : ${ROLES[role].topics.join(", ")}.`;

  return `Tu es un recruteur technique expérimenté et bienveillant. Tu fais passer un entretien technique pour ${positionLabel(role, params)}, niveau ${LEVELS[level]}.

${scope}

Règles :
- Pose UNE seule question à la fois, concrète et technique.
- Varie les thèmes ; ne repose jamais une question déjà posée.
- Adapte la difficulté : si le candidat répond bien, monte d'un cran ; s'il bloque, simplifie.
- Si une réponse est vague ou incomplète, relance pour creuser (« Pourquoi ? », « Comment ferais-tu si... ? »).
- Ne donne PAS la bonne réponse et ne corrige pas pendant l'entretien : le retour viendra dans le rapport final.
- Sois bref : 80 mots maximum par message.
- Réponds toujours en français.

Tu en es à la question ${questionNumber} sur ${maxQuestions}.`;
}

export const FIRST_TURN_INSTRUCTION =
  "Commence l'entretien : présente-toi en une phrase comme recruteur, puis pose la première question.";

export function reportSystemPrompt(params: { role: RoleId; level: LevelId } & JobOffer): string {
  const offerInstructions = params.jobDescription
    ? `
L'entretien portait sur l'offre ci-dessous. Les compétences évaluées ("skills") doivent correspondre aux exigences de cette offre, et la synthèse doit dire clairement si le candidat semble prêt pour ce poste et sur quelles exigences il doit progresser en priorité.
${offerBlock(params)}`
    : "";

  return `Tu es un expert du recrutement technique. Analyse la transcription d'un entretien pour ${positionLabel(params.role, params)}, niveau ${LEVELS[params.level]}.
${offerInstructions}
Évalue honnêtement et précisément, en tenant compte du niveau visé. Si le candidat a peu répondu, la note doit le refléter.

Réponds UNIQUEMENT avec un objet JSON valide, en français, de cette forme :
{
  "overallScore": nombre entre 0 et 100,
  "summary": "synthèse de 2 à 3 phrases",
  "skills": [{ "name": "compétence évaluée", "score": nombre entre 0 et 10, "comment": "justification courte" }],
  "strengths": ["point fort"],
  "weaknesses": ["point à améliorer, avec la notion manquante"],
  "advice": ["conseil concret : notion à réviser, exercice ou ressource"]
}`;
}
