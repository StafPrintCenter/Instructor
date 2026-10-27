import { Link } from "@tanstack/react-router";
import { CalendarDays, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTrainingLevelBadgeClass, getTrainingStatusBadgeClass, getTrainingStatusLabel, type APIInstructorTrainingDetail } from "@/data/trainings";
import { cn } from "@/lib/utils";

interface TrainingHeroProps {
  training: APIInstructorTrainingDetail;
  trainingId: string;
  mainColor: string;
}

export function TrainingDetailHero({ training, trainingId, mainColor }: TrainingHeroProps) {
  return (
    <div
      className="relative -mx-4 -mt-4 overflow-hidden rounded-2xl border border-border/60 p-6 transition-colors sm:p-8"
      style={{ background: `linear-gradient(135deg, ${mainColor}15 0%, ${mainColor}03 100%)` }}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: mainColor }}
      />

      <div className="relative space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {training.theme}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="accent">
              <Link to="/trainings/$trainingId/manage" params={{ trainingId }}>
                Gérer le contenu
              </Link>
            </Button>
            <Button asChild variant="soft">
              <Link to="/trainings/$trainingId/submissions" params={{ trainingId }}>
                <ClipboardList className="size-4" /> Soumissions
              </Link>
            </Button>
            <Button asChild variant="soft">
              <a href="#sessions">
                <CalendarDays className="size-4" /> Sessions
              </a>
            </Button>
          </div>
        </div>

        <div className="flex items-stretch gap-3.5">
          <div className="my-1 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: mainColor }} />
          <h1 className="font-display text-2xl font-bold leading-tight sm:text-3xl">{training.title}</h1>
        </div>

        <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">{training.short}</p>

        <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs sm:text-sm">
          <Badge variant="outline" className={cn("border font-medium", getTrainingLevelBadgeClass(training.level))}>
            {training.level}
          </Badge>
          <Badge variant="outline" className={cn("border font-medium", getTrainingStatusBadgeClass(training.status))}>
            {getTrainingStatusLabel(training.status)}
          </Badge>
          <span
            className="rounded-full px-3 py-1 font-display font-semibold text-white shadow-sm"
            style={{ backgroundColor: mainColor }}
          >
            {training.price.toLocaleString("fr-FR")} FCFA
          </span>
        </div>
      </div>
    </div>
  );
}