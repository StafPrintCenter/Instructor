import type { APIInstructorMfaStatus } from "@/data/mfa";

export interface APIPasskeyDescriptor {
  type: "public-key";
  id: string; // base64url
  transports?: string[];
}

/** Options de création (enregistrement) */
export interface APIInstructorPasskeyCreationOptions {
  challenge: string;
  rp: { id: string; name: string };
  user: { id: string; name: string; displayName: string };
  pubKeyCredParams: { type: "public-key"; alg: number }[];
  timeout?: number;
  attestation?: AttestationConveyancePreference;
  excludeCredentials?: APIPasskeyDescriptor[];
  authenticatorSelection?: AuthenticatorSelectionCriteria;
}

/** Options d'authentification (connexion) */
export interface APIInstructorPasskeyRequestOptions {
  challenge: string;
  rpId?: string;
  timeout?: number;
  allowCredentials?: APIPasskeyDescriptor[];
  userVerification?: UserVerificationRequirement;
}

export interface InstructorPasskeyOptionsPayload {
  password: string;
}

export interface InstructorPasskeyRegisterPayload {
  credential: string; // JSON sérialisé du résultat de navigator.credentials.create()
  name?: string;
  makeDefault?: boolean;
}

export interface APIInstructorPasskeyRegisterResponse extends APIInstructorMfaStatus {
  recoveryCodes?: string[]; // présents à la première configuration MFA
}