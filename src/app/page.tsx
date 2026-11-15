import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { ROLE_GROUPS, ROLES } from "@/lib/roles";

export const dynamic = "force-dynamic";

/* ------------------------------------------------------------------ */
/* Icônes (SVG inline, sans dépendance)                                */
/* ------------------------------------------------------------------ */

const ICONS = {
  target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  chat: "M8 10h8M8 14h5m-6 7 3.5-3H18a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h1v3Z",
  doc: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Zm0 0v5h5M9 13h6M9 17h4",
  chart: "M4 20h16M7 16v-5m5 5V8m5 8v-3",
  history: "M3 12a9 9 0 1 0 3-6.7L3 8m0-5v5h5m4-1v5l3 2",
  bolt: "M13 3 5 14h6l-1 7 8-11h-6l1-7Z",
  check: "m5 12 4 4 10-10",
  arrow: "M5 12h14m-6-6 6 6-6 6",
} as const;

function Icon({ name, className = "h-6 w-6" }: { name: keyof typeof ICONS; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d={ICONS[name]}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Contenu                                                             */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    icon: "target",
    title: "Questions ciblées",
    text: "17 postes types, de Data Scientist à DevOps, avec des thèmes adaptés à chaque métier et au niveau visé.",
  },
  {
    icon: "chat",
    title: "Relances réalistes",
    text: "Comme un vrai recruteur, l'IA creuse quand ta réponse est vague et ajuste la difficulté au fil de l'entretien.",
  },
  {
    icon: "doc",
    title: "Mode offre d'emploi",
    text: "Colle une offre : l'IA repère ses exigences et te questionne en priorité sur les compétences obligatoires.",
  },
  {
    icon: "chart",
    title: "Rapport détaillé",
    text: "Une note sur 100, un score par compétence, tes points forts et ce qu'il faut réviser, avec des conseils concrets.",
  },
  {
    icon: "history",
    title: "Suivi des progrès",
    text: "Retrouve tous tes entretiens et leurs rapports dans ton historique pour mesurer ta progression.",
  },
  {
    icon: "bolt",
    title: "Disponible 24h/24",
    text: "Entraîne-toi quand tu veux, autant de fois que tu veux, la veille d'un entretien ou entre deux cours.",
  },
] as const;

const STEPS = [
  {
    title: "Choisis ton entretien",
    text: "Un poste type et un niveau, ou directement l'offre d'emploi qui t'intéresse.",
  },
  {
    title: "Réponds au recruteur IA",
    text: "Il te pose ses questions une par une, relance et adapte la difficulté selon tes réponses.",
  },
  {
    title: "Analyse ton rapport",
    text: "Découvre ta note, tes compétences évaluées et les notions à retravailler avant le vrai entretien.",
  },
];

