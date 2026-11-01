import {
  COMMUNITY_REPORT_REASONS,
  communityReportReasonHints,
  communityReportReasonLabels,
  type CommunityReportReason,
} from "@/data/community-moderation";
import { cn } from "@/lib/utils";

interface ReportReasonOptionsProps {
  value: CommunityReportReason | null;
  onChange: (reason: CommunityReportReason) => void;
}

export function ReportReasonOptions({ value, onChange }: ReportReasonOptionsProps) {
  return (
    <div role="radiogroup" aria-label="Motif du signalement" className="space-y-2">
      {COMMUNITY_REPORT_REASONS.map((reason) => (
        <label
          key={reason}
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
            value === reason ? "border-primary/50 bg-primary/5" : "border-border/60 hover:bg-muted/40"
          )}
        >
          <input
            type="radio"
            name="report-reason"
            value={reason}
            checked={value === reason}
            onChange={() => onChange(reason)}
            className="mt-1"
          />
          <span>
            <span className="block text-sm font-medium">{communityReportReasonLabels[reason]}</span>
            <span className="block text-xs text-muted-foreground">{communityReportReasonHints[reason]}</span>
          </span>
        </label>
      ))}
    </div>
  );
}