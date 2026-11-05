import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instructorFetch } from "@/lib/api/resolve-url";
import { parseApiError } from "@/lib/api/error";
import type {
  APIInstructorMfaStatus,
  APIInstructorMfaRecoveryCodes,
  APIInstructorMfaTotpSetup,
  InstructorMfaPasswordPayload,
  InstructorMfaDefaultPayload,
  InstructorMfaTotpConfirmPayload,
  InstructorMfaDeleteMethodPayload,
} from "@/data/mfa";

export class InstructorMfaApiError extends Error { }

const MFA_KEY = ["instructor-mfa"] as const;
const BASE_PATH = "/api/instructor/account/security/mfa";

function buildForm(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) fd.append(key, value);
  return fd;
}

async function mfaRequest<T>(
  path: string,
  fallbackMessage: string,
  init?: { method: "POST" | "PUT" | "DELETE"; body: FormData }
): Promise<T> {
  const response = await instructorFetch(`${BASE_PATH}${path}`, init);
  if (!response.ok) {
    const error = await parseApiError(response, fallbackMessage);
    throw new InstructorMfaApiError(error.message);
  }
  return response.json();
}

/* ---------- Fonctions ---------- */

export const fetchInstructorMfaStatus = () =>
  mfaRequest<APIInstructorMfaStatus>("", "Impossible de charger les paramètres de sécurité.");

export const enableInstructorMfa = (payload: InstructorMfaPasswordPayload) =>
  mfaRequest<APIInstructorMfaStatus>("/enable", "Impossible d'activer la double authentification.", {
    method: "POST",
    body: buildForm({ password: payload.password }),
  });

export const disableInstructorMfa = (payload: InstructorMfaPasswordPayload) =>
  mfaRequest<APIInstructorMfaStatus>("/disable", "Impossible de désactiver la double authentification.", {
    method: "POST",
    body: buildForm({ password: payload.password }),
  });

export const setInstructorMfaDefault = (payload: InstructorMfaDefaultPayload) =>
  mfaRequest<APIInstructorMfaStatus>("/default", "Impossible de définir la méthode par défaut.", {
    method: "PUT",
    body: buildForm({ method: payload.method }),
  });

export const regenerateInstructorMfaRecoveryCodes = (payload: InstructorMfaPasswordPayload) =>
  mfaRequest<APIInstructorMfaRecoveryCodes>(
    "/recovery-codes/regenerate",
    "Impossible de générer de nouveaux codes de secours.",
    { method: "POST", body: buildForm({ password: payload.password }) }
  );

export const setupInstructorMfaTotp = (payload: InstructorMfaPasswordPayload) =>
  mfaRequest<APIInstructorMfaTotpSetup>("/totp/setup", "Impossible de démarrer la configuration.", {
    method: "POST",
    body: buildForm({ password: payload.password }),
  });

export const confirmInstructorMfaTotp = (payload: InstructorMfaTotpConfirmPayload) =>
  mfaRequest<APIInstructorMfaStatus>("/totp/confirm", "Code invalide ou expiré.", {
    method: "POST",
    body: buildForm({
      code: payload.code,
      makeDefault: payload.makeDefault ? "1" : "0",
    }),
  });

export const deleteInstructorMfaMethod = (payload: InstructorMfaDeleteMethodPayload) =>
  mfaRequest<APIInstructorMfaStatus>(`/methods/${payload.id}`, "Impossible de supprimer cette méthode.", {
    method: "DELETE",
    body: buildForm({ password: payload.password }),
  });

/* ---------- Hooks ---------- */

export function useInstructorMfaStatus() {
  const query = useQuery({
    queryKey: MFA_KEY,
    queryFn: fetchInstructorMfaStatus,
    staleTime: 1000 * 30,
    retry: false,
  });
  return {
    status: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

/** Les mutations qui renvoient l'état MFA complet le placent directement dans le cache */
function useStatusMutation<TPayload>(mutationFn: (payload: TPayload) => Promise<APIInstructorMfaStatus>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (status) => qc.setQueryData(MFA_KEY, status),
  });
}

export const useEnableInstructorMfa = () => useStatusMutation(enableInstructorMfa);
export const useDisableInstructorMfa = () => useStatusMutation(disableInstructorMfa);
export const useSetInstructorMfaDefault = () => useStatusMutation(setInstructorMfaDefault);
export const useConfirmInstructorMfaTotp = () => useStatusMutation(confirmInstructorMfaTotp);
export const useDeleteInstructorMfaMethod = () => useStatusMutation(deleteInstructorMfaMethod);

export function useSetupInstructorMfaTotp() {
  return useMutation({ mutationFn: setupInstructorMfaTotp });
}

/** La régénération ne renvoie que les codes : on invalide l'état pour rafraîchir le compteur */
export function useRegenerateInstructorMfaRecoveryCodes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: regenerateInstructorMfaRecoveryCodes,
    onSuccess: () => qc.invalidateQueries({ queryKey: MFA_KEY }),
  });
}