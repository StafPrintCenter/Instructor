import { Link } from "@tanstack/react-router";
import { CalendarCheck, ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/site";
import { Button } from "@/components/ui/button";
import { BackToTrainingButton } from "./BackToTrainingButton";

interface StudentFollowUpHeaderProps {
  trainingId: string;
  name: string;
  email: string;
  onMarkAttendance: () => void;
}

export function StudentFollowUpHeader({ trainingId, name, email, onMarkAttendance }: StudentFollowUpHeaderProps) {
  return (
    <PageHeader
      eyebrow="Suivi apprenant"
      title={name}
      description={email}
      actions={
        <>
          <BackToTrainingButton trainingId={trainingId} />
          <Button asChild variant="soft" size="sm">
            <Link to="/trainings/$trainingId/submissions" params={{ trainingId }}>
              <ClipboardList className="size-4" /> Toutes les soumissions
            </Link>
          </Button>
          <Button variant="accent" size="sm" onClick={onMarkAttendance}>
            <CalendarCheck className="size-4" /> Marquer l'assiduité
          </Button>
        </>
      }
    />
  );
}