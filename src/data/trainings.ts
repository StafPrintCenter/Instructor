export type InstructorTrainingRole = "lead" | "assistant";
export type TrainingLevel = "Débutant" | "Intermédiaire" | "Avancé";
export type TrainingStatus = "draft" | "published" | "archived";

/** Shape renvoyée par /api/v1/instructor/trainings/list */
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

/** Shape renvoyée par /api/v1/instructor/trainings/{id} (data uniquement) — noms différents du ListItem, ne pas confondre */
export interface APIInstructorTrainingDetail {
  id: string;
  title: string;
  short: string;
  theme: string;
  status: TrainingStatus;
  level: TrainingLevel;
  duration: string;
  durationHours: number;
  price: number;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  maxSeats: number | null;
  currentStudents: number | null;
  objectives: string[];
  prerequisites: string[];
  coverColor: string | null;
}

/**
 * Shape d'un apprenant inscrit — PLACEHOLDER, à confirmer.
 * students.data est vide dans l'exemple fourni, donc la forme exacte n'est pas connue.
 */
export interface APIInstructorTrainingStudent {
  id: string;
  [key: string]: unknown;
}

/** Réponse complète de /api/v1/instructor/trainings/{id} */
export interface APIInstructorTrainingOverview {
  training: APIInstructorTrainingDetail;
  students: {
    data: APIInstructorTrainingStudent[];
    total: number;
  };
  averageProgress: number | null;
  progressTrackingAvailable: boolean;
}

/**
 * Mappage des rôles du formateur vers leurs labels et variantes de Badge
 */
export const instructorRoleConfig: Record
InstructorTrainingRole | string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
  > = {
  lead: { label: "Formateur principal", variant: "default" },
  assistant: { label: "Formateur assistant", variant: "secondary" },
};

export function getInstructorRoleConfig(role: string) {
  return instructorRoleConfig[role.toLowerCase()] ?? { label: role, variant: "outline" };
}