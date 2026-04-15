-- Add tenants table and link clinics to tenants (1:1 for type=clinic).
-- Run after existing clinics/roles/profiles migrations.

-- 1. Create tenants table (with temporary column for backfill)
CREATE TABLE IF NOT EXISTS public.tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  display_name text NOT NULL,
  logo_url text,
  primary_color text,
  support_email text,
  custom_domain text,
  tenant_type text NOT NULL DEFAULT 'clinic',
  subscription_package text,
  size text,
  features jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'active'
);

-- 2. Add tenant_id to clinics (nullable first for backfill)
ALTER TABLE public.clinics
  ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES public.tenants(id);

-- 3. Backfill: one tenant per existing clinic (link by clinic id)
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS migration_clinic_id uuid;

INSERT INTO public.tenants (
  created_at,
  updated_at,
  display_name,
  logo_url,
  primary_color,
  support_email,
  custom_domain,
  tenant_type,
  subscription_package,
  size,
  features,
  status,
  migration_clinic_id
)
SELECT
  c.created_at,
  c.updated_at,
  c.display_name,
  c.logo_url,
  c.primary_color,
  c.support_email,
  c.custom_domain,
  'clinic',
  'starter',
  'medium',
  '["appointments", "otc", "inventory"]'::jsonb,
  'active',
  c.id
FROM public.clinics c
WHERE c.deleted_at IS NULL
  AND c.tenant_id IS NULL;

UPDATE public.clinics c
SET tenant_id = (SELECT t.id FROM public.tenants t WHERE t.migration_clinic_id = c.id LIMIT 1)
WHERE c.deleted_at IS NULL AND c.tenant_id IS NULL;

ALTER TABLE public.tenants DROP COLUMN IF EXISTS migration_clinic_id;

-- 4. Make tenant_id NOT NULL and UNIQUE (one clinic per tenant for type=clinic)
ALTER TABLE public.clinics
  ALTER COLUMN tenant_id SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS clinics_tenant_id_key ON public.clinics(tenant_id);

-- 5. Index for tenant list filters
CREATE INDEX IF NOT EXISTS tenants_tenant_type_idx ON public.tenants(tenant_type) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS tenants_status_idx ON public.tenants(status) WHERE deleted_at IS NULL;

COMMENT ON TABLE public.tenants IS 'Top-level tenant entity (clinic, hospital, etc.). Clinics link via tenant_id.';
