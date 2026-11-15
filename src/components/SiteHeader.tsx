import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import Logo from "./Logo";

// Barre de navigation fixe : liens de la page d'accueil pour les visiteurs,
// liens de l'application pour les utilisateurs connectés.
export default async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Logo />

        {user ? (
          <>
            <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
              <Link href="/new" className="hover:text-slate-900">
                Nouvel entretien
              </Link>
              <Link href="/history" className="hover:text-slate-900">
                Historique
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-2 text-sm text-slate-600 sm:flex">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                {user.name}
              </span>
              <Link
                href="/new"
                className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700 md:hidden"
              >
                Entretien
              </Link>
              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Déconnexion
                </button>
              </form>
            </div>
          </>
        ) : (
          <>
            <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
              <Link href="/#fonctionnalites" className="hover:text-slate-900">
                Fonctionnalités
              </Link>
              <Link href="/#comment-ca-marche" className="hover:text-slate-900">
                Comment ça marche
              </Link>
              <Link href="/#postes" className="hover:text-slate-900">
                Postes
              </Link>
              <Link href="/#faq" className="hover:text-slate-900">
                FAQ
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/signin"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Se connecter
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-gradient-to-r from-brand-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              >
                Commencer gratuitement
              </Link>
            </div>
          </>
        )}
      </nav>
    </header>
  );
}
