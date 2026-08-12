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

/** Renvoyée par /api/v1/instructor/trainings/{id}, clé "data" */
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
 * Apprenant inscrit à la formation.
 */
export interface APIInstructorTrainingStudent {
  studentId: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  progress: number | null;
  attendance: number | null;
  paymentStatus: string | null;
  lastActivityAt: string | null;
}

/** Réponse complète de /api/v1/instructor/trainings/{id} */
export interface APIInstructorTrainingOverview {
  data: APIInstructorTrainingDetail;
  students: {
    data: APIInstructorTrainingStudent[];
    total: number;
  };
  averageProgress: number | null;
  progressTrackingAvailable: boolean;
}

/**
 * Configuration des badges pour les niveaux de formation
 */
export const TRAINING_LEVEL_BADGES: Record<TrainingLevel, { label: string; className: string }> = {
  Débutant: {
    label: "Débutant",
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },
  Intermédiaire: {
    label: "Intermédiaire",
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  },
  Avancé: {
    label: "Avancé",
    className: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
  },
};

export function getTrainingLevelBadgeClass(level: TrainingLevel): string {
  return TRAINING_LEVEL_BADGES[level]?.className ?? "bg-muted text-muted-foreground border-border";
}

/**
 * Configuration des badges pour les statuts de formation
 */
export const TRAINING_STATUS_BADGES: Record<TrainingStatus, { label: string; className: string }> = {
  draft: {
    label: "Brouillon",
    className: "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20",
  },
  published: {
    label: "Publiée",
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },
  archived: {
    label: "Archivée",
    className: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  },
};

export function getTrainingStatusBadgeClass(status: TrainingStatus): string {
  return TRAINING_STATUS_BADGES[status]?.className ?? "bg-muted text-muted-foreground border-border";
}

export function getTrainingStatusLabel(status: TrainingStatus): string {
  return TRAINING_STATUS_BADGES[status]?.label ?? status;
}

/**
 * Mappage des rôles du formateur vers leurs labels et variantes de Badge
 */
export const instructorRoleConfig: Record<
  InstructorTrainingRole | string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  lead: { label: "Formateur principal", variant: "default" },
  assistant: { label: "Formateur assistant", variant: "secondary" },
};

export function getInstructorRoleConfig(role: string) {
  return instructorRoleConfig[role.toLowerCase()] ?? { label: role, variant: "outline" };
}
