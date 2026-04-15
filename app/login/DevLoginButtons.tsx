"use client";

import { useTransition } from "react";
import { signInAsDevUser } from "@/modules/auth/actions";
import { Button } from "@/components/ui/button";
import { Shield, Building2, Stethoscope, UserCog } from "lucide-react";

const DEV_ROLES: { key: string; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "superadmin", label: "SuperAdmin", description: "Platform owner", icon: Shield },
  { key: "clinicadmin", label: "Clinic Admin", description: "Clinic owner", icon: Building2 },
  { key: "doctor", label: "Doctor", description: "Clinic doctor", icon: Stethoscope },
  { key: "staff", label: "Staff", description: "Nurse / counter", icon: UserCog },
];

export function DevLoginButtons() {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-800 dark:bg-amber-950/20">
      <p className="text-xs font-medium text-amber-800 dark:text-amber-200">Dev: one-click login</p>
      <div className="grid grid-cols-2 gap-2">
        {DEV_ROLES.map(({ key, label, description, icon: Icon }) => (
          <Button
            key={key}
            type="button"
            variant="outline"
            size="sm"
            className="h-auto flex-col items-start gap-0.5 py-2 text-left"
            disabled={isPending}
            onClick={() => {
              startTransition(() => {
                signInAsDevUser(key);
              });
            }}
          >
            <Icon className="mb-0.5 size-3.5 opacity-70" />
            <span className="font-medium">{label}</span>
            <span className="text-xs font-normal text-muted-foreground">{description}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
