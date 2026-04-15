"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { checkSurveyDuplicatePair, submitSurvey } from "@/modules/surveys/actions";
import { QUICKKLINIK_SURVEY_DATASET, type SurveyCondition, type SurveyQuestion } from "@/modules/surveys/dataset";

type Props = { submitted: boolean; serverError: string | null };
type AnswerValue = string | string[] | Record<string, string>;
type Answers = Record<string, AnswerValue>;
const INTRO_IDS = ["contact_name", "contact_info"];

export function SurveyFlow({ submitted, serverError }: Props) {
  const [answers, setAnswers] = useState<Answers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showValidation, setShowValidation] = useState(false);
  const [duplicateCardUuid, setDuplicateCardUuid] = useState<string | null>(null);
  const [duplicateCheckError, setDuplicateCheckError] = useState<string | null>(null);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const questions = useMemo(() => QUICKKLINIK_SURVEY_DATASET.flatMap((section) => section.questions), []);
  const introQuestions = useMemo(
    () => INTRO_IDS.map((id) => questions.find((q) => q.id === id)).filter(Boolean) as SurveyQuestion[],
    [questions],
  );
  const mainQuestions = useMemo(() => questions.filter((q) => !INTRO_IDS.includes(q.id)), [questions]);

  const eligibleQuestions = useMemo(() => {
    return [
      ...introQuestions,
      ...mainQuestions.filter((question) => isConditionMet(question.condition, answers)),
    ];
  }, [answers, introQuestions, mainQuestions]);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, Math.max(eligibleQuestions.length - 1, 0)));
  }, [eligibleQuestions.length]);
  useEffect(() => {
    setShowValidation(false);
  }, [currentIndex]);

  const answeredCount = eligibleQuestions.filter((question) => isAnswered(question, answers[question.id])).length;
  const totalForPath = Math.max(eligibleQuestions.length, 1);
  const progress =
    totalForPath <= 1
      ? 0
      : Math.min(100, Math.max(0, Math.round((currentIndex / (totalForPath - 1)) * 100)));
  const allAnswered = eligibleQuestions.length > 0 && answeredCount === eligibleQuestions.length;
  const currentQuestion = eligibleQuestions[currentIndex];

  if (submitted) return <div className="py-10 text-center">Thanks for your feedback.</div>;
  if (!currentQuestion) return null;

  const isLast = currentIndex === eligibleQuestions.length - 1;
  const currentError = getQuestionError(currentQuestion, answers[currentQuestion.id]);
  const canMoveNext = !currentError && !isCheckingDuplicate;
  const goNext = async (force = false) => {
    if (!force && !canMoveNext) return;
    if (!force && currentError) {
      setShowValidation(true);
      return;
    }

    if (!force && currentQuestion.id === "contact_info") {
      const normalizedName = normalizeIdentity(asText(answers.contact_name));
      const normalizedEmail = normalizeIdentity(asText(answers.contact_info)).toLowerCase();
      if (normalizedName && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        setIsCheckingDuplicate(true);
        setDuplicateCheckError(null);
        const duplicate = await checkSurveyDuplicatePair({
          name: normalizedName,
          email: normalizedEmail,
        });
        setIsCheckingDuplicate(false);

        if (duplicate.error) {
          setDuplicateCheckError("We could not verify duplicate entries. You can continue for now.");
        } else {
          setDuplicateCheckError(null);
        }

        if (duplicate.exists && duplicate.cardUuid) {
          setDuplicateCardUuid(duplicate.cardUuid);
          setShowValidation(true);
          return;
        }
        setDuplicateCardUuid(null);
      }
    }

    setCurrentIndex((prev) => Math.min(prev + 1, eligibleQuestions.length - 1));
  };

  return (
    <form
      action={submitSurvey}
      className="pb-[max(5rem,env(safe-area-inset-bottom))]"
      onKeyDown={(event) => {
        if (event.key !== "Enter" || event.shiftKey) return;
        const target = event.target as HTMLElement;
        if (target.tagName === "TEXTAREA") return;
        if (isLast) return;
        event.preventDefault();
        void goNext();
      }}
    >
      <div className="sticky top-14 z-20 mb-8 py-3 sm:top-16">
        <div className="rounded-xl border border-border/50 bg-background/35 px-3 py-2 backdrop-blur-sm">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>{answeredCount} answered</span>
            <span>{progress}% complete</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-foreground/30 ring-1 ring-foreground/20">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, color-mix(in srgb, var(--survey-progress-start) 70%, #3b2f45), var(--survey-progress-end))",
                boxShadow: "0 0 14px color-mix(in srgb, var(--survey-progress-start) 85%, transparent)",
              }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div key={currentQuestion.id} className="space-y-5 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-300">
          <p className="text-xs uppercase tracking-[0.18em] text-primary/80">
            Question {currentIndex + 1} of {eligibleQuestions.length}
          </p>
          <h3 className="max-w-3xl text-2xl font-semibold leading-tight sm:text-3xl lg:text-4xl">
            {personalizeQuestion(currentQuestion, answers)}
          </h3>
          <QuestionInput
            question={currentQuestion}
            value={answers[currentQuestion.id]}
            autoFocusText={currentQuestion.type === "text"}
            onChange={(value) => {
              setShowValidation(false);
              if (currentQuestion.id === "contact_name" || currentQuestion.id === "contact_info" || currentQuestion.id === "role") {
                setDuplicateCardUuid(null);
                setDuplicateCheckError(null);
              }
              setAnswers((prev) => {
                if (currentQuestion.id === "role") {
                  return {
                    contact_name: prev.contact_name,
                    contact_info: prev.contact_info,
                    role: value,
                  };
                }
                return { ...prev, [currentQuestion.id]: value };
              });
              if (currentQuestion.type === "single_choice" && currentIndex < eligibleQuestions.length - 1) {
                setTimeout(() => {
                  void goNext(true);
                }, 160);
              }
            }}
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button type="button" variant="ghost" disabled={currentIndex === 0} onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}>
            Back
          </Button>
          {!isLast ? (
            <Button type="button" disabled={!canMoveNext} className="rounded-full px-6" onClick={() => void goNext()}>
              {isCheckingDuplicate ? "Checking identity..." : "Next"}
            </Button>
          ) : null}
        </div>
        {isCheckingDuplicate ? (
          <div className="rounded-xl border border-border/70 bg-muted/25 p-4">
            <p className="text-sm font-medium text-foreground">Matching your details with existing UUID pages...</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Give us a moment while we look up your dedicated QuickKlinik page.
            </p>
            <div className="mt-3 space-y-2">
              <div className="h-2.5 w-full animate-pulse rounded-full bg-primary/25" />
              <div className="h-2.5 w-4/5 animate-pulse rounded-full bg-accent/20" />
              <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-secondary/25" />
            </div>
          </div>
        ) : null}
        {showValidation && currentError ? (
          <p className="text-sm text-destructive">{currentError}</p>
        ) : null}
        {duplicateCheckError ? <p className="text-sm text-amber-700">{duplicateCheckError}</p> : null}
        {duplicateCardUuid ? (
          <div className="rounded-xl border border-primary/35 bg-primary/10 p-4">
            <p className="text-sm font-medium text-foreground">
              This name and email pair has already been used.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Open your existing dedicated page instead of submitting another response.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button asChild size="sm" className="rounded-full px-5">
                <Link href={`/cards/${duplicateCardUuid}`}>Go to existing UUID page</Link>
              </Button>
              <p className="text-xs text-muted-foreground">Use a different email if you need a new submission.</p>
            </div>
          </div>
        ) : null}
      </div>

      {isLast && allAnswered && (
        <div className="sticky bottom-[max(0.5rem,env(safe-area-inset-bottom))] mt-10 rounded-xl border border-border/60 bg-background/80 px-3 py-2 backdrop-blur">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">All questions completed.</p>
            <Button type="submit" className="min-h-11 w-full rounded-full px-7 sm:w-auto">
              Finish Survey
            </Button>
          </div>
        </div>
      )}
      {serverError && <p className="mt-4 text-sm text-destructive">{serverError}</p>}

      <input type="hidden" name="respondentType" value={mapRoleToValue(answers.role)} />
      <input type="hidden" name="wouldUse" value={mapOverallInterestToValue(answers.overall_interest)} />
      <input type="hidden" name="mustHaveFeature" value={asText(answers.must_have_feature)} />
      <input type="hidden" name="mainConcern" value={asText(answers.main_concern)} />
      <input type="hidden" name="name" value={asText(answers.contact_name)} />
      <input type="hidden" name="email" value={asText(answers.contact_info)} />
      <input type="hidden" name="earlyAccess" value={asText(answers.early_access) === "Yes" ? "true" : "false"} />
      <input type="hidden" name="painIntensity" value={normalizedPainIntensity(answers.owner_queue_severity)} />
      <input type="hidden" name="pricingPreference" value={mapPricingToValue(answers.owner_pricing_model)} />
      <input type="hidden" name="monthlyPriceBand" value={mapBudgetToValue(answers.owner_monthly_budget)} />
      <input type="hidden" name="responses" value={JSON.stringify(answers)} />
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
    </form>
  );
}

