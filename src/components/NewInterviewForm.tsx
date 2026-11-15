"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LEVELS, ROLE_GROUPS, ROLES, type LevelId, type RoleId } from "@/lib/roles";

type Mode = "preset" | "offre";

const MIN_OFFER_LENGTH = 80;

export default function NewInterviewForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("preset");
  const [role, setRole] = useState<RoleId>("data-scientist");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [level, setLevel] = useState<LevelId>("stage");
  const [maxQuestions, setMaxQuestions] = useState(6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const offerTooShort = mode === "offre" && jobDescription.trim().length < MIN_OFFER_LENGTH;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (offerTooShort) {
      setError("Colle la description complète du poste (missions, compétences demandées…).");
      return;
    }
    setLoading(true);
    setError(null);

    const payload =
      mode === "offre"
        ? { mode, jobTitle, jobDescription, level, maxQuestions }
        : { mode, role, level, maxQuestions };

    try {
      const res = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok || !data.id) throw new Error(data.error ?? "Impossible de démarrer l'entretien");
      router.push(`/interview/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      {/* Choix du mode */}
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 text-sm font-medium">
        {(
          [
            ["preset", "Poste type"],
            ["offre", "À partir d'une offre"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setMode(value);
              setError(null);
            }}
            className={`rounded-md px-3 py-2 transition ${
              mode === value ? "bg-white text-brand-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "preset" ? (
        <fieldset className="space-y-4">
          <legend className="font-semibold">Poste visé</legend>
          {ROLE_GROUPS.map((group) => (
            <div key={group.title} className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {group.title}
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {group.roles.map((id) => (
                  <label
                    key={id}
                    className={`cursor-pointer rounded-lg border px-4 py-3 text-sm transition ${
                      role === id
                        ? "border-brand-500 bg-brand-50 font-medium"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={id}
                      checked={role === id}
                      onChange={() => setRole(id)}
                      className="sr-only"
                    />
                    {ROLES[id].label}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </fieldset>
      ) : (
        <div className="space-y-4">
          <label className="block space-y-1 text-sm">
            <span className="font-semibold">Intitulé du poste (optionnel)</span>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              maxLength={120}
              placeholder="ex. Stage Ingénieur Data & IA – PwC"
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-semibold">Description du poste</span>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={10}
              maxLength={15000}
              placeholder="Colle ici l'offre complète : missions, profil recherché, compétences techniques, outils…"
              className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none"
            />
            <span className="block text-xs text-slate-500">
              Le recruteur IA repère les exigences de l&apos;offre et te questionne dessus, en
              commençant par les compétences obligatoires. {jobDescription.trim().length} caractères.
            </span>
          </label>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-semibold">Niveau</span>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as LevelId)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
          >
            {(Object.keys(LEVELS) as LevelId[]).map((id) => (
              <option key={id} value={id}>
                {LEVELS[id]}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-semibold">Nombre de questions : {maxQuestions}</span>
          <input
            type="range"
            min={3}
            max={12}
            value={maxQuestions}
            onChange={(e) => setMaxQuestions(Number(e.target.value))}
            className="w-full"
          />
        </label>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-brand-600 px-4 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {loading
          ? mode === "offre"
            ? "Analyse de l'offre et préparation de la première question…"
            : "Le recruteur prépare sa première question…"
          : "Démarrer l'entretien"}
      </button>
    </form>
  );
}
