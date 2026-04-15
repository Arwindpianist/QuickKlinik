# QuickKlinik

Clinic appointment and OTC self-dispensary platform. Built with Next.js (App Router), Supabase, and shadcn UI.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment**
   - Copy `.env.example` to `.env.local`
   - Set `NEXT_PUBLIC_SUPABASE_URL` and keys from your [Supabase project](https://supabase.com/dashboard) (Connect dialog or **Settings → API Keys**).
   - **Client**: `NEXT_PUBLIC_SUPABASE_ANON_KEY` — use the anon key or the publishable key (`sb_publishable_...`); publishable is preferred for rotation.
   - **Server only**: `SUPABASE_SERVICE_ROLE_KEY` — use the service_role JWT or a secret key (`sb_secret_...`); never expose this. Secret key is preferred and cannot be used in the browser.
   - With RLS enabled, client access is limited by Postgres roles (`anon`/`authenticated`); the service/secret key bypasses RLS and must only run server-side.

3. **Database**
   - Schema and RLS have been applied via Supabase MCP to the linked project.
   - To create a clinic and first user: use Supabase Dashboard SQL or run seed scripts (e.g. insert into `clinics`, then sign up and link profile to that clinic).

4. **Run**
   ```bash
   npm run dev
   ```
   - Open http://localhost:3000 — landing, login, dashboard (after auth).

**Demo:** Run `npm run seed` to create a demo clinic with a user and sample data. See [DEMO_CREDENTIALS.md](DEMO_CREDENTIALS.md) for login details.

## First iteration scope

- **Auth**: Email sign-in/sign-up, profiles with role + clinic, middleware protection, route/action guards.
- **Appointments**: Create (patient, doctor, time), list, update status; audit log on create/update.
- **OTC catalog**: List products for current clinic (no checkout in this iteration).
- **Inventory**: Add stock (batch + quantity), create batch; audit logged.
- **Dashboard**: Sidebar nav (Appointments, OTC Catalog, Inventory), sign out.

## Roles

- SuperAdmin, ClinicAdmin, Doctor, Nurse, CounterStaff, InventoryStaff  
- Enforced at route, server action, and Supabase RLS.

## Project structure

- `app/` — routes and pages (App Router)
- `components/` — UI (shadcn) and layout (sidebar)
- `lib/` — Supabase client/server/middleware, auth helpers
- `modules/` — domain modules (auth, clinics, appointments, otc, inventory, audit): types, schema, service, actions
- `types/` — generated DB types