function QuestionInput({
  question,
  value,
  onChange,
  autoFocusText,
}: {
  question: SurveyQuestion;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  autoFocusText?: boolean;
}) {
  if (question.type === "single_choice") {
    const current = typeof value === "string" ? value : "";
    return <div className="flex flex-wrap gap-2.5">{(question.options ?? []).map((option) => <button key={option} type="button" onClick={() => onChange(option)} className={`min-h-11 rounded-full border px-5 py-2.5 text-sm transition-all duration-200 active:scale-[0.98] hover:-translate-y-0.5 ${current === option ? "border-primary bg-primary text-primary-foreground shadow-md ring-2 ring-primary/30" : "border-input bg-card text-foreground hover:bg-accent/45"}`}>{option}</button>)}</div>;
  }
  if (question.type === "multiple_choice") {
    const current = Array.isArray(value) ? value : [];
    const maxSelections = question.maxSelections ?? null;
    const atLimit = typeof maxSelections === "number" && current.length >= maxSelections;
    return (
      <div className="space-y-2.5">
        <div className="grid gap-2.5">
          {(question.options ?? []).map((option) => {
            const active = current.includes(option);
            const blocked = !active && atLimit;
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  if (blocked) return;
                  onChange(active ? current.filter((x) => x !== option) : [...current, option]);
                }}
                disabled={blocked}
                className={`flex min-h-11 items-center justify-between rounded-2xl px-4 py-2.5 text-left text-sm transition-all duration-200 active:scale-[0.99] hover:-translate-y-0.5 ${
                  active
                    ? "border border-primary/40 bg-primary/22 ring-2 ring-primary/30 shadow-sm"
                    : blocked
                      ? "cursor-not-allowed border border-input bg-muted/35 opacity-55"
                      : "border border-input bg-card hover:bg-accent/40"
                }`}
              >
                <span>{option}</span>
                <span className={`h-5 w-5 rounded-full transition-colors ${active ? "bg-primary/70" : "bg-foreground/20"}`} />
              </button>
            );
          })}
        </div>
        {typeof maxSelections === "number" ? (
          <p className="text-xs text-muted-foreground">
            Selected {current.length}/{maxSelections}
          </p>
        ) : null}
      </div>
    );
  }
  if (question.type === "number_rating") {
    const min = question.min ?? 1;
    const max = question.max ?? 10;
    const midpoint = (min + max) / 2;
    const current = Number(typeof value === "string" ? value : String(midpoint));
    return (
      <div className="space-y-3">
        <Slider
          min={min}
          max={max}
          step={0.1}
          value={[current]}
          onValueChange={(vals) => onChange(String(vals[0] ?? min))}
          className="py-2"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Low ({min})</span>
          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-sm text-foreground">
            Current: {current.toFixed(1)} / {max}
          </span>
          <span>High ({max})</span>
        </div>
      </div>
    );
  }
  if (question.type === "matrix_rating") {
    const current = typeof value === "object" && value !== null && !Array.isArray(value) ? (value as Record<string, string>) : {};
    const items = question.items ?? [];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>1 = Not useful</span>
          <span>5 = Very useful</span>
        </div>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item} className="space-y-2 border-b border-border/40 pb-4 last:border-b-0">
              <p className="text-sm font-medium text-foreground/90">{item}</p>
              <div className="flex justify-center">
                <div className="inline-flex rounded-full border border-input bg-card p-1">
                  {["1", "2", "3", "4", "5"].map((n) => {
                    const active = current[item] === n;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => onChange({ ...current, [item]: n })}
                        className={`h-9 w-10 rounded-full text-sm transition-all duration-200 ${
                          active
                            ? "border border-primary bg-primary text-primary-foreground shadow-md ring-2 ring-primary/35"
                            : "border border-input bg-card text-foreground/90 hover:bg-accent/45"
                        }`}
                        aria-label={`${item} rating ${n}`}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  const text = typeof value === "string" ? value : "";
  if (question.id === "contact_name") {
    return (
      <div className="space-y-2">
        <Label htmlFor={question.id}>Required</Label>
        <Input
          id={question.id}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Your name"
          autoFocus={autoFocusText}
          className="border-input bg-card"
        />
      </div>
    );
  }
  if (question.id === "contact_info") {
    return (
      <div className="space-y-2">
        <Label htmlFor={question.id}>Required</Label>
        <Input
          id={question.id}
          type="email"
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder="name@email.com"
          inputMode="email"
          autoComplete="email"
          autoFocus={autoFocusText}
          className="border-input bg-card"
        />
      </div>
    );
  }
  return <textarea rows={3} value={text} onChange={(e) => onChange(e.target.value)} autoFocus={autoFocusText} className="min-h-28 w-full resize-y rounded-2xl border border-input bg-card px-4 py-3 text-sm outline-none ring-1 ring-transparent transition focus:bg-background focus:ring-primary/35" />;
}

function isConditionMet(condition: SurveyCondition | undefined, answers: Answers): boolean {
  if (!condition) return true;
  return condition.all.every((rule) => typeof answers[rule.questionId] === "string" && answers[rule.questionId] === rule.equals);
}
function isAnswered(question: SurveyQuestion, value: AnswerValue | undefined): boolean {
  if (question.type === "single_choice" || question.type === "number_rating") return typeof value === "string" && value.trim().length > 0;
  if (question.id === "contact_name") return typeof value === "string" && value.trim().length >= 2;
  if (question.id === "contact_info") return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  if (question.type === "text") return typeof value === "string" && value.trim().length > 1;
  if (question.type === "multiple_choice") return Array.isArray(value) && value.length > 0;
  const map = typeof value === "object" && value !== null && !Array.isArray(value) ? (value as Record<string, string>) : {};
  return Object.keys(map).length >= (question.items?.length ?? 0);
}
function getQuestionError(question: SurveyQuestion, value: AnswerValue | undefined): string | null {
  if (question.id === "contact_name") {
    return typeof value === "string" && value.trim().length >= 2
      ? null
      : "Please enter your name (at least 2 characters).";
  }
  if (question.id === "contact_info") {
    return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
      ? null
      : "Please enter a valid email address.";
  }
  if (question.type === "text") {
    return typeof value === "string" && value.trim().length > 1
      ? null
      : "Please provide a bit more detail before continuing.";
  }
  if (question.type === "single_choice" || question.type === "number_rating") {
    return typeof value === "string" && value.trim().length > 0
      ? null
      : "Please select an answer to continue.";
  }
  if (question.type === "multiple_choice") {
    const arr = Array.isArray(value) ? value : [];
    if (arr.length === 0) return "Please choose at least one option.";
    if (typeof question.maxSelections === "number" && arr.length > question.maxSelections) {
      return `Please select up to ${question.maxSelections} options.`;
    }
    return null;
  }
  if (question.type === "matrix_rating") {
    const map = typeof value === "object" && value !== null && !Array.isArray(value) ? (value as Record<string, string>) : {};
    const total = question.items?.length ?? 0;
    return Object.keys(map).length >= total
      ? null
      : "Please rate each item before continuing.";
  }
  return null;
}
function asText(value: AnswerValue | undefined): string { return typeof value === "string" ? value : ""; }
function mapRoleToValue(value: AnswerValue | undefined): string { const v = asText(value); if (v === "Clinic Owner / Manager") return "clinic_owner"; if (v === "Doctor") return "doctor"; if (v === "Nurse / Clinic Staff") return "nurse_staff"; if (v === "Patient / Customer") return "patient"; return "general_public"; }
function mapOverallInterestToValue(value: AnswerValue | undefined): string { const v = asText(value); if (v === "Yes") return "yes"; if (v === "No") return "no"; return "maybe"; }
function mapPricingToValue(value: AnswerValue | undefined): string { const v = asText(value); if (v === "Monthly subscription") return "monthly_subscription"; if (v === "One-time purchase") return "one_time_purchase"; if (v === "Pay per use") return "pay_per_use"; if (v === "Not sure") return "not_sure"; return ""; }
function mapBudgetToValue(value: AnswerValue | undefined): string { const v = asText(value); if (v === "Below RM50") return "lt_rm50"; if (v === "RM50 - RM100") return "rm50_100"; if (v === "RM100 - RM300") return "rm100_300"; if (v === "RM300 - RM500") return "rm300_500"; if (v === "Above RM500") return "gt_rm500"; return ""; }
function normalizedPainIntensity(value: AnswerValue | undefined): string {
  const raw = asText(value).trim();
  if (!raw) return "";
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return "";
  return String(Math.min(10, Math.max(1, Math.round(parsed))));
}
function personalizeQuestion(question: SurveyQuestion, answers: Answers): string {
  if (question.id === "contact_name" || question.id === "contact_info") return question.question;
  const rawName = asText(answers.contact_name).trim();
  if (!rawName) return question.question;
  const firstName = rawName.split(/\s+/)[0];
  return `${firstName}, ${question.question}`;
}

function normalizeIdentity(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}
