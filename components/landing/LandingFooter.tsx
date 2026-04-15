import Link from "next/link";
import { QuickKlinikLogo } from "@/components/branding/QuickKlinikLogo";

const INITIATIVE_URL = "https://arwindpianist.com";

export function LandingFooter() {
  return (
    <footer className="kk-landing-surface-dark border-t border-sidebar-border/70 px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 sm:flex-row sm:items-start">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <QuickKlinikLogo size="sm" tone="sidebar" />
          <p className="max-w-xs text-center text-sm leading-relaxed text-sidebar-foreground/72 sm:text-left">
            Appointments, queue, and medicine, connected for outpatient teams.
          </p>
          <p className="max-w-md text-center text-xs leading-relaxed text-sidebar-foreground/60 sm:text-left">
            An initiative by{" "}
            <a
              href={INITIATIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-sidebar-foreground/80 underline decoration-primary/40 underline-offset-4 transition-colors hover:text-sidebar-foreground hover:decoration-primary"
            >
              Arwindpianist Multimedia &amp; Consulting
            </a>
            .
          </p>
          <p className="max-w-md text-center text-xs leading-relaxed text-sidebar-foreground/60 sm:text-left">
            Contact:{" "}
            <a href="mailto:hello@quickklinik.com" className="underline decoration-primary/35 underline-offset-4 hover:text-sidebar-foreground">
              hello@quickklinik.com
            </a>
            {" · "}
            <a href="mailto:sales@quickklinik.com" className="underline decoration-primary/35 underline-offset-4 hover:text-sidebar-foreground">
              sales@quickklinik.com
            </a>
            {" · "}
            <a href="mailto:enquiry@quickklinik.com" className="underline decoration-primary/35 underline-offset-4 hover:text-sidebar-foreground">
              enquiry@quickklinik.com
            </a>
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-2 text-sm font-medium sm:justify-end">
          <Link href="/" className="text-sidebar-foreground/68 transition-colors hover:text-sidebar-foreground">
            Home
          </Link>
          <Link href="/about" className="text-sidebar-foreground/68 transition-colors hover:text-sidebar-foreground">
            About
          </Link>
          <Link href="/survey" className="text-sidebar-foreground/68 transition-colors hover:text-sidebar-foreground">
            Survey
          </Link>
          <Link href="/#features" className="text-sidebar-foreground/68 transition-colors hover:text-sidebar-foreground">
            Product
          </Link>
          <Link href="/login" className="text-sidebar-foreground/68 transition-colors hover:text-sidebar-foreground">
            Login
          </Link>
        </div>
      </div>
      <p className="mt-12 text-center text-xs tracking-wide text-sidebar-foreground/55">
        © {new Date().getFullYear()} QuickKlinik. All rights reserved.
      </p>
    </footer>
  );
}
