import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { instructorFetch } from "@/lib/api-url";
import type { APIInstructorModule, InstructorModulePayload } from "@/data/content";

const resourceKey = "instructor-modules";

interface ListResponse<T> {
  data: T[];
}
interface DetailResponse<T> {
  data: T;
}

function buildFormData(payload: Record<string, unknown>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined) continue;
    if (typeof value === "boolean") {
      fd.append(key, value ? "1" : "0");
    } else if (value === null) {
      fd.append(key, "");
    } else {
      fd.append(key, String(value));
    }
  }
  return fd;
}

async function fetchModules(trainingId: string): Promise<APIInstructorModule[]> {
  const response = await instructorFetch(`/api/instructor/trainings/${trainingId}/modules/list`);
  if (!response.ok) throw new Error("Erreur lors de la récupération des modules");
  const json: ListResponse<APIInstructorModule> = await response.json();
  return json.data;
}

async function createModule(trainingId: string, payload: InstructorModulePayload): Promise<APIInstructorModule> {
  const response = await instructorFetch(`/api/instructor/trainings/${trainingId}/modules/create`, {
    method: "POST",
    body: buildFormData(payload as unknown as Record<string, unknown>),
  });
  if (!response.ok) throw new Error("Erreur lors de la création du module");
  const json: DetailResponse<APIInstructorModule> = await response.json();
  return json.data;
}

async function updateModule(id: string, payload: InstructorModulePayload): Promise<APIInstructorModule> {
  const response = await instructorFetch(`/api/instructor/modules/${id}`, {
    method: "PUT",
    body: buildFormData(payload as unknown as Record<string, unknown>),
  });
  if (!response.ok) throw new Error("Erreur lors de la modification du module");
  const json: DetailResponse<APIInstructorModule> = await response.json();
  return json.data;
}

async function deleteModule(id: string): Promise<void> {
  const response = await instructorFetch(`/api/instructor/modules/${id}`, { method: "DELETE" });
  if (!response.ok && response.status !== 204) throw new Error("Erreur lors de la suppression du module");
}

async function submitModuleForReview(id: string): Promise<APIInstructorModule> {
  const response = await instructorFetch(`/api/instructor/modules/${id}/submit-for-review`, { method: "PUT" });
  if (!response.ok) throw new Error("Erreur lors de la soumission du module");
  const json: DetailResponse<APIInstructorModule> = await response.json();
  return json.data;
}

export function useModulesList(trainingId: string | undefined) {
  const query = useQuery({
    queryKey: [resourceKey, "list", trainingId],
    queryFn: () => fetchModules(trainingId as string),
    enabled: !!trainingId,
  });
  return { modules: query.data ?? [], isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
}

export function useCreateModule(trainingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: InstructorModulePayload) => createModule(trainingId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [resourceKey, "list", trainingId] }),
  });
}

export function useUpdateModule(trainingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: InstructorModulePayload }) => updateModule(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [resourceKey, "list", trainingId] }),
  });
}

export function useDeleteModule(trainingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteModule(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [resourceKey, "list", trainingId] }),
  });
}

export function useSubmitModuleForReview(trainingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => submitModuleForReview(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [resourceKey, "list", trainingId] }),
  });
}