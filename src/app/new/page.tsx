import NewInterviewForm from "@/components/NewInterviewForm";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewInterviewPage() {
  const user = await requireUser("/new");
  const firstName = user.name.split(" ")[0];

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold">Prêt pour ton entretien, {firstName} ?</h1>
        <p className="text-slate-600">
          Choisis un poste type ou colle une offre d&apos;emploi : un recruteur IA te pose des
          questions, relance quand ta réponse est vague, puis te rend un rapport avec tes points
          forts et ce qu&apos;il faut retravailler.
        </p>
      </section>
      <NewInterviewForm />
    </div>
  );
}
