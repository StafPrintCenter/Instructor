import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getInstructorRoleConfig, type APIInstructorTrainingInstructor } from "@/data/trainings";
import { InstructorAvatar } from "../instructors/InstructorAvatar";
import { sortTrainingInstructors } from "../instructors/instructorUtils";

interface TrainingInstructorsDialogProps {
  open: boolean;
  onClose: () => void;
  trainingId: string;
  trainingTitle: string;
  instructors: APIInstructorTrainingInstructor[];
}

export function TrainingInstructorsDialog({
  open,
  onClose,
  trainingId,
  trainingTitle,
  instructors,
}: TrainingInstructorsDialogProps) {
  const sorted = sortTrainingInstructors(instructors);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Formateurs ({sorted.length})</DialogTitle>
          <DialogDescription>{trainingTitle}</DialogDescription>
        </DialogHeader>

        <ul className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
          {sorted.map((i) => {
            const roleConfig = getInstructorRoleConfig(i.role);
            return (
              <li key={i.instructorId} className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                <InstructorAvatar name={i.name} photo={i.photo} size="lg" />
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate text-sm font-medium">{i.name}</p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant={roleConfig.variant} className="text-[10px]">{roleConfig.label}</Badge>
                    {i.isMe ? <Badge variant="outline" className="text-[10px]">Vous</Badge> : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fermer</Button>
          <Button asChild variant="soft">
            <Link to="/trainings/$trainingId" params={{ trainingId }} onClick={onClose}>Voir la formation</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}