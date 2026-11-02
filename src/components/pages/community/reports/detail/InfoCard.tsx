import { Card, CardContent } from "@/components/ui/card";
import { communityReportLevelLabels, type APICommunityReportDetail } from "@/data/community-reports";
import { formatDateTime } from "@/lib/date-time";
import { PostAuthor } from "../../shared/PostAuthor";
import { ReportReasonBadge, ReportStatusBadge } from "../shared";

export function ReportInfoCard({ report }: { report: APICommunityReportDetail }) {
  return (
    <Card className="border-border/70">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Signalement</p>
          <ReportStatusBadge status={report.status} />
        </div>

        <ReportReasonBadge reason={report.reason} />

        {report.details ? (
          <p className="whitespace-pre-wrap rounded-lg border border-border/60 bg-muted/20 p-3 text-sm">{report.details}</p>
        ) : (
          <p className="text-xs italic text-muted-foreground">Aucune précision fournie.</p>
        )}

        <PostAuthor author={report.reporter} isMine={false}>
          Signalé le {formatDateTime(report.reportedAt)}
        </PostAuthor>

        <p className="text-xs text-muted-foreground">Traité par : {communityReportLevelLabels[report.level]}</p>
      </CardContent>
    </Card>
  );
}