// src/stores/useLessonsStore.ts
import { useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { instructorFetch } from "@/lib/api-url";
import type { APIInstructorLesson, InstructorLessonPayload } from "@/data/content";

const resourceKey = "instructor-lessons";

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
    } else if (Array.isArray(value)) {
      fd.append(key, JSON.stringify(value));
    } else if (value === null) {
      fd.append(key, "");
    } else {
      fd.append(key, String(value));
    }
  }
  return fd;
}

async function fetchLessons(moduleId: string): Promise<APIInstructorLesson[]> {
  const response = await instructorFetch(`/api/instructor/modules/${moduleId}/lessons/list`);
  if (!response.ok) throw new Error("Erreur lors de la récupération des leçons");
  const json: ListResponse<APIInstructorLesson> = await response.json();
  return json.data;
}

async function createLesson(moduleId: string, payload: InstructorLessonPayload): Promise<APIInstructorLesson> {
  const response = await instructorFetch(`/api/instructor/modules/${moduleId}/lessons/create`, {
    method: "POST",
    body: buildFormData(payload as unknown as Record<string, unknown>),
  });
  if (!response.ok) throw new Error("Erreur lors de la création de la leçon");
  const json: DetailResponse<APIInstructorLesson> = await response.json();
  return json.data;
}

async function updateLesson(id: string, payload: InstructorLessonPayload): Promise<APIInstructorLesson> {
  const response = await instructorFetch(`/api/instructor/lessons/${id}`, {
    method: "PUT",
    body: buildFormData(payload as unknown as Record<string, unknown>),
  });
  if (!response.ok) throw new Error("Erreur lors de la modification de la leçon");
  const json: DetailResponse<APIInstructorLesson> = await response.json();
  return json.data;
}

async function deleteLesson(id: string): Promise<void> {
  const response = await instructorFetch(`/api/instructor/lessons/${id}`, { method: "DELETE" });
  if (!response.ok && response.status !== 204) throw new Error("Erreur lors de la suppression de la leçon");
}

async function submitLessonForReview(id: string): Promise<APIInstructorLesson> {
  const response = await instructorFetch(`/api/instructor/lessons/${id}/submit-for-review`, { method: "PUT" });
  if (!response.ok) throw new Error("Erreur lors de la soumission de la leçon");
  const json: DetailResponse<APIInstructorLesson> = await response.json();
  return json.data;
}

/** Récupère les leçons de plusieurs modules en parallèle (l'API n'expose pas de liste globale par formation). */
export function useLessonsByModules(moduleIds: string[]) {
  const results = useQueries({
    queries: moduleIds.map((moduleId) => ({
      queryKey: [resourceKey, "list", moduleId],
      queryFn: () => fetchLessons(moduleId),
    })),
  });

  const isLoading = results.some((r) => r.isLoading);
  const lessonsByModule: Record<string, APIInstructorLesson[]> = {};
  moduleIds.forEach((moduleId, i) => {
    lessonsByModule[moduleId] = results[i]?.data ?? [];
  });

  return { lessonsByModule, isLoading };
}

function invalidateModule(qc: ReturnType<typeof useQueryClient>, moduleId: string) {
  qc.invalidateQueries({ queryKey: [resourceKey, "list", moduleId] });
}

export function useCreateLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ moduleId, payload }: { moduleId: string; payload: InstructorLessonPayload }) =>
      createLesson(moduleId, payload),
    onSuccess: (_data, { moduleId }) => invalidateModule(qc, moduleId),
  });
}

export function useUpdateLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, moduleId, payload }: { id: string; moduleId: string; payload: InstructorLessonPayload }) =>
      updateLesson(id, payload),
    onSuccess: (_data, { moduleId }) => invalidateModule(qc, moduleId),
  });
}

export function useDeleteLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, moduleId }: { id: string; moduleId: string }) => deleteLesson(id).then(() => moduleId),
    onSuccess: (moduleId) => invalidateModule(qc, moduleId),
  });
}

export function useSubmitLessonForReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, moduleId }: { id: string; moduleId: string }) => submitLessonForReview(id).then((l) => ({ l, moduleId })),
    onSuccess: ({ moduleId }) => invalidateModule(qc, moduleId),
  });
}