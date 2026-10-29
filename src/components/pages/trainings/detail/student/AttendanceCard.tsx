import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function StudentAttendanceCard({ ratio }: { ratio: number | null }) {
  return (
    <Card className="border-border/70">
      <CardContent className="space-y-2 p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Assiduité</p>
        {ratio !== null ? (
          <>
            <p className="font-display text-2xl font-semibold">{ratio}%</p>
            <Progress value={ratio} />
          </>
        ) : (
          <p className="pt-1 text-sm text-muted-foreground">Aucune séance renseignée</p>
        )}
      </CardContent>
    </Card>
  );
}