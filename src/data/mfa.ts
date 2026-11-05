export type InstructorMfaMethodType = "email" | "totp";

export interface APIInstructorMfaMethod {
  id: string | null; // null pour la méthode e-mail
  type: InstructorMfaMethodType;
  label: string;
  hint: string | null;
  enabled: boolean;
  confirmedAt: string | null;
  lastUsedAt: string | null;
}

export interface APIInstructorMfaStatus {
  enabled: boolean;
  enforced: boolean;
  defaultMethod: InstructorMfaMethodType;
  methods: APIInstructorMfaMethod[];
  recoveryCodesRemaining: number;
  recoveryCodesGeneratedAt: string | null;
}

export interface APIInstructorMfaRecoveryCodes {
  recoveryCodes: string[];
  recoveryCodesRemaining: number;
}

export interface APIInstructorMfaTotpSetup {
  secret: string;
  otpauthUri: string;
  issuer: string;
  account: string;
}

export interface InstructorMfaPasswordPayload {
  password: string;
}

export interface InstructorMfaDefaultPayload {
  method: InstructorMfaMethodType;
}

export interface InstructorMfaTotpConfirmPayload {
  code: string;
  makeDefault?: boolean;
}

export interface InstructorMfaDeleteMethodPayload {
  id: string;
  password: string;
}