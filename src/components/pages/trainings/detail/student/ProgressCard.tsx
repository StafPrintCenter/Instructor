import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function StudentProgressCard({ progress }: { progress: number }) {
  return (
    <Card className="border-border/70">
      <CardContent className="space-y-2 p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Progression</p>
        <p className="font-display text-2xl font-semibold">{progress}%</p>
        <Progress value={progress} />
      </CardContent>
    </Card>
  );
}