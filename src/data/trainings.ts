export type InstructorTrainingRole = "lead" | "assistant";

export interface APIInstructorTrainingAssignment {
  assignmentId: string;
  trainingId: string;
  trainingTitle: string;
  trainingShort: string;
  trainingTheme: string;
  trainingLevel: string;
  trainingStatus: string; // "draft" | "published" | ... à confirmer avec Steve selon les valeurs possibles
  trainingCoverColor: string | null;
  trainingStartDate: string | null;
  trainingEndDate: string | null;
  trainingLocation: string | null;
  trainingCurrentStudents: number | null;
  role: InstructorTrainingRole;
  assignedAt: string;
}