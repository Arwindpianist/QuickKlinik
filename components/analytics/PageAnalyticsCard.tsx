import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleBarChart } from "@/components/charts/SimpleBarChart";
import { SimpleLineChart } from "@/components/charts/SimpleLineChart";

type Stat = { label: string; value: number | string };

export function PageAnalyticsCard({
  title,
  stats,
  chartData,
  chartType = "line",
  chartDataKey,
}: {
  title: string;
  stats: Stat[];
  chartData: { name: string; count?: number; value?: number }[];
  chartType?: "bar" | "line";
  chartDataKey?: string;
}) {
  const dataKey = chartDataKey ?? (chartType === "line" ? "count" : "value");
  const normalizedChartData = chartData.map((d) => {
    const num = d.count ?? d.value ?? 0;
    return { name: d.name, count: num, value: num };
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-lg border bg-muted/30 px-3 py-2">
                <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold">{s.value}</p>
              </div>
            ))}
          </div>
        )}
        {normalizedChartData.length > 0 && (
          <div className="mt-4">
            {chartType === "line" ? (
              <SimpleLineChart data={normalizedChartData} dataKey={dataKey} />
            ) : (
              <SimpleBarChart data={normalizedChartData} dataKey={dataKey} />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
