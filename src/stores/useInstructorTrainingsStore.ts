// src/stores/useInstructorTrainingsStore.ts
import { useQuery } from "@tanstack/react-query";
import { adminFetch } from "@/lib/api-url";
import type { APIInstructorTrainingAssignment } from "@/data/trainings";

interface ListResponse<T> {
  data: T[];
}

export async function fetchInstructorTrainings(): Promise<APIInstructorTrainingAssignment[]> {
  const response = await adminFetch(`/api/instructor/trainings/list`);
  if (!response.ok) throw new Error(`Erreur lors de la récupération des formations assignées`);
  const json: ListResponse<APIInstructorTrainingAssignment> = await response.json();
  return json.data;
}

export function useInstructorTrainingsList() {
  const query = useQuery({
    queryKey: ["instructor-trainings", "list"],
    queryFn: fetchInstructorTrainings,
    staleTime: 1000 * 30,
  });
  return {
    trainings: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}