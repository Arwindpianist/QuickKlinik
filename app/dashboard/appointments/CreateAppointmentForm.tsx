import { createAppointment } from "@/modules/appointments/actions";
import { Button } from "@/components/ui/button";

type Doctor = { id: string; full_name: string };
type Patient = { id: string; full_name: string; phone?: string | null; email?: string | null };

export function CreateAppointmentForm({
  doctors,
  patients,
  clinicId,
}: {
  doctors: Doctor[];
  patients: Patient[];
  clinicId: string;
}) {
  return (
    <form
      action={createAppointment}
      className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:flex-wrap sm:items-end"
    >
      <input type="hidden" name="clinicId" value={clinicId} />
      <div className="flex flex-1 flex-col gap-2">
        <label htmlFor="patientId" className="text-sm font-medium">
          Patient
        </label>
        <select
          id="patientId"
          name="patientId"
          required
          className="min-h-11 rounded-md border border-input bg-background px-3 py-2 text-foreground"
        >
          <option value="">Select patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.full_name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <label htmlFor="doctorId" className="text-sm font-medium">
          Doctor
        </label>
        <select
          id="doctorId"
          name="doctorId"
          required
          className="min-h-11 rounded-md border border-input bg-background px-3 py-2 text-foreground"
        >
          <option value="">Select doctor</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.full_name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <label htmlFor="scheduledAt" className="text-sm font-medium">
          Date & time
        </label>
        <input
          id="scheduledAt"
          name="scheduledAt"
          type="datetime-local"
          required
          className="min-h-11 rounded-md border border-input bg-background px-3 py-2 text-foreground"
        />
      </div>
      <Button type="submit" className="min-h-11 w-full sm:w-auto">
        Create appointment
      </Button>
    </form>
  );
}
