import Link from "next/link";
import { Suspense } from "react";
import { signIn } from "@/modules/auth/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginError } from "./LoginError";
import { DevLoginButtons } from "./DevLoginButtons";

const showDevLogin =
  process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_DEV_LOGIN === "true";

export default function LoginPage() {
  return (
    <main className="kk-brand-backdrop relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4 sm:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(65%_60%_at_50%_30%,#000_25%,transparent_70%)]"
      />

      <div className="w-full max-w-sm space-y-6">
        <Card className="relative bg-card/75 backdrop-blur animate-in fade-in zoom-in-95 duration-300 fill-mode-backwards">
          <div
            aria-hidden
            className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[hsl(var(--ring))] opacity-10 blur-3xl"
          />
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl sm:text-2xl">Log in</CardTitle>
            <CardDescription>Sign in to your clinic account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {showDevLogin && (
              <Suspense fallback={null}>
                <DevLoginButtons />
              </Suspense>
            )}
            <Suspense fallback={null}>
              <LoginError />
            </Suspense>
            <form action={signIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@clinic.com"
                  className="min-h-11 bg-background/70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="min-h-11 bg-background/70"
                />
              </div>
              <Button type="submit" className="w-full min-h-11">
                Sign in
              </Button>
            </form>
            <p className="text-center text-sm text-card-foreground/75">
              <Link href="/" className="underline underline-offset-2 hover:no-underline">
                Back to home
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
