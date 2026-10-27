// src/components/pages/corrections/CorrectionTrainingCard.tsx
import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { APIInstructorSubmissionDetail } from "@/data/submissions";

interface CorrectionTrainingCardProps {
  training: APIInstructorSubmissionDetail["training"];
  enrollment: APIInstructorSubmissionDetail["enrollment"];
}

export function CorrectionTrainingCard({ training, enrollment }: CorrectionTrainingCardProps) {
  return (
    <Card className="border-border/70">
      <CardContent className="space-y-3 p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Formation</p>
        <Link
          to="/trainings/$trainingId"
          params={{ trainingId: training.id }}
          className="block text-sm font-medium hover:underline"
        >
          {training.title}
        </Link>
        {enrollment ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progression de l'apprenant</span>
              <span className="font-medium">{enrollment.progress}%</span>
            </div>
            <Progress value={enrollment.progress} className="h-1.5" />
          </div>
        ) : (
          <p className="text-xs italic text-muted-foreground">Soumission non rattachée à une inscription.</p>
        )}
      </CardContent>
    </Card>
  );
}