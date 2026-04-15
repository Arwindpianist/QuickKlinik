import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { getSupabaseAnonKey } from "@/lib/supabase/env";

const protectedPaths = ["/dashboard", "/admin", "/appointments", "/otc", "/kiosk"];
const authEntryPaths = ["/login"];

function isProtected(pathname: string): boolean {
  return protectedPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function isAuthEntry(pathname: string): boolean {
  return authEntryPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function isAuthLockdownEnabled(): boolean {
  return process.env.AUTH_LOCKDOWN === "true" || process.env.NEXT_PUBLIC_AUTH_LOCKDOWN === "true";
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (isAuthLockdownEnabled() && (isProtected(pathname) || isAuthEntry(pathname))) {
    const url = request.nextUrl.clone();
    url.pathname = "/survey";
    url.searchParams.set("mode", "preview");
    return NextResponse.redirect(url);
  }

  const res = await updateSession(request);
  if (isProtected(pathname)) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = getSupabaseAnonKey();
    if (supabaseUrl && supabaseAnonKey) {
      const { createServerClient } = await import("@supabase/ssr");
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: () => {},
        },
      });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
      }
    }
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
