import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { communityReportTargetTypeLabels, type APICommunityReportDetail } from "@/data/community-reports";
import { PostAuthor } from "../../shared/PostAuthor";
import { ReportTargetLink } from "../shared";

export function ReportTargetCard({ report }: { report: APICommunityReportDetail }) {
  const { target } = report;
  const text = target.body ?? target.excerpt;

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle className="font-display text-lg">Contenu signalé</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className="text-[10px]">{communityReportTargetTypeLabels[target.type]}</Badge>
          {!target.exists ? (
            <Badge variant="outline" className="border-destructive/30 text-[10px] text-destructive">Contenu supprimé</Badge>
          ) : target.status === "hidden" ? (
            <Badge variant="outline" className="border-destructive/30 text-[10px] text-destructive">Masqué</Badge>
          ) : null}
        </div>

        <div className="space-y-1">
          {target.title ? <h3 className="font-display text-lg leading-snug">{target.title}</h3> : null}
          <p className="text-xs text-muted-foreground">
            {[target.trainingTitle, target.category].filter(Boolean).join(" · ")}
          </p>
        </div>

        {target.author ? <PostAuthor author={target.author} isMine={false} /> : null}

        {text ? (
          <p className="whitespace-pre-wrap rounded-lg border border-border/60 bg-muted/20 p-4 text-sm leading-relaxed">{text}</p>
        ) : null}

        {report.reportsOnTarget > 1 ? (
          <p className="text-xs text-muted-foreground">Ce contenu a été signalé {report.reportsOnTarget} fois.</p>
        ) : null}

        <ReportTargetLink target={target} />
      </CardContent>
    </Card>
  );
}