"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Link2, Search, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { SurveyDirectoryEntry } from "@/modules/surveys/service";

type Props = {
  entries: SurveyDirectoryEntry[];
};

const PAGE_SIZE = 40;

export function CardsDirectoryClient({ entries }: Props) {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeUuid, setActiveUuid] = useState<string | null>(entries[0]?.card_uuid ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (!q) return true;
      return getDisplayName(entry).toLowerCase().includes(q);
    });
  }, [entries, query]);

  const visibleEntries = filtered.slice(0, visibleCount);
  const avatarEntries = filtered.slice(0, 16);
  const spotlightEntry = filtered.find((entry) => entry.card_uuid === activeUuid) ?? filtered[0] ?? null;

  useEffect(() => {
    if (!spotlightEntry) return;
    setActiveUuid(spotlightEntry.card_uuid);
  }, [spotlightEntry?.card_uuid]);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-background via-muted/25 to-background p-5 sm:p-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,hsl(var(--primary)/0.2),transparent_36%),radial-gradient(circle_at_82%_12%,hsl(var(--accent)/0.16),transparent_34%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Early contributors wall
            </p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Meet the people shaping QuickKlinik</h2>
            <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
              A living showcase of everyone who contributed feedback. Hover avatars to spotlight a contributor, then
              open their UUID appreciation page.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-primary">
                <Users className="h-3.5 w-3.5" />
                {filtered.length} contributors
              </span>
              <span>Newest first</span>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-background/65 p-4">
            <div className="flex min-h-12 items-center">
              {avatarEntries.map((entry, index) => {
                const displayName = getDisplayName(entry);
                return (
                  <button
                    key={entry.card_uuid}
                    type="button"
                    onMouseEnter={() => setActiveUuid(entry.card_uuid)}
                    onFocus={() => setActiveUuid(entry.card_uuid)}
                    className={cn(
                      "relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-background text-xs font-semibold text-foreground shadow-md transition-transform duration-200 hover:z-20 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      index > 0 && "-ml-3",
                      entry.card_uuid === spotlightEntry?.card_uuid && "z-20 -translate-y-1.5 ring-2 ring-primary/40"
                    )}
                    style={{
                      background: `hsl(var(--primary) / ${Math.max(0.32, 0.58 - index * 0.016)})`,
                    }}
                    aria-label={`Highlight ${displayName}`}
                  >
                    {getInitials(displayName)}
                  </button>
                );
              })}
              {filtered.length > avatarEntries.length ? (
                <span className="-ml-3 inline-flex h-11 w-11 items-center justify-center rounded-full border border-background bg-muted text-xs font-semibold text-muted-foreground">
                  +{filtered.length - avatarEntries.length}
                </span>
              ) : null}
            </div>

            {spotlightEntry ? (
              <div className="mt-4 rounded-lg border border-border/60 bg-muted/25 p-3">
                <p className="text-sm font-medium text-foreground">{getDisplayName(spotlightEntry)}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Button asChild size="sm" className="h-8 rounded-full px-4">
                    <Link href={`/cards/${spotlightEntry.card_uuid}`}>Open UUID Page</Link>
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder="Search by name..."
            className="min-h-11 bg-background/70 pl-9"
          />
        </div>
      </section>

      {visibleEntries.length === 0 ? (
        <section className="rounded-xl border border-border/70 bg-background/60 px-4 py-8 text-sm text-muted-foreground">
          No contributors match your filters yet.
        </section>
      ) : (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visibleEntries.map((entry, index) => {
            const href = `/cards/${entry.card_uuid}`;
            const displayName = getDisplayName(entry);
            return (
              <article
                key={entry.id}
                className="group rounded-xl border border-border/70 bg-background/65 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-foreground"
                      style={{
                        background: `hsl(var(--primary) / ${Math.max(0.25, 0.62 - (index % 12) * 0.03)})`,
                      }}
                    >
                      {getInitials(displayName)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{displayName}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Button asChild size="sm" className="h-8 rounded-full px-4">
                    <Link href={href}>
                      <Link2 className="mr-1.5 h-3.5 w-3.5" />
                      View Page
                    </Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {visibleCount < filtered.length ? (
        <div className="flex justify-center">
          <Button type="button" variant="outline" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
            Load more contributors
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function getInitials(value: string): string {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "NA";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

function getDisplayName(entry: SurveyDirectoryEntry): string {
  const name = entry.name?.trim();
  if (name) return name;
  return `Contributor ${entry.card_uuid.slice(0, 6)}`;
}

function humanize(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
