"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Mode = "signin" | "signup";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

export default function AuthForm({ mode, next }: { mode: Mode; next: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignup = mode === "signup";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (isSignup && password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(isSignup ? "/api/auth/signup" : "/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isSignup ? { name, email, password } : { email, password, remember }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Une erreur est survenue");
      router.push(next);
      router.refresh(); // met à jour la barre de navigation (utilisateur connecté)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setLoading(false);
    }
  }

  const otherHref = `${isSignup ? "/signin" : "/signup"}${
    next !== "/new" ? `?next=${encodeURIComponent(next)}` : ""
  }`;

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {isSignup ? "Crée ton compte" : "Bon retour parmi nous"}
        </h1>
        <p className="mt-2 text-slate-600">
          {isSignup
            ? "Quelques secondes suffisent pour passer ton premier entretien."
            : "Entre ton e-mail et ton mot de passe pour te connecter."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {isSignup && (
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Nom complet</span>
            <input
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ton nom et prénom"
              className={inputClass}
            />
          </label>
        )}

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Adresse e-mail</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="toi@exemple.com"
            className={inputClass}
          />
        </label>

        <label className="block space-y-1.5">
          <span className="flex items-center justify-between text-sm font-medium text-slate-700">
            Mot de passe
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              {showPassword ? "Masquer" : "Afficher"}
            </button>
          </span>
          <input
            type={showPassword ? "text" : "password"}
            autoComplete={isSignup ? "new-password" : "current-password"}
            required
            minLength={isSignup ? 8 : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isSignup ? "8 caractères minimum" : "Ton mot de passe"}
            className={inputClass}
          />
        </label>

        {isSignup && (
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Confirme le mot de passe</span>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Retape ton mot de passe"
              className={inputClass}
            />
          </label>
        )}

        {!isSignup && (
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 accent-brand-600"
            />
            Rester connecté 30 jours
          </label>
        )}

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-brand-600 to-violet-600 px-4 py-3.5 font-semibold text-white shadow-md transition hover:opacity-95 disabled:opacity-60"
        >
          {loading
            ? isSignup
              ? "Création du compte…"
              : "Connexion…"
            : isSignup
              ? "Créer mon compte"
              : "Se connecter"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600">
        {isSignup ? "Tu as déjà un compte ? " : "Pas encore de compte ? "}
        <Link href={otherHref} className="font-semibold text-brand-600 hover:text-brand-700">
          {isSignup ? "Se connecter" : "Créer un compte"}
        </Link>
      </p>
    </div>
  );
}
