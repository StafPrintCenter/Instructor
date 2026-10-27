import { gradedFilterLabels, type APIInstructorCorrectionStats, type GradedFilter } from "@/data/submissions";
import { cn } from "@/lib/utils";

const TAB_ORDER: GradedFilter[] = ["pending", "graded", "all"];

function tabCount(stats: APIInstructorCorrectionStats | null, graded: GradedFilter): number | null {
  if (!stats) return null;
  if (graded === "all") return stats.total;
  return graded === "pending" ? stats.pending : stats.graded;
}

interface CorrectionStatsTabsProps {
  value: GradedFilter;
  stats: APIInstructorCorrectionStats | null;
  onChange: (graded: GradedFilter) => void;
}

/** Les trois indicateurs servent aussi d'onglets (À corriger / Corrigés / Tous) */
export function CorrectionStatsTabs({ value, stats, onChange }: CorrectionStatsTabsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {TAB_ORDER.map((g) => {
        const active = value === g;
        return (
          <button
            key={g}
            type="button"
            onClick={() => onChange(g)}
            aria-pressed={active}
            className={cn(
              "rounded-xl border p-4 text-left transition-colors",
              active ? "border-primary/40 bg-primary/5" : "border-border/70 bg-card hover:bg-muted/40"
            )}
          >
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{gradedFilterLabels[g]}</p>
            <p className="mt-1 font-display text-2xl font-semibold">{tabCount(stats, g) ?? "—"}</p>
          </button>
        );
      })}
    </div>
  );
}