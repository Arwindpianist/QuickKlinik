import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { listSurveyDirectory } from "@/modules/surveys/service";
import { CardsDirectoryClient } from "./CardsDirectoryClient";

export default async function CardsDirectoryPage() {
  const { data, error } = await listSurveyDirectory(600);
  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <LandingNav />
        <main className="kk-landing-surface-light flex-1 px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-5xl rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            Failed to load survey entries. Please try again.
          </div>
        </main>
        <LandingFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingNav />
      <main className="kk-landing-surface-light flex-1 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
          <section className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Community showcase</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Early Contributors</h1>
            <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
              A public wall celebrating people who helped shape QuickKlinik through our survey. Explore contributors
              and open each person&apos;s dedicated UUID page.
            </p>
          </section>

          <CardsDirectoryClient entries={data} />
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
