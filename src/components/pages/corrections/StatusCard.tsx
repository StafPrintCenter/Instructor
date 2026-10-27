// src/components/pages/corrections/CorrectionStatusCard.tsx
import { InstructorSubmissionBadge } from "@/components/instructor/status-badges";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { lessonKindLabels } from "@/data/content";
import type { APIInstructorSubmissionDetail } from "@/data/submissions";
import { formatDateTime } from "@/lib/date-time";

export function CorrectionStatusCard({ detail: d }: { detail: APIInstructorSubmissionDetail }) {
  return (
    <Card className="border-border/70">
      <CardContent className="space-y-2 p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Statut</p>
        <InstructorSubmissionBadge status={d.status} />
        <p className="text-xs text-muted-foreground">Déposé le {formatDateTime(d.submittedAt)}</p>
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <Badge variant="secondary" className="text-[10px]">
            {lessonKindLabels[d.lesson.kind] ?? d.lesson.kind}
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            {d.lesson.isMandatory ? "Obligatoire" : "Facultatif"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}