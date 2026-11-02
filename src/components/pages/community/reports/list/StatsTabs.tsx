import type { CommunityReportStatus } from "@/data/community-moderation";
import { communityReportStatusLabels, type APICommunityReportsStats } from "@/data/community-reports";
import { cn } from "@/lib/utils";

type StatusTab = CommunityReportStatus | "all";

const TABS: StatusTab[] = ["pending", "resolved", "dismissed", "all"];

function tabLabel(tab: StatusTab): string {
  return tab === "all" ? "Tous" : communityReportStatusLabels[tab];
}

function tabCount(stats: APICommunityReportsStats | null, tab: StatusTab): number | null {
  if (!stats) return null;
  return tab === "all" ? stats.pending + stats.resolved + stats.dismissed : stats[tab];
}

interface ReportStatsTabsProps {
  value: StatusTab;
  stats: APICommunityReportsStats | null;
  onChange: (tab: StatusTab) => void;
}

/** Les compteurs servent aussi d'onglets de statut */
export function ReportStatsTabs({ value, stats, onChange }: ReportStatsTabsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {TABS.map((tab) => {
        const active = value === tab;
        return (
          <button
            key={tab}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(tab)}
            className={cn(
              "rounded-xl border p-4 text-left transition-colors",
              active ? "border-primary/40 bg-primary/5" : "border-border/70 bg-card hover:bg-muted/40"
            )}
          >
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{tabLabel(tab)}</p>
            <p className="mt-1 font-display text-2xl font-semibold">{tabCount(stats, tab) ?? "—"}</p>
          </button>
        );
      })}
    </div>
  );
}