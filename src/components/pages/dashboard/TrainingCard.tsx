import { Link } from "@tanstack/react-router";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getTrainingLevelBadgeClass, getTrainingStatusBadgeClass, getTrainingStatusLabel, type APIInstructorTrainingAssignment } from "@/data/trainings";
import { formatDate } from "@/lib/date-time";
import { cn } from "@/lib/utils";

interface DashboardTrainingCardProps {
  training: APIInstructorTrainingAssignment;
  learners: number;
  progress: number | null;
}

export function DashboardTrainingCard({ training: t, learners, progress }: DashboardTrainingCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden border-border/70 transition-shadow hover:shadow-(--shadow-lift)">
      <div className="h-1.5 w-full" style={{ backgroundColor: t.trainingCoverColor || "var(--primary)" }} />
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{t.trainingTheme}</p>
            <h3 className="font-display text-lg leading-snug">{t.trainingTitle}</h3>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <Badge variant="outline" className={cn("border font-medium", getTrainingLevelBadgeClass(t.trainingLevel))}>
              {t.trainingLevel}
            </Badge>
            {t.trainingStatus !== "published" ? (
              <Badge variant="outline" className={cn("border text-[10px] font-medium", getTrainingStatusBadgeClass(t.trainingStatus))}>
                {getTrainingStatusLabel(t.trainingStatus)}
              </Badge>
            ) : null}
          </div>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">{t.trainingShort}</p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5" /> {learners} apprenant{learners > 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5" /> {t.trainingLocation ?? "À définir"}
          </span>
          {t.trainingStartDate ? (
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5" /> {formatDate(t.trainingStartDate)}
            </span>
          ) : null}
        </div>

        <div className="mt-auto space-y-2 pt-2">
          <div className="flex items-center gap-3">
            <Progress value={progress ?? 0} className="h-2" />
            <span className="w-10 text-right text-xs tabular-nums">{progress === null ? "—" : `${progress}%`}</span>
          </div>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="soft" className="flex-1">
              <Link to="/trainings/$trainingId" params={{ trainingId: t.trainingId }}>Détails</Link>
            </Button>
            <Button asChild size="sm" variant="accent" className="flex-1">
              <Link to="/trainings/$trainingId/manage" params={{ trainingId: t.trainingId }}>Contenu</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}