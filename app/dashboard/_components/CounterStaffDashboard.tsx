import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Calendar } from "lucide-react";

export function CounterStaffDashboard() {
  return (
    <>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <h1 className="text-xl font-bold sm:text-2xl">Counter dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          OTC sales and queue support
        </p>
      </div>
      <Card className="border-t border-[hsl(var(--chart-5)/0.25)] animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75 fill-mode-backwards">
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg">Quick actions</CardTitle>
          <CardDescription>Daily tasks</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button asChild variant="outline" size="lg" className="min-h-11 flex-1 sm:flex-initial">
            <Link href="/dashboard/otc">
              <Package className="mr-2 h-4 w-4" />
              OTC Catalog
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-h-11 flex-1 sm:flex-initial">
            <Link href="/dashboard/appointments">
              <Calendar className="mr-2 h-4 w-4" />
              Appointments
            </Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
