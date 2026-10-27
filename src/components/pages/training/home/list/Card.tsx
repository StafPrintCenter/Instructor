import { Card, CardContent } from "@/components/ui/card";
import type { APIInstructorTrainingAssignment } from "@/data/trainings";
import { TrainingCardActions } from "./CardActions";
import { TrainingCardCover } from "./CardCover";
import { TrainingCardHeader } from "./CardHeader";
import { TrainingCardMeta } from "./CardMeta";

export function TrainingCard({ training: t }: { training: APIInstructorTrainingAssignment }) {
  return (
    <Card className="overflow-hidden border-border/70 transition-shadow hover:shadow-(--shadow-lift)">
      <TrainingCardCover color={t.trainingCoverColor} />
      <CardContent className="space-y-4 p-5">
        <TrainingCardHeader training={t} />
        <p className="text-sm text-muted-foreground">{t.trainingShort}</p>
        <TrainingCardMeta training={t} />
        <TrainingCardActions trainingId={t.trainingId} />
      </CardContent>
    </Card>
  );
}