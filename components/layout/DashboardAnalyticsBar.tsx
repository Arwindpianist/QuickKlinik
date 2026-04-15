import { getDashboardAnalytics } from "@/modules/analytics/actions";
import { Calendar, Package, ShoppingCart, AlertTriangle, Building2 } from "lucide-react";

export async function DashboardAnalyticsBar() {
  const { data, error } = await getDashboardAnalytics();
  if (error || !data) return null;

  return (
    <div className="border-b bg-muted/40 px-4 py-2 sm:px-6">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
        <span className="font-medium text-muted-foreground">{data.label} ·</span>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Today: {data.appointmentsToday}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Month: {data.appointmentsThisMonth}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Package className="h-3.5 w-3.5 text-muted-foreground" />
          <span>OTC: {data.otcProductsCount} products</span>
        </span>
        <span className="flex items-center gap-1.5">
          <ShoppingCart className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Orders: {data.otcOrdersCount}</span>
        </span>
        <span className={`flex items-center gap-1.5 ${data.lowStockCount > 0 ? "text-amber-600 dark:text-amber-400" : ""}`}>
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Low stock: {data.lowStockCount}</span>
        </span>
        {data.clinicCount !== undefined && (
          <span className="flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{data.clinicCount} clinics</span>
          </span>
        )}
      </div>
    </div>
  );
}
