"use server";

import { createServiceRoleClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth";

export type TenantAnalyticsRow = {
  clinicId: string;
  displayName: string;
  appointmentsToday: number;
  appointmentsThisMonth: number;
  otcOrdersCount: number;
  otcProductsCount: number;
  lowStockBatchCount: number;
};

/** Summary metrics for the dashboard bar (role-aware). Shown on every page. */
export type DashboardAnalyticsSummary = {
  label: string;
  appointmentsToday: number;
  appointmentsThisMonth: number;
  otcProductsCount: number;
  otcOrdersCount: number;
  lowStockCount: number;
  clinicCount?: number;
};

export async function getDashboardAnalytics(): Promise<{
  data: DashboardAnalyticsSummary | null;
  error: string | null;
}> {
  const result = await getAuthenticatedUser();
  if ("error" in result) return { data: null, error: result.error };
  const { user } = result;

  const now = new Date();
  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);
  const endToday = new Date(startToday);
  endToday.setDate(endToday.getDate() + 1);
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  if (user.roleName === "SuperAdmin") {
    const admin = createServiceRoleClient();
    const [clinicsRes, todayRes, monthRes, otcOrdersRes, otcProductsRes, lowRes] = await Promise.all([
      admin.from("clinics").select("id", { count: "exact", head: true }).is("deleted_at", null),
      admin.from("appointments").select("id", { count: "exact", head: true }).is("deleted_at", null).gte("scheduled_at", startToday.toISOString()).lt("scheduled_at", endToday.toISOString()),
      admin.from("appointments").select("id", { count: "exact", head: true }).is("deleted_at", null).gte("scheduled_at", startMonth.toISOString()).lte("scheduled_at", endMonth.toISOString()),
      admin.from("otc_orders").select("id", { count: "exact", head: true }).is("deleted_at", null),
      admin.from("otc_products").select("id", { count: "exact", head: true }).is("deleted_at", null),
      admin.from("otc_batches").select("id, otc_product_id").lt("quantity", 10).is("deleted_at", null),
    ]);
    const productIdsRes = await admin.from("otc_products").select("id").is("deleted_at", null);
    const allProductIds = new Set(((productIdsRes.data ?? []) as { id: string }[]).map((p) => p.id));
    const lowStockCount = (lowRes.data ?? []).filter((b: { otc_product_id: string }) => allProductIds.has(b.otc_product_id)).length;
    return {
      data: {
        label: "Platform",
        appointmentsToday: todayRes.count ?? 0,
        appointmentsThisMonth: monthRes.count ?? 0,
        otcProductsCount: otcProductsRes.count ?? 0,
        otcOrdersCount: otcOrdersRes.count ?? 0,
        lowStockCount,
        clinicCount: clinicsRes.count ?? 0,
      },
      error: null,
    };
  }

  if (user.clinicId) {
    const supabase = await createClient();
    const [todayRes, monthRes, otcProductsRes, otcOrdersRes, lowRes] = await Promise.all([
      supabase.from("appointments").select("id", { count: "exact", head: true }).eq("clinic_id", user.clinicId).is("deleted_at", null).gte("scheduled_at", startToday.toISOString()).lt("scheduled_at", endToday.toISOString()),
      supabase.from("appointments").select("id", { count: "exact", head: true }).eq("clinic_id", user.clinicId).is("deleted_at", null).gte("scheduled_at", startMonth.toISOString()).lte("scheduled_at", endMonth.toISOString()),
      supabase.from("otc_products").select("id", { count: "exact", head: true }).eq("clinic_id", user.clinicId).is("deleted_at", null),
      supabase.from("otc_orders").select("id", { count: "exact", head: true }).eq("clinic_id", user.clinicId).is("deleted_at", null),
      supabase.from("otc_batches").select("id, otc_product_id").lt("quantity", 10).is("deleted_at", null),
    ]);
    const productIdsRes = await supabase.from("otc_products").select("id").eq("clinic_id", user.clinicId).is("deleted_at", null);
    const clinicProductIds = new Set((productIdsRes.data ?? []).map((p) => p.id));
    const lowStockCount = (lowRes.data ?? []).filter((b: { otc_product_id: string }) => clinicProductIds.has(b.otc_product_id)).length;
    const { data: clinic } = await supabase.from("clinics").select("display_name").eq("id", user.clinicId).is("deleted_at", null).single();
    return {
      data: {
        label: clinic?.display_name ?? "Clinic",
        appointmentsToday: todayRes.count ?? 0,
        appointmentsThisMonth: monthRes.count ?? 0,
        otcProductsCount: otcProductsRes.count ?? 0,
        otcOrdersCount: otcOrdersRes.count ?? 0,
        lowStockCount,
      },
      error: null,
    };
  }

  return { data: null, error: null };
}

