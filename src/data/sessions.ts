export type SessionModality = "in_person" | "online";
export const SESSION_MODALITIES: SessionModality[] = ["in_person", "online"];
export const sessionModalityLabels: Record<SessionModality, string> = {
  in_person: "Présentiel",
  online: "En ligne",
};

/** Valeurs du filtre `status` — d'autres statuts peuvent exister côté back */
export type SessionStatus = "published" | "suspended";
export const SESSION_STATUSES: SessionStatus[] = ["published", "suspended"];

/** Réponse d'un apprenant à l'invitation (déduit de confirmedCount / declinedCount) */
export type SessionAttendeeResponse = "confirmed" | "declined";

const TONE = {
  success: "bg-success/15 text-success border-success/30",
  danger: "bg-destructive/12 text-destructive border-destructive/30",
  warning: "bg-accent/20 text-accent-foreground border-accent/40",
  muted: "bg-muted text-muted-foreground border-transparent",
};

/* ------------------------------ Libellés / couleurs ------------------------------ */

const sessionStatusLabels: Record<string, string> = {
  published: "Publiée",
  suspended: "Suspendue",
};

export function getSessionStatusLabel(status: string): string {
  return sessionStatusLabels[status] ?? status;
}

export function getSessionStatusBadgeClass(status: string): string {
  if (status === "published") return TONE.success;
  if (status === "suspended") return TONE.danger;
  return TONE.muted;
}

const reviewRequestStatusLabels: Record<string, string> = {
  pending: "En attente",
  validated: "Validée",
  rejected: "Refusée",
};

export function getReviewRequestStatusLabel(status: string): string {
  return reviewRequestStatusLabels[status] ?? status;
}

export function getReviewRequestStatusBadgeClass(status: string): string {
  if (status === "pending") return TONE.warning;
  if (status === "validated") return TONE.success;
  if (status === "rejected") return TONE.danger;
  return TONE.muted;
}

const sessionResponseLabels: Record<string, string> = {
  confirmed: "Présence confirmée",
  declined: "Absence annoncée",
};

export function getSessionResponseLabel(response: string): string {
  return sessionResponseLabels[response] ?? response;
}

export function getSessionResponseBadgeClass(response: string): string {
  if (response === "confirmed") return TONE.success;
  if (response === "declined") return TONE.danger;
  return TONE.muted;
}

/* ------------------------------------ Types ------------------------------------ */

/** POST .../review-request */
export interface APIInstructorSessionPendingReview {
  id: string;
  status: string;
  createdAt: string;
}

export interface APIInstructorSessionReviewRequest {
  id: string;
  /** Valeurs observées : "pending", "validated" — enum non communiqué */
  status: string;
  message: string;
  createdAt: string;
  reviewedAt: string | null;
  rejectionReason: string | null;
}

export interface APIInstructorSessionResponse {
  studentId: string;
  studentName: string;
  response: SessionAttendeeResponse;
  respondedAt: string | null;
}

/** Item de liste et réponse de création */
export interface APIInstructorSession {
  id: string;
  trainingId: string;
  trainingTitle: string;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string;
  durationMinutes: number | string;
  modality: SessionModality;
  location: string | null;
  meetingUrl: string | null;
  status: SessionStatus;
  isUpcoming: boolean;
  instructorId: string;
  instructorName: string;
  createdAt: string;
  confirmedCount: number;
  declinedCount: number;
  suspendedAt: string | null;
  suspensionReason: string | null;
  pendingReviewRequest: APIInstructorSessionPendingReview | null;
}

/** GET /instructor/trainings/sessions/{id} (aussi renvoyé par PUT) */
export interface APIInstructorSessionDetail extends APIInstructorSession {
  invitedCount: number | null;
  suspendedBy: string | null;
  responses: APIInstructorSessionResponse[];
  reviewRequests: APIInstructorSessionReviewRequest[];
}

/** Payload de création — l'API attend du camelCase (exception à la convention snake_case) */
export interface InstructorSessionPayload {
  trainingId: string;
  title: string;
  description?: string;
  startsAt: string;
  durationMinutes: number;
  modality: SessionModality;
  location?: string;
  meetingUrl?: string;
}

/** En PUT, un champ vide ou absent = inchangé : on n'envoie que ce qui change */
export type InstructorSessionUpdatePayload = Partial<
  Omit<InstructorSessionPayload, "trainingId" | "durationMinutes">
> & {
  durationMinutes: number;
};

/** Paramètres de GET .../sessions/list (alias de type pour rester assignable à Record<string, string | number | undefined>) */
export type InstructorSessionFilters = {
  trainingId?: string;
  status?: SessionStatus;
  modality?: SessionModality;
  upcoming?: boolean;
  from?: string;
  to?: string;
  query?: string;
  page?: number;
  perPage?: number;
};