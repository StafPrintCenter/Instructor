import type { APIInstructorCategory } from "@/data/categories";
export type InstructorRegistrationSource = "self_registered" | "invited" | string;
export type { APIInstructorCategory };

export type InstructorTrainingAssignment = {
  assignmentId: string;
  trainingId: string;
  trainingTitle: string | null;
  trainingStatus: string | null;
  role: "lead" | "assistant" | string;
  assignedAt: string | null;
};


/**
 * Type aligné sur inscription et connexion
 */
export interface InstructorRegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  bio?: string;
}
export interface InstructorAuthUser {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  registrationSource: string | null;
  photo: string | null;
  bio: string | null;
  isActive: boolean;
  isBlocked: boolean;
  isPending: boolean;
  needsApproval: boolean;
  categories: APIInstructorCategory[];
  blockedAt: string | null;
  blockedReason: string | null;
  invitedBy: string | null;
  invitedAt: string | null;
  acceptedAt: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  trainings?: InstructorTrainingAssignment[];
  createdAt: string;
}

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
  categories: APIInstructorCategory[];
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

export type InstructorMfaLoginMethod = "email" | "totp" | "recovery" | "passkey";

export interface APIInstructorMfaChallengeMethod {
  type: "email" | "totp" | "passkey";
  label: string;
  hint: string | null;
}

export interface APIInstructorMfaChallenge {
  mfaRequired: true;
  challengeToken: string;
  defaultMethod: "email" | "totp" | "passkey";
  methods: APIInstructorMfaChallengeMethod[];
  recoveryCodesAvailable: boolean;
  emailCodeSent: boolean;
  expiresAt: string;
}

export type APIInstructorLoginResult = APIInstructorLoginResponse | APIInstructorMfaChallenge;

export interface InstructorMfaVerifyPayload {
  challengeToken: string;
  method: InstructorMfaLoginMethod;
  code: string;
}

export interface APIInstructorMfaEmailResend {
  emailCodeSent: boolean;
  hint: string;
  retryAfter: number;
}