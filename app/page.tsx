import { LandingNav } from "@/components/landing/LandingNav";
import { HomeLanding } from "@/components/landing/HomeLanding";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <LandingNav />
      <HomeLanding />
    </main>
  );
}
