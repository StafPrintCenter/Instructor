import { Link } from "@tanstack/react-router";
import { ClipboardCheck, FileText, Paperclip } from "lucide-react";
import { InstructorSubmissionBadge } from "@/components/shared/status-badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { lessonKindLabels } from "@/data/content";
import type { APIInstructorCorrectionListItem } from "@/data/submissions";
import { formatDateTime } from "@/lib/date-time";

export function CorrectionListItem({ item: s }: { item: APIInstructorCorrectionListItem }) {
  return (
    <Card className="border-border/70">
      <CardContent className="space-y-3 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-lg leading-snug">
                <Link to="/corrections/$id" params={{ id: s.submissionId }} className="hover:underline">
                  {s.lessonTitle}
                </Link>
              </h2>
              <Badge variant="secondary" className="text-[10px]">
                {lessonKindLabels[s.lessonKind] ?? s.lessonKind}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{s.trainingTitle}</p>
          </div>
          <InstructorSubmissionBadge status={s.status} />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>
            <span className="font-medium text-foreground">{s.studentName}</span> · {s.studentEmail}
          </span>
          <span>Déposé le {formatDateTime(s.submittedAt)}</span>
          <span className="inline-flex items-center gap-2">
            {s.hasText ? (
              <span className="inline-flex items-center gap-1"><FileText className="size-3.5" /> Texte</span>
            ) : null}
            {s.hasFile ? (
              <span className="inline-flex items-center gap-1"><Paperclip className="size-3.5" /> Fichier</span>
            ) : null}
            {!s.hasText && !s.hasFile ? <span className="italic">Dépôt vide</span> : null}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {s.feedback ? (
              <>
                {s.feedback.note !== null ? (
                  <span className="font-medium text-foreground">Note : {s.feedback.note}/100 · </span>
                ) : null}
                Dernier retour le {formatDateTime(s.feedback.gradedAt)}
              </>
            ) : (
              <span className="italic">Pas encore corrigé</span>
            )}
          </p>
          <Button asChild size="sm" variant={s.isGraded ? "soft" : "accent"}>
            <Link to="/corrections/$id" params={{ id: s.submissionId }}>
              <ClipboardCheck className="size-4" /> {s.isGraded ? "Voir" : "Corriger"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}