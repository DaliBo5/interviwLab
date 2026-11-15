// Mise en page des pages de connexion / inscription :
// formulaire à gauche, panneau illustré à droite (masqué sur mobile).

const POINTS = [
  "Questions adaptées à ton poste et à ton niveau",
  "Mode « offre d'emploi » pour un entretien sur mesure",
  "Rapport détaillé avec tes points forts et axes de progrès",
  "Historique privé de tous tes entretiens",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center bg-white px-4 py-16 sm:px-8">{children}</div>

      <div className="relative hidden overflow-hidden bg-slate-950 lg:flex lg:items-center lg:justify-center">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-brand-600/40 blur-3xl" />
          <div className="absolute -right-10 bottom-10 h-80 w-80 rounded-full bg-violet-600/30 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>

        <div className="relative max-w-md px-10 text-white">
          <h2 className="text-3xl font-bold leading-tight">
            Entraîne-toi comme si c&apos;était{" "}
            <span className="bg-gradient-to-r from-brand-300 to-fuchsia-300 bg-clip-text text-transparent">
              le vrai entretien
            </span>
          </h2>
          <ul className="mt-8 space-y-4">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-slate-300">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500">
                  <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                    <path
                      d="m5 12 4 4 10-10"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <p className="text-xs uppercase tracking-wide text-slate-400">Exemple de question</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-200">
              « Comment déploierais-tu ce modèle sous forme d&apos;API REST, et comment le rendrais-tu
              scalable ? »
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
