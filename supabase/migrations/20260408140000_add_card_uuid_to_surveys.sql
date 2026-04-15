ALTER TABLE public.surveys
  ADD COLUMN IF NOT EXISTS card_uuid uuid NOT NULL DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX IF NOT EXISTS surveys_card_uuid_key
  ON public.surveys(card_uuid);
