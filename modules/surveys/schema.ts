import { z } from "zod";
import {
  MONTHLY_PRICE_BANDS,
  PRICING_PREFERENCES,
  RESPONDENT_TYPES,
  WOULD_USE_OPTIONS,
} from "@/modules/surveys/constants";

const branchResponsesSchema = z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]));

export const createSurveySchema = z.object({
  respondentType: z.enum(RESPONDENT_TYPES),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  wouldUse: z.enum(WOULD_USE_OPTIONS),
  earlyAccess: z.boolean().default(false),
  painIntensity: z.number().int().min(1).max(10).optional(),
  pricingPreference: z.enum(PRICING_PREFERENCES).optional(),
  monthlyPriceBand: z.enum(MONTHLY_PRICE_BANDS).optional(),
  mustHaveFeature: z.string().trim().min(2).max(500),
  mainConcern: z.string().trim().min(2).max(500),
  responses: branchResponsesSchema,
});

export type CreateSurveyInput = z.infer<typeof createSurveySchema>;
