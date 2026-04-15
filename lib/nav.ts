import type { RoleName } from "@/lib/auth";

export type NavIconKey =
  | "LayoutDashboard"
  | "Calendar"
  | "Package"
  | "ClipboardList"
  | "Building2"
  | "Users"
  | "FileText";

export interface NavItem {
  href: string;
  label: string;
  iconKey: NavIconKey;
  /** Roles that can see this item. Empty = all authenticated. */
  allowedRoles: RoleName[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    iconKey: "LayoutDashboard",
    allowedRoles: [],
  },
  {
    href: "/dashboard/appointments",
    label: "Appointments",
    iconKey: "Calendar",
    allowedRoles: [],
  },
  {
    href: "/dashboard/otc",
    label: "OTC Catalog",
    iconKey: "Package",
    allowedRoles: [],
  },
  {
    href: "/dashboard/inventory",
    label: "Inventory",
    iconKey: "ClipboardList",
    allowedRoles: ["SuperAdmin", "ClinicAdmin", "InventoryStaff"],
  },
  {
    href: "/dashboard/tenants",
    label: "Tenants",
    iconKey: "Building2",
    allowedRoles: ["SuperAdmin"],
  },
  {
    href: "/dashboard/staff",
    label: "Staff",
    iconKey: "Users",
    allowedRoles: ["SuperAdmin", "ClinicAdmin"],
  },
  {
    href: "/dashboard/audit",
    label: "Audit log",
    iconKey: "FileText",
    allowedRoles: ["SuperAdmin", "ClinicAdmin"],
  },
];

/** Returns nav items visible to the given role. */
export function getNavItemsForRole(role: RoleName): NavItem[] {
  return NAV_ITEMS.filter(
    (item) =>
      item.allowedRoles.length === 0 || item.allowedRoles.includes(role)
  );
}
