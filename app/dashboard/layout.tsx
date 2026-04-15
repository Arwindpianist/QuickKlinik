import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import { signOut } from "@/modules/auth/actions";
import { createClient } from "@/lib/supabase/server";
import { getNavItemsForRole } from "@/lib/nav";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DashboardAnalyticsBar } from "@/components/layout/DashboardAnalyticsBar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await getAuthenticatedUser();
  if ("error" in result) {
    redirect("/login");
  }
  const { user } = result;
  let clinicName: string | null = null;
  if (user.clinicId) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("clinics")
      .select("display_name")
      .eq("id", user.clinicId)
      .is("deleted_at", null)
      .single();
    clinicName = data?.display_name ?? null;
  }
  const navItems = getNavItemsForRole(user.roleName);
  return (
    <AppSidebar
      signOut={signOut}
      userRole={user.roleName}
      userEmail={user.profile.email ?? undefined}
      clinicName={clinicName}
      navItems={navItems}
    >
      <DashboardAnalyticsBar />
      {children}
    </AppSidebar>
  );
}
