import { Card, CardContent } from "@/components/ui/card";
import { getCommunityReportResolutionLabel, type APICommunityReportDetail } from "@/data/community-reports";
import { formatDateTime } from "@/lib/date-time";

/** Issue du signalement : décision prise, ou transmission aux administrateurs */
export function ReportOutcomeCard({ report }: { report: APICommunityReportDetail }) {
  const { resolution, escalation } = report;
  if (!resolution && !escalation) return null;

  return (
    <Card className="border-border/70">
      <CardContent className="space-y-4 p-5">
        {resolution ? (
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Décision</p>
            <p className="text-sm font-medium">{getCommunityReportResolutionLabel(resolution.action)}</p>
            <p className="text-xs text-muted-foreground">
              {resolution.by ? `Par ${resolution.by.name} · ` : ""}
              {formatDateTime(resolution.at)}
            </p>
            {resolution.note ? (
              <p className="whitespace-pre-wrap rounded-lg border border-border/60 bg-muted/20 p-3 text-sm">{resolution.note}</p>
            ) : null}
          </div>
        ) : null}

        {escalation ? (
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Transmis aux administrateurs</p>
            <p className="text-xs text-muted-foreground">{formatDateTime(escalation.at)}</p>
            <p className="whitespace-pre-wrap rounded-lg border border-border/60 bg-muted/20 p-3 text-sm">{escalation.note}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}