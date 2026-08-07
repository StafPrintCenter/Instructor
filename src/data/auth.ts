export type InstructorRegistrationSource = "self_registered" | "invited" | string;

export type InstructorTrainingAssignment = {
  assignmentId: string;
  trainingId: string;
  trainingTitle: string | null;
  trainingStatus: string | null;
  role: "lead" | "assistant" | string;
  assignedAt: string | null;
};

/**
 * Type aligné sur InstructorResource
 */
export type APIInstructorUser = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  registrationSource: InstructorRegistrationSource | null;
  photo: string | null;
  bio: string | null;
  isActive: boolean;
  isBlocked: boolean;
  isPending: boolean;
  needsApproval: boolean;
  blockedAt: string | null;
  blockedReason: string | null;
  invitedBy: string | null;
  invitedAt: string | null;
  acceptedAt: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  trainings?: InstructorTrainingAssignment[];
  createdAt: string;
};

export type APIInstructorLoginResponse = {
  instructor: APIInstructorUser;
  token: string;
};

export interface InstructorInviteVerifyResponse {
  firstName: string;
  lastName: string;
  fullname: string;
  email: string;
}

export const roleLabels: Record<string, string> = {
  lead: "Formateur principal",
  assistant: "Formateur assistant",
};

export function getInstructorRoleLabel(trainings?: { role: string }[]): string {
  const primaryRole = trainings?.[0]?.role;
  if (!primaryRole) return "Non assigné";
  return roleLabels[primaryRole.toLowerCase()] ?? primaryRole;
}