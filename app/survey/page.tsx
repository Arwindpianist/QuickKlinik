import { SurveyFlow } from "./SurveyFlow";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default async function SurveyPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string; error?: string }>;
}) {
  const params = await searchParams;
  const submitted = params.submitted === "1";
  const error = typeof params.error === "string" ? params.error : null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingNav />
      <main className="kk-landing-surface-light relative flex-1 overflow-hidden px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
          <section className="space-y-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Survey</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Help shape QuickKlinik</h1>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
              Share your workflow and priorities. When completed, your response gets a dedicated UUID page on the
              QuickKlinik domain as a token of appreciation.
            </p>
          </section>
          <SurveyFlow submitted={submitted} serverError={error} />
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
