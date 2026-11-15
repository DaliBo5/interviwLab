import Link from "next/link";
import Logo from "./Logo";

const COLUMNS = [
  {
    title: "Produit",
    links: [
      { label: "Fonctionnalités", href: "/#fonctionnalites" },
      { label: "Comment ça marche", href: "/#comment-ca-marche" },
      { label: "Postes couverts", href: "/#postes" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Entraînement",
    links: [
      { label: "Nouvel entretien", href: "/new" },
      { label: "Historique", href: "/history" },
    ],
  },
  {
    title: "Compte",
    links: [
      { label: "Se connecter", href: "/signin" },
      { label: "Créer un compte", href: "/signup" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="space-y-4">
          <Logo dark />
          <p className="max-w-xs text-sm leading-relaxed">
            Entraîne-toi aux entretiens techniques avec un recruteur IA et reçois un retour détaillé
            après chaque session.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <p className="mb-4 text-sm font-semibold text-white">{column.title}</p>
            <ul className="space-y-2 text-sm">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-800">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs">
          © {new Date().getFullYear()} InterviewLab. Projet portfolio.
        </p>
      </div>
    </footer>
  );
}
