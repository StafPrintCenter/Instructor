import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/site";
import { Button } from "@/components/ui/button";
import type { APIInstructorTrainingDetail } from "@/data/trainings";
import { CreateModuleDialog } from "../modules";

interface ManageHeaderProps {
  training: APIInstructorTrainingDetail;
  trainingId: string;
  modulesCount: number;
}

export function ManageHeader({ training, trainingId, modulesCount }: ManageHeaderProps) {
  return (
    <PageHeader
      eyebrow={training.theme}
      title={training.title}
      description="Gestion des modules et leçons de cette formation."
      actions={
        <div className="flex items-center gap-2">
          <Button asChild variant="soft">
            <Link to="/trainings/$trainingId" params={{ trainingId }}>
              <ArrowLeft className="size-4" /> Résumé
            </Link>
          </Button>
          <CreateModuleDialog trainingId={trainingId} modulesCount={modulesCount} />
        </div>
      }
    />
  );
}