const FAQ = [
  {
    q: "Est-ce que c'est gratuit ?",
    a: "Oui. InterviewLab fonctionne avec n'importe quelle API compatible OpenAI, dont Groq qui propose une offre gratuite.",
  },
  {
    q: "Quels postes sont couverts ?",
    a: "17 postes types répartis en trois familles : Data & IA, Développement, et Infra, cloud & qualité. Avec le mode offre, tu peux t'entraîner pour n'importe quel poste.",
  },
  {
    q: "Comment fonctionne le mode « offre d'emploi » ?",
    a: "Tu colles la description du poste. L'IA identifie les compétences demandées et construit ses questions dessus. Le rapport indique ensuite si tu sembles prêt pour ce poste.",
  },
  {
    q: "L'IA me donne-t-elle les réponses pendant l'entretien ?",
    a: "Non, comme en situation réelle. Les corrections et les conseils arrivent dans le rapport final, une fois l'entretien terminé.",
  },
  {
    q: "Mes entretiens sont-ils privés ?",
    a: "Oui. Chaque entretien est lié à ton compte : toi seul peux voir tes réponses et tes rapports.",
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default async function HomePage() {
  const user = await getCurrentUser();
  const primaryHref = user ? "/new" : "/signup";
  const primaryLabel = user ? "Lancer un entretien" : "Commencer gratuitement";

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-600/40 blur-3xl" />
          <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-violet-600/30 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pb-24 pt-20 lg:grid-cols-2 lg:pt-28">
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-brand-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Ton recruteur IA, disponible 24h/24
            </span>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Réussis tes entretiens tech grâce à{" "}
              <span className="bg-gradient-to-r from-brand-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                l&apos;intelligence artificielle
              </span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-slate-300">
              Entraîne-toi sur des entretiens techniques réalistes, adaptés à ton poste ou à une
              offre précise, et reçois un rapport détaillé pour savoir exactement quoi travailler.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={primaryHref}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-violet-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-brand-900/40 transition hover:scale-[1.02] hover:opacity-95"
              >
                {primaryLabel}
                <Icon name="arrow" className="h-5 w-5" />
              </Link>
              <a
                href="#comment-ca-marche"
                className="inline-flex items-center gap-2 rounded-xl px-4 py-3.5 font-semibold text-slate-200 transition hover:text-white"
              >
                Voir comment ça marche
              </a>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
              {["Gratuit", "17 postes types", "Rapport détaillé"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Icon name="check" className="h-4 w-4 text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Aperçu d'un entretien */}
          <div className="relative animate-float">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-500/30 to-violet-500/30 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                </div>
                <span className="text-xs text-slate-400">Entretien ML Engineer · Question 3/6</span>
              </div>
              <div className="space-y-4 p-5 text-sm">
                <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white/10 px-4 py-3 text-slate-100">
                  Ton modèle a 98 % d&apos;accuracy, mais les classes sont très déséquilibrées.
                  Comment l&apos;évaluerais-tu vraiment ?
                </div>
                <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-gradient-to-r from-brand-600 to-violet-600 px-4 py-3 text-white">
                  Je regarderais le F1 macro, le rappel par classe et la matrice de confusion…
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white/10 px-4 py-3 text-slate-100">
                  Bien. Et côté entraînement, que changerais-tu dans la fonction de perte ?
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400 [animation-delay:300ms]" />
                  </span>
                  Tu es en train d&apos;écrire…
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Postes ---------------- */}
      <section id="postes" className="scroll-mt-20 border-b border-slate-200 bg-white py-14">
        <div className="mx-auto max-w-6xl px-4">
          <p className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-slate-500">
            Entraîne-toi pour les postes tech les plus recherchés
          </p>
          <div className="space-y-5">
            {ROLE_GROUPS.map((group) => (
              <div key={group.title} className="flex flex-wrap items-center justify-center gap-2">
                <span className="mr-2 text-xs font-semibold text-brand-600">{group.title}</span>
                {group.roles.map((id) => (
                  <span
                    key={id}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-sm text-slate-700"
                  >
                    {ROLES[id].label}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Fonctionnalités ---------------- */}
      <section id="fonctionnalites" className="scroll-mt-20 bg-slate-50 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-600">
              Fonctionnalités
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-3xl">
              Tout ce qu&apos;il faut pour arriver prêt le jour J
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg"
              >
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 text-white shadow-md transition group-hover:scale-110">
                  <Icon name={feature.icon} />
                </span>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Deux modes ---------------- */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Deux façons de t&apos;entraîner
            </h2>
            <p className="mt-4 text-slate-600">
              Révise un métier en général, ou prépare-toi précisément pour l&apos;offre qui
              t&apos;intéresse.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-brand-50 to-white p-8">
              <span className="mb-4 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
                Poste type
              </span>
              <h3 className="mb-3 text-xl font-semibold">Révise les fondamentaux d&apos;un métier</h3>
              <ul className="space-y-2.5 text-sm text-slate-600">
                {[
                  "17 postes en Data & IA, développement, infra et qualité",
                  "Trois niveaux : stage / alternance, junior, confirmé",
                  "De 3 à 12 questions par entretien",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-violet-50 to-white p-8">
              <span className="mb-4 inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                À partir d&apos;une offre
              </span>
              <h3 className="mb-3 text-xl font-semibold">Prépare un entretien précis</h3>
              <ul className="space-y-2.5 text-sm text-slate-600">
                {[
                  "Colle la description du poste, c'est tout",
                  "Questions construites sur les exigences de l'offre",
                  "Rapport centré sur ton adéquation au poste",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Comment ça marche ---------------- */}
      <section id="comment-ca-marche" className="scroll-mt-20 bg-slate-50 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-600">
              Comment ça marche
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Trois étapes, une vingtaine de minutes
            </h2>
          </div>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <ol className="space-y-6">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-lg font-bold text-white shadow-md">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="mt-1 text-slate-600">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            {/* Aperçu d'un rapport (exemple illustratif) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Exemple de rapport
                  </p>
                  <p className="font-semibold">Data Scientist · Stage</p>
                </div>
                <p className="text-4xl font-bold text-emerald-600">
                  74<span className="text-base text-slate-400">/100</span>
                </p>
              </div>
              <ul className="space-y-4">
                {[
                  { name: "Statistiques", score: 8 },
                  { name: "Modélisation", score: 7 },
                  { name: "Métriques d'évaluation", score: 6 },
                  { name: "SQL", score: 4 },
                ].map((skill) => (
                  <li key={skill.name} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span>{skill.name}</span>
                      <span className="font-medium">{skill.score}/10</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${
                          skill.score >= 7
                            ? "bg-emerald-500"
                            : skill.score >= 5
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${skill.score * 10}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
                À réviser : jointures et fonctions de fenêtrage en SQL.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section id="faq" className="scroll-mt-20 bg-white py-24">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-600">FAQ</p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Questions fréquentes</h2>
          </div>
          <div className="space-y-3">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-slate-200 bg-white px-6 py-4 open:border-brand-200 open:shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {item.q}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-open:rotate-45 group-open:bg-brand-100 group-open:text-brand-700">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Appel à l'action ---------------- */}
      <section className="px-4 pb-24">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-violet-600 to-fuchsia-600 px-8 py-16 text-center text-white shadow-xl">
          <div aria-hidden="true" className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div aria-hidden="true" className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">
            Ton prochain entretien commence ici
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-white/80">
            Crée ton compte en quelques secondes et passe ton premier entretien dès maintenant.
          </p>
          <Link
            href={primaryHref}
            className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-brand-700 shadow-lg transition hover:scale-[1.02]"
          >
            {primaryLabel}
            <Icon name="arrow" className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
