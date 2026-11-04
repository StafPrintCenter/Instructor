import type { APIInstructorUser } from "@/data/auth";

export type APIInstructorProfile = APIInstructorUser;

export interface InstructorProfilePayload {
  firstName: string;
  lastName: string;
  bio?: string;
  photo?: File | null;
  removePhoto?: boolean;
}

export interface InstructorEmailChangeRequestPayload {
  newEmail: string;
  password: string;
}

export interface InstructorEmailChangeConfirmPayload {
  code: string;
}

export interface APIInstructorEmailChangeRequestResponse {
  message: string;
  hint: string;
  expiresInMinutes: number;
}