"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Drawer } from "vaul";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Calendar,
  Package,
  LayoutDashboard,
  ClipboardList,
  LogOut,
  PanelLeft,
  Building2,
  Users,
  FileText,
} from "lucide-react";
import type { NavIconKey } from "@/lib/nav";
import { Button } from "@/components/ui/button";
import { QuickKlinikLogo } from "@/components/branding/QuickKlinikLogo";
import { cn } from "@/lib/utils";

const NAV_ICONS: Record<NavIconKey, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Calendar,
  Package,
  ClipboardList,
  Building2,
  Users,
  FileText,
};

export type SidebarNavItem = { href: string; label: string; iconKey: NavIconKey };

function MobileDrawerMenu({
  signOut,
  userRole,
  userEmail,
  clinicName,
  navItems,
}: {
  signOut: () => Promise<void>;
  userRole: string;
  userEmail?: string;
  clinicName?: string | null;
  navItems: SidebarNavItem[];
}) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-t-[var(--radius)] bg-sidebar text-sidebar-foreground">
      <Drawer.Title className="sr-only">Menu</Drawer.Title>
      <Drawer.Description className="sr-only">Navigation and account actions</Drawer.Description>
      <Drawer.Handle className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-sidebar-foreground/20" />
      <SidebarHeader className="shrink-0 px-4 pt-1 pb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link
                href="/dashboard"
                className="flex min-h-[48px] flex-col items-start justify-center gap-0.5 py-3 text-left md:min-h-0 md:py-0"
                onClick={() => setOpenMobile(false)}
              >
                <QuickKlinikLogo size="xs" tone="sidebar" />
                <span className="text-xs font-normal text-sidebar-foreground/70">Clinic dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="min-h-0 flex-1 overflow-y-auto px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="py-1 text-sidebar-foreground/70">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = NAV_ICONS[item.iconKey];
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} className="min-h-[48px] py-3 px-3 text-base [&>svg]:size-5">
                      <Link href={item.href} className="min-h-[48px] py-3" onClick={() => setOpenMobile(false)}>
                        {Icon && <Icon className="size-5 shrink-0" />}
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="shrink-0 border-t border-sidebar-border p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <SidebarMenu>
          {(userRole || userEmail || clinicName) && (
            <SidebarMenuItem>
              <div className="px-2 py-1.5 text-xs text-sidebar-foreground/80">
                <div className="font-medium">{userRole}</div>
                {clinicName && <div className="truncate text-sidebar-foreground/70">{clinicName}</div>}
                {userEmail && <div className="truncate text-sidebar-foreground/60">{userEmail}</div>}
              </div>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <form action={signOut} className="w-full">
              <button
                type="submit"
                className={cn(
                  "flex min-h-[48px] w-full items-center gap-3 rounded-md px-3 py-3 text-base text-sidebar-foreground",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-inset outline-none active:bg-sidebar-accent"
                )}
                onClick={() => setOpenMobile(false)}
              >
                <LogOut className="size-5 shrink-0" />
                <span>Sign out</span>
              </button>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </div>
  );
}

function UserRoleBadge({ userRole, userEmail, clinicName }: { userRole: string; userEmail?: string; clinicName?: string | null }) {
  return (
    <div className="px-2 py-1.5 text-xs text-sidebar-foreground/80">
      <div className="font-medium">{userRole}</div>
      {clinicName && <div className="truncate text-sidebar-foreground/70">{clinicName}</div>}
      {userEmail && <div className="truncate text-sidebar-foreground/60">{userEmail}</div>}
    </div>
  );
}

export function AppSidebar({
  children,
  signOut,
  userRole,
  userEmail,
  clinicName,
  navItems,
}: {
  children: React.ReactNode;
  signOut: () => Promise<void>;
  userRole: string;
  userEmail?: string;
  clinicName?: string | null;
  navItems: SidebarNavItem[];
}) {
  const pathname = usePathname();
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  return (
    <SidebarProvider>
      <MobileDrawerWrapper
        signOut={signOut}
        menuButtonRef={menuButtonRef}
        userRole={userRole}
        userEmail={userEmail}
        clinicName={clinicName}
        navItems={navItems}
      >
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <Link href="/dashboard" className="flex flex-col items-start gap-0.5">
                    <QuickKlinikLogo size="xs" tone="sidebar" />
                    <span className="text-xs font-normal text-sidebar-foreground/70">Clinic dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => {
                    const Icon = NAV_ICONS[item.iconKey];
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link href={item.href}>
                            {Icon && <Icon />}
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              {(userRole || userEmail || clinicName) && (
                <SidebarMenuItem>
                  <UserRoleBadge userRole={userRole} userEmail={userEmail} clinicName={clinicName} />
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <form action={signOut} className="w-full">
                  <button
                    type="submit"
                    className="flex h-9 w-full items-center gap-2 rounded-md px-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <LogOut />
                    <span>Sign out</span>
                  </button>
                </form>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border/60 bg-background/80 px-4 backdrop-blur-sm md:hidden">
            <MobileMenuButton ref={menuButtonRef} />
            <span className="text-sm font-medium">Menu</span>
          </header>
          <div className="kk-brand-backdrop min-h-full flex-1 animate-in fade-in duration-200">
            {children}
          </div>
        </SidebarInset>
      </MobileDrawerWrapper>
    </SidebarProvider>
  );
}

function MobileDrawerWrapper({
  children,
  signOut,
  menuButtonRef,
  userRole,
  userEmail,
  clinicName,
  navItems,
}: {
  children: React.ReactNode;
  signOut: () => Promise<void>;
  menuButtonRef: React.RefObject<HTMLButtonElement | null>;
  userRole: string;
  userEmail?: string;
  clinicName?: string | null;
  navItems: SidebarNavItem[];
}) {
  const { openMobile, setOpenMobile } = useSidebar();

  const handleOpenChange = (open: boolean) => {
    setOpenMobile(open);
    if (!open) {
      // Always blur the menu button when drawer closes (drag or overlay click) so it doesn't stay white
      menuButtonRef.current?.blur();
    }
  };

  return (
    <Drawer.Root
      open={openMobile}
      onOpenChange={handleOpenChange}
      direction="bottom"
      dismissible
      modal
      shouldScaleBackground={false}
    >
      {children}
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[100] bg-foreground/50 backdrop-blur-[2px]" />
        <Drawer.Content
          className="fixed inset-x-0 bottom-0 z-[100] flex max-h-[92svh] flex-col overflow-hidden rounded-t-[var(--radius)] border-t border-sidebar-border bg-sidebar shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.18)] outline-none"
        >
          <MobileDrawerMenu signOut={signOut} userRole={userRole} userEmail={userEmail} clinicName={clinicName} navItems={navItems} />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

const MobileMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(function MobileMenuButton(props, ref) {
  const { setOpenMobile } = useSidebar();
  return (
    <Button
      ref={ref}
      type="button"
      variant="ghost"
      size="icon"
      className="h-7 w-7 md:hidden"
      aria-label="Open menu"
      onClick={() => setOpenMobile(true)}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
    </Button>
  );
});
