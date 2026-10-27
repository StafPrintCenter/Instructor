import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CorrectionStatementCardProps {
  brief: string | null;
  instructions: string | null;
}

export function CorrectionStatementCard({ brief, instructions }: CorrectionStatementCardProps) {
  if (!brief && !instructions) return null;

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle className="font-display text-lg">Énoncé de la leçon</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {brief ? (
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Résumé</p>
            <p className="whitespace-pre-wrap text-sm">{brief}</p>
          </div>
        ) : null}
        {instructions ? (
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Consignes</p>
            <p className="whitespace-pre-wrap text-sm">{instructions}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}