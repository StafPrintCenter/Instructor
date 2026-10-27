import { useState } from "react";
import { ChevronRight, UserRound } from "lucide-react";
import type { APIInstructorTrainingInstructor } from "@/data/trainings";
import { sortTrainingInstructors, TrainingInstructorsDialog } from "./";
import { InstructorAvatar } from "@/components/pages/trainings/shared";

const MAX_AVATARS = 3;

interface TrainingInstructorsSummaryProps {
  trainingId: string;
  trainingTitle: string;
  instructors: APIInstructorTrainingInstructor[];
}

export function TrainingInstructorsSummary({ trainingId, trainingTitle, instructors }: TrainingInstructorsSummaryProps) {
  const [open, setOpen] = useState(false);
  const others = sortTrainingInstructors(instructors).filter((i) => !i.isMe);

  if (others.length === 0) {
    return (
      <p className="flex items-center gap-1.5 border-t border-border/40 pt-2 text-xs text-muted-foreground">
        <UserRound className="size-3.5 shrink-0" /> Vous êtes le seul formateur de cette formation.
      </p>
    );
  }

  const extra = others.length - MAX_AVATARS;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex w-full items-center gap-2.5 border-t border-border/40 pt-2 text-left text-xs text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Voir les formateurs de cette formation"
      >
        <span className="flex -space-x-2">
          {others.slice(0, MAX_AVATARS).map((i) => (
            <InstructorAvatar key={i.instructorId} name={i.name} photo={i.photo} size="sm" className="border-2 border-card" />
          ))}
          {extra > 0 ? (
            <span className="flex size-6 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-medium">
              +{extra}
            </span>
          ) : null}
        </span>
        <span>
          Vous et {others.length} autre{others.length > 1 ? "s" : ""} formateur{others.length > 1 ? "s" : ""}
        </span>
        <ChevronRight className="ml-auto size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
      </button>

      <TrainingInstructorsDialog
        open={open}
        onClose={() => setOpen(false)}
        trainingId={trainingId}
        trainingTitle={trainingTitle}
        instructors={instructors}
      />
    </>
  );
}