import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instructorFetch } from "@/lib/api/resolve-url";
import { parseApiError } from "@/lib/api/error";
import type {
  APIInstructorHealth,
  APIInstructorHealthRecommendation,
  APIInstructorHealthDismissResponse,
  InstructorHealthDismissPayload,
} from "@/data/profileHealth";

export class InstructorHealthApiError extends Error { }

export const HEALTH_KEY = ["instructor-profile-health"] as const;
const BASE_PATH = "/api/instructor/account/profile-health";
const EMPTY_RECOMMENDATIONS: APIInstructorHealthRecommendation[] = [];

export async function fetchInstructorProfileHealth(includeDismissed = false): Promise<APIInstructorHealth> {
  const query = includeDismissed ? "?includeDismissed=true" : "";
  const response = await instructorFetch(`${BASE_PATH}${query}`);
  if (!response.ok) {
    const error = await parseApiError(response, "Impossible de charger la santé du compte.");
    throw new InstructorHealthApiError(error.message);
  }
  return response.json();
}

export async function dismissInstructorHealthRecommendation(
  payload: InstructorHealthDismissPayload
): Promise<APIInstructorHealthDismissResponse> {
  const fd = new FormData();
  fd.append("id", payload.id);
  fd.append("restore", payload.restore ? "1" : "0");

  const response = await instructorFetch(`${BASE_PATH}/dismiss`, { method: "POST", body: fd });
  if (!response.ok) {
    const error = await parseApiError(response, "Impossible de modifier cette recommandation.");
    throw new InstructorHealthApiError(error.message);
  }
  return response.json();
}

export function useInstructorProfileHealth({ includeDismissed = false } = {}) {
  const query = useQuery({
    queryKey: [...HEALTH_KEY, { includeDismissed }],
    queryFn: () => fetchInstructorProfileHealth(includeDismissed),
    staleTime: 1000 * 60,
    retry: 1,
  });
  return {
    health: query.data ?? null,
    recommendations: query.data?.recommendations ?? EMPTY_RECOMMENDATIONS,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export function useDismissInstructorHealthRecommendation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: dismissInstructorHealthRecommendation,
    onSuccess: () => qc.invalidateQueries({ queryKey: HEALTH_KEY }),
  });
}