/** Per-tenant analytics for SuperAdmin. Uses service role to read all clinics and aggregate counts. */
export async function getPerTenantAnalytics(): Promise<{
  data: TenantAnalyticsRow[] | null;
  error: string | null;
}> {
  const result = await getAuthenticatedUser(["SuperAdmin"]);
  if ("error" in result) return { data: null, error: result.error };
  const supabase = createServiceRoleClient();

  const { data: clinics, error: clinicsErr } = await supabase
    .from("clinics")
    .select("id, display_name")
    .is("deleted_at", null)
    .order("display_name");
  if (clinicsErr || !clinics?.length) return { data: [], error: clinicsErr?.message ?? null };

  const clinicsList = clinics as { id: string; display_name: string }[];
  const now = new Date();
  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);
  const endToday = new Date(startToday);
  endToday.setDate(endToday.getDate() + 1);
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const rows: TenantAnalyticsRow[] = await Promise.all(
    clinicsList.map(async (c) => {
      const [todayRes, monthRes, otcOrdersRes, otcProductsRes, lowRes] = await Promise.all([
        supabase
          .from("appointments")
          .select("id", { count: "exact", head: true })
          .eq("clinic_id", c.id)
          .is("deleted_at", null)
          .gte("scheduled_at", startToday.toISOString())
          .lt("scheduled_at", endToday.toISOString()),
        supabase
          .from("appointments")
          .select("id", { count: "exact", head: true })
          .eq("clinic_id", c.id)
          .is("deleted_at", null)
          .gte("scheduled_at", startMonth.toISOString())
          .lte("scheduled_at", endMonth.toISOString()),
        supabase
          .from("otc_orders")
          .select("id", { count: "exact", head: true })
          .eq("clinic_id", c.id)
          .is("deleted_at", null),
        supabase
          .from("otc_products")
          .select("id", { count: "exact", head: true })
          .eq("clinic_id", c.id)
          .is("deleted_at", null),
        supabase
          .from("otc_batches")
          .select("id, otc_product_id")
          .lt("quantity", 10)
          .is("deleted_at", null),
      ]);

      const productIdsRes = await supabase
        .from("otc_products")
        .select("id")
        .eq("clinic_id", c.id)
        .is("deleted_at", null);
      const clinicProductIds = new Set(((productIdsRes.data ?? []) as { id: string }[]).map((p) => p.id));
      const lowStockCount = (lowRes.data ?? []).filter((b: { otc_product_id: string }) =>
        clinicProductIds.has(b.otc_product_id)
      ).length;

      return {
        clinicId: c.id,
        displayName: c.display_name,
        appointmentsToday: todayRes.count ?? 0,
        appointmentsThisMonth: monthRes.count ?? 0,
        otcOrdersCount: otcOrdersRes.count ?? 0,
        otcProductsCount: otcProductsRes.count ?? 0,
        lowStockBatchCount: lowStockCount,
      };
    })
  );

  return { data: rows, error: null };
}

// --- Page-level analytics (numbers + chart data) ---

export type AppointmentsAnalytics = {
  stats: { today: number; thisWeek: number; byStatus: Record<string, number> };
  chartData: { name: string; count: number }[];
};

