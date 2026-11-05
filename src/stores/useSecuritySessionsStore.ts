import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instructorFetch } from "@/lib/api/resolve-url";
import { parseApiError } from "@/lib/api/error";
import type {
  APIInstructorSession,
  APIInstructorSessionsResponse,
  APIInstructorSessionMessage,
  APIInstructorSessionRevokeResponse,
} from "@/data/security-session";

export class InstructorSessionsApiError extends Error { }

const SESSIONS_KEY = ["instructor-sessions"] as const;
const BASE_PATH = "/api/instructor/account/sessions";

async function sessionsRequest<T>(
  path: string,
  fallbackMessage: string,
  method?: "POST" | "DELETE"
): Promise<T> {
  const response = await instructorFetch(`${BASE_PATH}${path}`, method ? { method } : undefined);
  if (!response.ok) {
    const error = await parseApiError(response, fallbackMessage);
    throw new InstructorSessionsApiError(error.message);
  }
  return response.json();
}

/* ---------- Fonctions ---------- */

export const fetchInstructorSessions = () =>
  sessionsRequest<APIInstructorSessionsResponse>("", "Impossible de charger vos sessions.");

export const deleteInstructorSession = (id: number) =>
  sessionsRequest<APIInstructorSessionMessage>(`/${id}`, "Impossible de fermer cette session.", "DELETE");

export const revokeOtherInstructorSessions = () =>
  sessionsRequest<APIInstructorSessionRevokeResponse>(
    "/revoke-others",
    "Impossible de fermer les autres sessions.",
    "POST"
  );

export const revokeAllInstructorSessions = () =>
  sessionsRequest<APIInstructorSessionRevokeResponse>(
    "/revoke-all",
    "Impossible de fermer les sessions.",
    "POST"
  );

/* ---------- Hooks ---------- */

export function useInstructorSessionsList() {
  const query = useQuery({
    queryKey: SESSIONS_KEY,
    queryFn: fetchInstructorSessions,
    staleTime: 1000 * 30,
  });
  return {
    items: (query.data?.data ?? []) as APIInstructorSession[],
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export function useDeleteInstructorSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteInstructorSession(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SESSIONS_KEY }),
  });
}

export function useRevokeOtherInstructorSessions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => revokeOtherInstructorSessions(),
    onSuccess: () => qc.invalidateQueries({ queryKey: SESSIONS_KEY }),
  });
}

/** La session actuelle est fermée aussi : on retire la liste du cache au lieu de la recharger (401) */
export function useRevokeAllInstructorSessions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => revokeAllInstructorSessions(),
    onSuccess: () => qc.removeQueries({ queryKey: SESSIONS_KEY }),
  });
}