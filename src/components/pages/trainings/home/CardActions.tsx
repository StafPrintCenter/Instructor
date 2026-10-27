import { Link } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TrainingCardActions({ trainingId }: { trainingId: string }) {
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      <Button asChild variant="accent" size="sm">
        <Link to="/trainings/$trainingId" params={{ trainingId }}>
          Ouvrir
        </Link>
      </Button>

      <Button asChild variant="soft" size="sm">
        <Link to="/trainings/$trainingId/manage" params={{ trainingId }}>
          Contenu
        </Link>
      </Button>

      <Button asChild variant="outline" size="sm">
        <Link to="/trainings/$trainingId/submissions" params={{ trainingId }}>
          <ClipboardList className="size-4" /> Soumissions
        </Link>
      </Button>
    </div>
  );
}