export async function getAppointmentsPageAnalytics(clinicId: string | null): Promise<{ data: AppointmentsAnalytics | null; error: string | null }> {
  if (!clinicId) return { data: null, error: null };
  const supabase = await createClient();
  const now = new Date();
  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);
  const endToday = new Date(startToday);
  endToday.setDate(endToday.getDate() + 1);
  const startWeek = new Date(startToday);
  startWeek.setDate(startWeek.getDate() - startWeek.getDay());
  const endWeek = new Date(startWeek);
  endWeek.setDate(endWeek.getDate() + 7);

  const [todayRes, weekRes, statusRes, last7Res] = await Promise.all([
    supabase.from("appointments").select("id", { count: "exact", head: true }).eq("clinic_id", clinicId).is("deleted_at", null).gte("scheduled_at", startToday.toISOString()).lt("scheduled_at", endToday.toISOString()),
    supabase.from("appointments").select("id", { count: "exact", head: true }).eq("clinic_id", clinicId).is("deleted_at", null).gte("scheduled_at", startWeek.toISOString()).lt("scheduled_at", endWeek.toISOString()),
    supabase.from("appointments").select("status").eq("clinic_id", clinicId).is("deleted_at", null),
    supabase.from("appointments").select("scheduled_at").eq("clinic_id", clinicId).is("deleted_at", null).gte("scheduled_at", new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  const byStatus: Record<string, number> = {};
  (statusRes.data ?? []).forEach((r: { status: string }) => {
    byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
  });

  const dayCounts: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    dayCounts[d.toISOString().slice(0, 10)] = 0;
  }
  (last7Res.data ?? []).forEach((r: { scheduled_at: string }) => {
    const day = r.scheduled_at.slice(0, 10);
    if (day in dayCounts) dayCounts[day]++;
  });
  const chartData = Object.entries(dayCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, count]) => ({ name: name.slice(5), count }));

  return {
    data: {
      stats: { today: todayRes.count ?? 0, thisWeek: weekRes.count ?? 0, byStatus },
      chartData,
    },
    error: null,
  };
}

export type OtcPageAnalytics = {
  stats: { products: number; orders: number; ordersThisWeek: number };
  chartData: { name: string; count: number }[];
};

export async function getOtcPageAnalytics(clinicId: string | null): Promise<{ data: OtcPageAnalytics | null; error: string | null }> {
  if (!clinicId) return { data: null, error: null };
  const supabase = await createClient();
  const now = new Date();
  const startWeek = new Date(now);
  startWeek.setDate(startWeek.getDate() - startWeek.getDay());

  const [productsRes, ordersRes, ordersWeekRes, last7Res] = await Promise.all([
    supabase.from("otc_products").select("id", { count: "exact", head: true }).eq("clinic_id", clinicId).is("deleted_at", null),
    supabase.from("otc_orders").select("id", { count: "exact", head: true }).eq("clinic_id", clinicId).is("deleted_at", null),
    supabase.from("otc_orders").select("id", { count: "exact", head: true }).eq("clinic_id", clinicId).is("deleted_at", null).gte("created_at", startWeek.toISOString()),
    supabase.from("otc_orders").select("created_at").eq("clinic_id", clinicId).is("deleted_at", null).gte("created_at", new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  const dayCounts: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    dayCounts[d.toISOString().slice(0, 10)] = 0;
  }
  (last7Res.data ?? []).forEach((r: { created_at: string }) => {
    const day = r.created_at.slice(0, 10);
    if (day in dayCounts) dayCounts[day]++;
  });
  const chartData = Object.entries(dayCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, count]) => ({ name: name.slice(5), count }));

  return {
    data: {
      stats: { products: productsRes.count ?? 0, orders: ordersRes.count ?? 0, ordersThisWeek: ordersWeekRes.count ?? 0 },
      chartData,
    },
    error: null,
  };
}

export type InventoryPageAnalytics = {
  stats: { batches: number; totalUnits: number; lowStock: number };
  chartData: { name: string; value: number }[];
};

export async function getInventoryPageAnalytics(clinicId: string | null): Promise<{ data: InventoryPageAnalytics | null; error: string | null }> {
  if (!clinicId) return { data: null, error: null };
  const supabase = await createClient();
  const { data: products } = await supabase.from("otc_products").select("id, name").eq("clinic_id", clinicId).is("deleted_at", null);
  const productIds = (products ?? []).map((p) => p.id);
  if (!productIds.length) return { data: { stats: { batches: 0, totalUnits: 0, lowStock: 0 }, chartData: [] }, error: null };

  const { data: batches } = await supabase.from("otc_batches").select("otc_product_id, quantity").is("deleted_at", null).in("otc_product_id", productIds);
  const byProduct: Record<string, { total: number; low: number }> = {};
  (products ?? []).forEach((p: { id: string; name: string }) => {
    byProduct[p.id] = { total: 0, low: 0 };
  });
  (batches ?? []).forEach((b: { otc_product_id: string; quantity: number }) => {
    if (byProduct[b.otc_product_id]) {
      byProduct[b.otc_product_id].total += b.quantity;
      if (b.quantity < 10) byProduct[b.otc_product_id].low += 1;
    }
  });
  const chartData = (products ?? []).map((p: { id: string; name: string }) => ({
    name: p.name.length > 12 ? p.name.slice(0, 12) + "…" : p.name,
    value: byProduct[p.id]?.total ?? 0,
  }));
  const totalUnits = Object.values(byProduct).reduce((s, x) => s + x.total, 0);
  const lowStock = Object.values(byProduct).reduce((s, x) => s + x.low, 0);

  return {
    data: {
      stats: { batches: batches?.length ?? 0, totalUnits, lowStock },
      chartData,
    },
    error: null,
  };
}

