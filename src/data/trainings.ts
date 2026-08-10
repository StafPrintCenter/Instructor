export type InstructorTrainingRole = "lead" | "assistant";
export type TrainingLevel = "Débutant" | "Intermédiaire" | "Avancé";
export type TrainingStatus = "draft" | "published" | "archived";

export interface APIInstructorTrainingAssignment {
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