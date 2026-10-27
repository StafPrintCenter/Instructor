import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sortFeedbacksDesc, type APIInstructorSubmissionFeedbackEntry } from "@/data/submissions";
import { FeedbackItem } from "./FeedbackItem";

export function CorrectionHistoryCard({ feedbacks }: { feedbacks: APIInstructorSubmissionFeedbackEntry[] }) {
  const sorted = sortFeedbacksDesc(feedbacks);

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle className="font-display text-lg">Historique des corrections ({sorted.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground">Ce travail n'a pas encore été corrigé.</p>
        ) : (
          <ul className="space-y-2">
            {sorted.map((f, i) => (
              <FeedbackItem key={f.id} feedback={f} isLatest={i === 0} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}