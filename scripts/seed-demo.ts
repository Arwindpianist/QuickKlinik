/**
 * Demo clinic + one user per role for multi-tenant dev.
 * Run: npm run seed   (uses dotenv -e .env.local)
 * Or: npx dotenv -e .env.local -- tsx scripts/seed-demo.ts
 *
 * Creates:
 * - SuperAdmin: arwin@arwindpianist.com (platform owner, no clinic)
 * - ClinicAdmin: clinic-admin@demo.quickklinik.demo (clinic owner)
 * - Doctor: doctor@demo.quickklinik.demo
 * - Nurse: staff@demo.quickklinik.demo
 * All use the same password (SEED_DEV_PASSWORD or "demo1234"). Set DEV_LOGIN_PASSWORD in .env.local to match for one-click login.
 */
import { createClient } from "@supabase/supabase-js";

const DEMO_CLINIC = {
  display_name: "Sunway Demo Clinic",
  logo_url: null,
  primary_color: "#0ea5e9",
  support_email: "demo@quickklinik.demo",
  custom_domain: null,
};

const DEMO_TENANT = {
  display_name: DEMO_CLINIC.display_name,
  logo_url: DEMO_CLINIC.logo_url,
  primary_color: DEMO_CLINIC.primary_color,
  support_email: DEMO_CLINIC.support_email,
  custom_domain: DEMO_CLINIC.custom_domain,
  tenant_type: "clinic",
  subscription_package: "starter",
  size: "medium",
  features: ["appointments", "otc", "inventory"],
  status: "active",
};

const DEV_PASSWORD = process.env.SEED_DEV_PASSWORD ?? process.env.DEV_LOGIN_PASSWORD ?? "demo1234";

const DEV_USERS = [
  { email: "arwin@arwindpianist.com", roleName: "SuperAdmin", fullName: "Arwin (Platform Owner)", clinicId: null },
  { email: "clinic-admin@demo.quickklinik.demo", roleName: "ClinicAdmin", fullName: "Demo Clinic Admin", clinicId: "clinic" },
  { email: "doctor@demo.quickklinik.demo", roleName: "Doctor", fullName: "Dr. Demo", clinicId: "clinic" },
  { email: "staff@demo.quickklinik.demo", roleName: "Nurse", fullName: "Demo Staff", clinicId: "clinic" },
] as const;

async function seed() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Use .env.local.");
    process.exit(1);
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log("Seeding demo clinic and one user per role...");

  const { data: rolesRows, error: rolesErr } = await supabase
    .from("roles")
    .select("id, name")
    .in("name", ["SuperAdmin", "ClinicAdmin", "Doctor", "Nurse"])
    .is("deleted_at", null);
  if (rolesErr || !rolesRows?.length) {
    console.error("Could not find roles (need SuperAdmin, ClinicAdmin, Doctor, Nurse):", rolesErr);
    process.exit(1);
  }
  const roleIds = Object.fromEntries(rolesRows.map((r) => [r.name, r.id]));

  let clinicId: string | null = null;
  const { data: existingClinic } = await supabase
    .from("clinics")
    .select("id")
    .eq("display_name", DEMO_CLINIC.display_name)
    .limit(1)
    .maybeSingle();
  if (existingClinic) {
    clinicId = existingClinic.id;
    console.log("Demo clinic already exists:", clinicId);
  } else {
    const { data: existingTenant } = await supabase
      .from("tenants")
      .select("id")
      .eq("display_name", DEMO_TENANT.display_name)
      .eq("tenant_type", "clinic")
      .is("deleted_at", null)
      .limit(1)
      .maybeSingle();
    let tenantId: string;
    if (existingTenant) {
      tenantId = existingTenant.id;
      console.log("Demo tenant already exists:", tenantId);
    } else {
      const { data: tenant, error: tenantErr } = await supabase
        .from("tenants")
        .insert(DEMO_TENANT)
        .select("id")
        .single();
      if (tenantErr) {
        console.error("Could not create tenant:", tenantErr);
        process.exit(1);
      }
      tenantId = tenant.id;
      console.log("Created tenant:", tenantId);
    }
    const { data: clinic, error: clinicErr } = await supabase
      .from("clinics")
      .insert({
        tenant_id: tenantId,
        display_name: DEMO_CLINIC.display_name,
        logo_url: DEMO_CLINIC.logo_url,
        primary_color: DEMO_CLINIC.primary_color,
        support_email: DEMO_CLINIC.support_email,
        custom_domain: DEMO_CLINIC.custom_domain,
      })
      .select("id")
      .single();
    if (clinicErr) {
      console.error("Could not create clinic:", clinicErr);
      process.exit(1);
    }
    clinicId = clinic.id;
    console.log("Created clinic:", clinicId);
  }

  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const byEmail = new Map((existingUsers?.users ?? []).map((u) => [u.email ?? "", u]));

  for (const u of DEV_USERS) {
    const roleId = roleIds[u.roleName];
    if (!roleId) {
      console.warn("Skipping", u.email, "- role", u.roleName, "not found");
      continue;
    }
    const resolvedClinicId = u.clinicId === "clinic" ? clinicId : null;
    const existing = byEmail.get(u.email);
    let authUserId: string;
    if (existing) {
      authUserId = existing.id;
      console.log("User exists:", u.email);
    } else {
      const { data: userData, error: userErr } = await supabase.auth.admin.createUser({
        email: u.email,
        password: DEV_PASSWORD,
        email_confirm: true,
      });
      if (userErr) {
        console.error("Could not create user", u.email, userErr);
        continue;
      }
      authUserId = userData.user.id;
      byEmail.set(u.email, userData.user);
      console.log("Created user:", u.email);
    }

    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_user_id", authUserId)
      .maybeSingle();
    if (!existingProfile) {
      const { error: profileErr } = await supabase.from("profiles").insert({
        auth_user_id: authUserId,
        role_id: roleId,
        clinic_id: resolvedClinicId,
        full_name: u.fullName,
        email: u.email,
      });
      if (profileErr) {
        console.error("Could not create profile for", u.email, profileErr);
      } else {
        console.log("Created profile:", u.email, "→", u.roleName);
      }
    }
  }

  await runRestOfSeed(supabase, clinicId!);
}

