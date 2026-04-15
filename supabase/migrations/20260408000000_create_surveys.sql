-- Create surveys table for public market-validation responses.
CREATE TABLE IF NOT EXISTS public.surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  clinic_id uuid REFERENCES public.clinics(id),
  respondent_type text NOT NULL CHECK (
    respondent_type IN (
      'clinic_owner',
      'doctor',
      'nurse_staff',
      'patient',
      'customer',
      'general_public'
    )
  ),
  name text,
  email text,
  would_use text NOT NULL CHECK (would_use IN ('yes', 'maybe', 'no')),
  early_access boolean NOT NULL DEFAULT false,
  pain_intensity smallint CHECK (pain_intensity BETWEEN 1 AND 10),
  pricing_preference text CHECK (
    pricing_preference IS NULL OR pricing_preference IN ('monthly_subscription', 'one_time_purchase', 'not_sure')
  ),
  monthly_price_band text CHECK (
    monthly_price_band IS NULL OR monthly_price_band IN ('lt_rm50', 'rm50_100', 'rm100_300', 'rm300_plus')
  ),
  must_have_feature text,
  main_concern text,
  responses jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS surveys_respondent_type_created_at_idx
  ON public.surveys (respondent_type, created_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS surveys_clinic_id_idx
  ON public.surveys (clinic_id)
  WHERE clinic_id IS NOT NULL AND deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS surveys_email_idx
  ON public.surveys (email)
  WHERE email IS NOT NULL AND deleted_at IS NULL;

COMMENT ON TABLE public.surveys IS 'Public survey submissions for product validation and feature prioritization.';
