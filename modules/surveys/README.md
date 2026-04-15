# Surveys Module

## Purpose
Collect public market-validation feedback from multiple respondent personas through `/survey` and persist structured responses to `public.surveys`.

## Data Flow
1. `app/survey/SurveyForm.tsx` renders a one-question-per-step persona flow.
2. Form submits to `submitSurvey` in `modules/surveys/actions.ts`.
3. `actions.ts` validates payload using `createSurveySchema` from `modules/surveys/schema.ts`.
4. `modules/surveys/service.ts` inserts normalized data into `public.surveys`.
5. `modules/audit/service.ts` records `survey.submit` audit entry.

## Branch Mapping
- `clinic_owner`: operations, OTC, pricing, and adoption barriers.
- `doctor`: workflow pain, queue impact, OTC safety/trust.
- `nurse_staff`: workload pain and feature value.
- `patient` / `customer`: visit behavior, pain points, trust signals.
- `general_public`: wait-time awareness, interest, willingness to pay.

## Payload Shape
- Structured columns:
  - `respondent_type`, `name`, `email`, `would_use`, `early_access`
  - `pain_intensity`, `pricing_preference`, `monthly_price_band`
  - `must_have_feature`, `main_concern`
- Full branch-specific details in `responses` (`jsonb`).

## Security Notes
- `/survey` is public, but all business validation is server-side.
- Hidden honeypot field (`website`) is used as basic bot filtering.
- No client-derived data is trusted without schema validation.
