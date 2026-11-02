import { Link } from "@tanstack/react-router";
import { ClipboardCheck, CornerDownRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  communityReportTargetTypeLabels,
  getCommunityReportResolutionLabel,
  type APICommunityReport,
} from "@/data/community-reports";
import { relativeTime } from "@/lib/date-time";
import { ReportReasonBadge, ReportStatusBadge } from "../shared";

export function ReportCard({ report }: { report: APICommunityReport }) {
  const { target } = report;
  const heading =
    target.title ??
    (target.type === "comment" ? `Commentaire de ${target.author?.name ?? "un membre"}` : "Publication supprimée");
  const isPending = report.status === "pending";

  return (
    <Card className="border-border/70 transition-shadow hover:shadow-md">
      <CardContent className="space-y-3 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <ReportStatusBadge status={report.status} />
            <ReportReasonBadge reason={report.reason} />
            <Badge variant="outline" className="text-[10px]">{communityReportTargetTypeLabels[target.type]}</Badge>
            {!target.exists ? (
              <Badge variant="outline" className="border-destructive/30 text-[10px] text-destructive">Contenu supprimé</Badge>
            ) : target.status === "hidden" ? (
              <Badge variant="outline" className="border-destructive/30 text-[10px] text-destructive">Masqué</Badge>
            ) : null}
          </div>
          <span className="text-xs text-muted-foreground">{relativeTime(report.reportedAt)}</span>
        </div>

        <div className="space-y-1">
          <h2 className="font-display text-lg leading-snug">
            <Link to="/community/reports/$id" params={{ id: report.id }} className="hover:underline">
              {heading}
            </Link>
          </h2>
          {target.excerpt ? <p className="line-clamp-2 text-sm text-muted-foreground">{target.excerpt}</p> : null}
          <p className="text-xs text-muted-foreground">
            {[target.trainingTitle, target.category].filter(Boolean).join(" · ")}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
          <span>
            Signalé par <span className="font-medium text-foreground">{report.reporter.name}</span>
          </span>
          {target.author ? (
            <span>
              Auteur du contenu : <span className="font-medium text-foreground">{target.author.name}</span>
            </span>
          ) : null}
        </div>

        {report.details ? (
          <p className="line-clamp-2 rounded-lg border border-border/60 bg-muted/20 p-2.5 text-xs text-muted-foreground">
            « {report.details} »
          </p>
        ) : null}

        {report.resolution ? (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CornerDownRight className="size-3.5" />
            {getCommunityReportResolutionLabel(report.resolution.action)}
            {report.resolution.by ? ` par ${report.resolution.by.name}` : ""} · {relativeTime(report.resolution.at)}
          </p>
        ) : null}

        <div className="flex justify-end border-t border-border/40 pt-3">
          <Button asChild size="sm" variant={isPending ? "accent" : "soft"}>
            <Link to="/community/reports/$id" params={{ id: report.id }}>
              <ClipboardCheck className="size-4" /> {isPending ? "Examiner" : "Voir"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}