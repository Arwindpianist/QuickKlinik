-- Expand surveys pricing options to match latest questionnaire dataset.
ALTER TABLE public.surveys
  DROP CONSTRAINT IF EXISTS surveys_pricing_preference_check;

ALTER TABLE public.surveys
  ADD CONSTRAINT surveys_pricing_preference_check
  CHECK (
    pricing_preference IS NULL
    OR pricing_preference IN ('monthly_subscription', 'one_time_purchase', 'pay_per_use', 'not_sure')
  );

ALTER TABLE public.surveys
  DROP CONSTRAINT IF EXISTS surveys_monthly_price_band_check;

ALTER TABLE public.surveys
  ADD CONSTRAINT surveys_monthly_price_band_check
  CHECK (
    monthly_price_band IS NULL
    OR monthly_price_band IN ('lt_rm50', 'rm50_100', 'rm100_300', 'rm300_500', 'gt_rm500')
  );
