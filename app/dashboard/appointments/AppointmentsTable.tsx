import { updateAppointmentStatus } from "@/modules/appointments/actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";

type AppointmentRow = {
  id: string;
  status: string;
  scheduled_at: string;
  patients: unknown;
  doctors: unknown;
};

function getFullName(rel: unknown): string {
  if (rel && typeof rel === "object" && "full_name" in rel && typeof (rel as { full_name: string }).full_name === "string") {
    return (rel as { full_name: string }).full_name;
  }
  if (Array.isArray(rel) && rel[0] && typeof rel[0] === "object" && "full_name" in rel[0]) {
    return (rel[0] as { full_name: string }).full_name;
  }
  return "—";
}

export function AppointmentsTable({ appointments }: { appointments: AppointmentRow[] }) {
  const statuses = ["booked", "arrived", "waiting", "in_consultation", "completed"] as const;
  return (
    <Table className="min-w-[600px]">
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Doctor</TableHead>
          <TableHead>Scheduled</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[180px]">Update</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="py-12 text-center text-card-foreground/70">
              No appointments match the selected filter. Try &quot;All&quot; or create a new appointment.
            </TableCell>
          </TableRow>
        ) : (
          appointments.map((apt) => (
            <TableRow key={apt.id} className="whitespace-nowrap">
              <TableCell className="py-3">{getFullName(apt.patients)}</TableCell>
              <TableCell className="py-3">{getFullName(apt.doctors)}</TableCell>
              <TableCell className="py-3 text-sm">{new Date(apt.scheduled_at).toLocaleString()}</TableCell>
              <TableCell className="py-3">
                <StatusBadge status={apt.status} />
              </TableCell>
              <TableCell className="py-3">
                <form
                  action={updateAppointmentStatus}
                  className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-1"
                >
                  <input type="hidden" name="appointmentId" value={apt.id} />
                  <select
                    name="status"
                    defaultValue={apt.status}
                    className="min-h-10 rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s === "in_consultation" ? "In consultation" : s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                  <Button type="submit" size="sm" className="min-h-10">
                    Update
                  </Button>
                </form>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
