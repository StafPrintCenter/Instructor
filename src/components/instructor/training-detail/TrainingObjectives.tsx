import { BookOpen, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { APIInstructorTrainingDetail } from "@/data/trainings";

interface TrainingObjectivesProps {
  training: APIInstructorTrainingDetail;
  mainColor: string;
}

export function TrainingObjectives({ training, mainColor }: TrainingObjectivesProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <BookOpen className="size-4" style={{ color: mainColor }} /> Objectifs pédagogiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {training.objectives.map((o) => (
              <li key={o} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" style={{ color: mainColor }} /> {o}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {training.prerequisites.length > 0 && (
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="font-display text-lg">Prérequis</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {training.prerequisites.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full" style={{ backgroundColor: mainColor }} /> {p}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}