import Link from "next/link";
import { QuickKlinikLogo } from "@/components/branding/QuickKlinikLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/#audiences", label: "Who we serve" },
  { href: "/#preview", label: "Preview" },
  { href: "/#problem", label: "Challenges" },
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Early access" },
] as const;

export function LandingNav({ className }: { className?: string }) {
  const authLockdown =
    process.env.AUTH_LOCKDOWN === "true" || process.env.NEXT_PUBLIC_AUTH_LOCKDOWN === "true";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border bg-card/95 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-card/88",
        "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2 motion-safe:duration-500",
        className
      )}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-semibold text-foreground transition-opacity hover:opacity-90"
        >
          <QuickKlinikLogo size="sm" />
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hidden px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground sm:inline-flex"
            >
              {item.label}
            </Link>
          ))}
          {authLockdown ? (
            <Button
              size="sm"
              variant="outline"
              className="ml-1 cursor-not-allowed border-border bg-muted/60 text-foreground/80 opacity-90 sm:ml-2"
              disabled
            >
              Login Coming Soon
            </Button>
          ) : (
            <>
              <Link
                href="/survey"
                className="hidden px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground sm:inline-flex"
              >
                Early Access
              </Link>
              <Button asChild size="sm" className="ml-1 sm:ml-2">
                <Link href="/survey">Get Access</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
