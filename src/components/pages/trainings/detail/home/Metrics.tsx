import { Calendar, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/date-time";
import type { APIInstructorTrainingDetail } from "@/data/trainings";

interface TrainingMetricsProps {
  training: APIInstructorTrainingDetail;
  averageProgress: number | null;
  progressTrackingAvailable: boolean;
}

export function TrainingDetailMetrics({ training, averageProgress, progressTrackingAvailable }: TrainingMetricsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border-border/70">
        <CardContent className="space-y-1.5 p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Période & Lieu</p>
          <p className="flex items-center gap-1.5 text-sm font-medium">
            <Calendar className="size-3.5 shrink-0 text-muted-foreground" />
            {training.startDate ? formatDate(training.startDate) : "À définir"} →{" "}
            {training.endDate ? formatDate(training.endDate) : "À définir"}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" /> {training.location ?? "À définir"}
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardContent className="p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Volume Horaire</p>
          <p className="mt-1 font-display text-2xl font-semibold">{training.durationHours}h</p>
          <p className="text-xs text-muted-foreground">{training.duration}</p>
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardContent className="p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Inscriptions</p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-semibold">{training.currentStudents ?? 0}</span>
            <span className="text-sm text-muted-foreground">/ {training.maxSeats ?? "∞"} places</span>
          </div>
          <p className="text-xs text-muted-foreground">Apprenants enregistrés</p>
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardContent className="space-y-2 p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Avancement global</p>
          {progressTrackingAvailable && averageProgress !== null ? (
            <>
              <p className="font-display text-2xl font-semibold">{averageProgress}%</p>
              <Progress value={averageProgress} />
            </>
          ) : (
            <p className="pt-1 text-sm text-muted-foreground">Non disponible pour l'instant</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}