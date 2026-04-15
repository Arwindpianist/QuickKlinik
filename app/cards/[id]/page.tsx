import Link from "next/link";
import { notFound } from "next/navigation";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { getSurveyCardByUuid } from "@/modules/surveys/service";
import { CometCompletionCard } from "./CometCompletionCard";
import { CardActions } from "./CardActions";

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export default async function SurveyCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isUuid(id)) notFound();

  const { data, error } = await getSurveyCardByUuid(id);
  if (error || !data) notFound();

  const name = data.name?.trim() || "Contributor";
  const completedLabel = new Date(data.created_at).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingNav />
      <main className="kk-landing-surface-light relative flex-1 overflow-hidden px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
          <section className="space-y-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Survey completion</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Thank you for completing our survey.
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
              Your feedback helps shape QuickKlinik. Your dedicated UUID page and appreciation card are now ready.
            </p>
          </section>

          <CometCompletionCard
            name={name}
            cardId={data.card_uuid}
            completedLabel={completedLabel}
          />

          <div className="mx-auto w-full max-w-xl">
            <CardActions cardId={data.card_uuid} />
          </div>

          <div className="text-center">
            <Link href="/survey" className="text-sm text-muted-foreground hover:text-foreground">
              Submit another response
            </Link>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
