import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MFA_KEY, buildForm, mfaRequest } from "@/stores/useMfaStore";
import type {
  APIInstructorPasskeyCreationOptions,
  APIInstructorPasskeyRegisterResponse,
  InstructorPasskeyOptionsPayload,
  InstructorPasskeyRegisterPayload,
} from "@/data/passkeys";

export const fetchInstructorPasskeyOptions = (payload: InstructorPasskeyOptionsPayload) =>
  mfaRequest<APIInstructorPasskeyCreationOptions>(
    "/passkeys/options",
    "Impossible de démarrer l'enregistrement de la clé d'accès.",
    { method: "POST", body: buildForm({ password: payload.password }) }
  );

export const registerInstructorPasskey = (payload: InstructorPasskeyRegisterPayload) => {
  const fields: Record<string, string> = {
    credential: payload.credential,
    makeDefault: payload.makeDefault ? "1" : "0",
  };
  if (payload.name) fields.name = payload.name;

  return mfaRequest<APIInstructorPasskeyRegisterResponse>(
    "/passkeys/register",
    "Impossible d'enregistrer la clé d'accès.",
    { method: "POST", body: buildForm(fields) }
  );
};

export function useInstructorPasskeyOptions() {
  return useMutation({ mutationFn: fetchInstructorPasskeyOptions });
}

/** Le résultat complet (avec `recoveryCodes`) est renvoyé à l'appelant ; le cache ne garde que l'état MFA */
export function useRegisterInstructorPasskey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: registerInstructorPasskey,
    onSuccess: ({ recoveryCodes: _recoveryCodes, ...status }) => qc.setQueryData(MFA_KEY, status),
  });
}