export type AuditPageAnalytics = {
  stats: { total: number; today: number; byAction: Record<string, number> };
  chartData: { name: string; count: number }[];
};

export async function getAuditPageAnalytics(clinicId: string | null): Promise<{ data: AuditPageAnalytics | null; error: string | null }> {
  const result = await getAuthenticatedUser(["SuperAdmin", "ClinicAdmin"]);
  if ("error" in result) return { data: null, error: result.error };
  const supabase = await createClient();
  let q = supabase.from("audit_logs").select("action, created_at").order("created_at", { ascending: false }).limit(200);
  if (clinicId) q = q.eq("clinic_id", clinicId);
  const { data: logs } = await q;
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const byAction: Record<string, number> = {};
  const dayCounts: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    dayCounts[d.toISOString().slice(0, 10)] = 0;
  }
  (logs ?? []).forEach((r: { action: string; created_at: string }) => {
    byAction[r.action] = (byAction[r.action] ?? 0) + 1;
    const day = r.created_at.slice(0, 10);
    if (day in dayCounts) dayCounts[day]++;
  });
  const chartData = Object.entries(dayCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, count]) => ({ name: name.slice(5), count }));
  const today = (logs ?? []).filter((r: { created_at: string }) => r.created_at >= todayStart.toISOString()).length;

  return {
    data: {
      stats: { total: logs?.length ?? 0, today, byAction },
      chartData,
    },
    error: null,
  };
}

export type StaffPageAnalytics = {
  stats: { total: number; byRole: Record<string, number> };
  chartData: { name: string; value: number }[];
};

export async function getStaffPageAnalytics(): Promise<{ data: StaffPageAnalytics | null; error: string | null }> {
  const result = await getAuthenticatedUser(["SuperAdmin", "ClinicAdmin"]);
  if ("error" in result) return { data: null, error: result.error };
  const supabase = await createClient();
  let q = supabase.from("profiles").select("id, roles(name)").is("deleted_at", null);
  if (result.user.roleName === "ClinicAdmin" && result.user.clinicId) {
    q = q.eq("clinic_id", result.user.clinicId);
  }
  const { data: profiles } = await q;
  const byRole: Record<string, number> = {};
  (profiles ?? []).forEach((p: { roles?: { name: string } | { name: string }[] | null }) => {
    const role = p.roles;
    const name = Array.isArray(role) ? role[0]?.name : role?.name;
    const label = name ?? "—";
    byRole[label] = (byRole[label] ?? 0) + 1;
  });
  const chartData = Object.entries(byRole).map(([name, value]) => ({ name, value }));

  return {
    data: {
      stats: { total: profiles?.length ?? 0, byRole },
      chartData,
    },
    error: null,
  };
}

/** Chart data for dashboard home: appointments per day last 7 days (role-aware scope). */
export async function getDashboardHomeChartData(): Promise<{ data: { name: string; count: number }[] | null; error: string | null }> {
  const result = await getAuthenticatedUser();
  if ("error" in result) return { data: null, error: result.error };
  const supabase = result.user.roleName === "SuperAdmin"
    ? createServiceRoleClient()
    : await createClient();
  const now = new Date();
  const dayCounts: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    dayCounts[d.toISOString().slice(0, 10)] = 0;
  }
  let query = supabase
    .from("appointments")
    .select("scheduled_at")
    .is("deleted_at", null)
    .gte("scheduled_at", new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString());
  if (result.user.roleName !== "SuperAdmin" && result.user.clinicId) {
    query = query.eq("clinic_id", result.user.clinicId);
  }
  const { data: rows } = await query;
  (rows ?? []).forEach((r: { scheduled_at: string }) => {
    const day = r.scheduled_at.slice(0, 10);
    if (day in dayCounts) dayCounts[day]++;
  });
  const chartData = Object.entries(dayCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, count]) => ({ name: name.slice(5), count }));
  return { data: chartData, error: null };
}
