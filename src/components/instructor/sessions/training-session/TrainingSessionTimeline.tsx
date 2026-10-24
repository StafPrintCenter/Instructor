import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { APIInstructorSessionDetail } from "@/data/sessions";
import { formatSessionShortDateTime } from "@/lib/session-time";
import { cn } from "@/lib/utils";
import { buildSessionTimeline, type TimelineTone } from "./buildSessionTimeline";

const DOT_CLASS: Record<TimelineTone, string> = {
  info: "bg-primary",
  success: "bg-success",
  danger: "bg-destructive",
  muted: "bg-muted-foreground/50",
};

export function TrainingSessionTimeline({ session }: { session: APIInstructorSessionDetail }) {
  const events = buildSessionTimeline(session);

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle className="font-display text-xl">Historique</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="relative space-y-6 border-l border-border/70 pl-6">
          {events.map((e) => (
            <li key={e.key} className="relative">
              <span className={cn("absolute left-[-1.9rem] top-1 size-3 rounded-full ring-4 ring-card", DOT_CLASS[e.tone])} />
              <p className="text-sm font-medium">{e.title}</p>
              <p className="text-xs text-muted-foreground">{formatSessionShortDateTime(e.at)}</p>
              {e.detail ? <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{e.detail}</p> : null}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}