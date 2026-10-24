import { Link } from "@tanstack/react-router";
import { BookOpen, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { APIInstructorSessionDetail } from "@/data/sessions";

export function SessionTrainingLinks({ session }: { session: APIInstructorSessionDetail }) {
  return (
    <div className="space-y-2">
      <Button asChild variant="outline" className="w-full">
        <Link
          to="/trainings/$trainingId/sessions/$sessionId"
          params={{ trainingId: session.trainingId, sessionId: session.id }}
        >
          <CalendarDays className="size-4" /> Voir dans la formation
        </Link>
      </Button>
      <Button asChild variant="soft" className="w-full">
        <Link to="/trainings/$trainingId" params={{ trainingId: session.trainingId }}>
          <BookOpen className="size-4" /> Voir la formation
        </Link>
      </Button>
    </div>
  );
}