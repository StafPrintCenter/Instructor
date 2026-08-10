export type InstructorTrainingRole = "lead" | "assistant";
export type TrainingLevel = "Débutant" | "Intermédiaire" | "Avancé";
export type TrainingStatus = "draft" | "published" | "archived";

export interface APIInstructorTrainingAssignment {
  id: string;
  assignmentId: string;
  trainingId: string;
  trainingTitle: string;
  trainingShort: string;
  trainingTheme: string;
  trainingLevel: TrainingLevel;
  trainingStatus: TrainingStatus;
  trainingCoverColor: string | null;
  trainingStartDate: string | null;
  trainingEndDate: string | null;
  trainingLocation: string | null;
  trainingCurrentStudents: number | null;
  role: InstructorTrainingRole;
  assignedAt: string;
}

/**
 * Mappage des rôles du formateur vers leurs labels et variantes de Badge
 */
export const instructorRoleConfig: Record<
  InstructorTrainingRole | string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  lead: { label: "Formateur principal", variant: "default", },
  assistant: { label: "Formateur assistant", variant: "secondary", },
};

export function getInstructorRoleConfig(role: string) {
  return (
    instructorRoleConfig[role.toLowerCase()] ?? {
      label: role, variant: "outline",
    }
  );
}