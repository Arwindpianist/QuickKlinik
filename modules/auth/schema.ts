import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password required"),
});

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(1).optional(),
  roleName: z.enum(["SuperAdmin", "ClinicAdmin", "Doctor", "Nurse", "CounterStaff", "InventoryStaff"]).optional(),
  clinicId: z.string().uuid().optional().nullable(),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
