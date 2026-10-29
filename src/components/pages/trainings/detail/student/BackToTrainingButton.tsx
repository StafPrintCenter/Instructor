import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackToTrainingButton({ trainingId }: { trainingId: string }) {
  return (
    <Button asChild variant="outline" size="sm">
      <Link to="/trainings/$trainingId" params={{ trainingId }}>
        <ArrowLeft className="size-4" /> Retour à la formation
      </Link>
    </Button>
  );
}