async function runRestOfSeed(supabase: ReturnType<typeof createClient>, clinicId: string) {
  const { data: existingDoctors } = await supabase.from("doctors").select("id").eq("clinic_id", clinicId).limit(1);
  if (!existingDoctors?.length) {
    await supabase.from("doctors").insert([
      { clinic_id: clinicId, full_name: "Dr. Sarah Lim" },
      { clinic_id: clinicId, full_name: "Dr. Ahmad Hassan" },
    ]);
    console.log("Created demo doctors.");
  }

  const { data: existingRooms } = await supabase.from("rooms").select("id").eq("clinic_id", clinicId).limit(1);
  if (!existingRooms?.length) {
    await supabase.from("rooms").insert([
      { clinic_id: clinicId, name: "Room 1" },
      { clinic_id: clinicId, name: "Room 2" },
    ]);
    console.log("Created demo rooms.");
  }

  const { data: existingPatients } = await supabase.from("patients").select("id").eq("clinic_id", clinicId).limit(1);
  if (!existingPatients?.length) {
    await supabase.from("patients").insert([
      { clinic_id: clinicId, full_name: "Raj Kumar", phone: "+60123456789", email: "raj@example.com" },
      { clinic_id: clinicId, full_name: "Mei Ling", phone: "+60198765432", email: "mei@example.com" },
      { clinic_id: clinicId, full_name: "John Doe", phone: null, email: null },
    ]);
    console.log("Created demo patients.");
  }

  const { data: existingProducts } = await supabase.from("otc_products").select("id").eq("clinic_id", clinicId).limit(1);
  if (!existingProducts?.length) {
    const { data: products } = await supabase
      .from("otc_products")
      .insert([
        { clinic_id: clinicId, name: "Paracetamol 500mg", description: "Pain relief, fever", max_quantity_per_order: 2, requires_disclaimer: true },
        { clinic_id: clinicId, name: "Vitamin C 1000mg", description: "Immune support", max_quantity_per_order: 1, requires_disclaimer: false },
        { clinic_id: clinicId, name: "Antihistamine 10mg", description: "Allergy relief", max_quantity_per_order: 1, requires_disclaimer: true },
      ])
      .select("id");
    if (products?.length) {
      const oneYearLater = new Date();
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
      for (const p of products) {
        await supabase.from("otc_batches").insert({
          otc_product_id: p.id,
          quantity: 100,
          expiry_date: oneYearLater.toISOString().slice(0, 10),
          batch_ref: `BATCH-${p.id.slice(0, 8)}`,
        });
      }
      console.log("Created demo OTC products and batches.");
    }
  }

  console.log("\n--- Dev login ---");
  console.log("Password (all roles):", DEV_PASSWORD);
  console.log("Set DEV_LOGIN_PASSWORD=" + DEV_PASSWORD + " in .env.local for one-click login.");
  console.log("SuperAdmin:   arwin@arwindpianist.com");
  console.log("Clinic Admin: clinic-admin@demo.quickklinik.demo");
  console.log("Doctor:       doctor@demo.quickklinik.demo");
  console.log("Staff (Nurse): staff@demo.quickklinik.demo");
  console.log("----------------\n");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
