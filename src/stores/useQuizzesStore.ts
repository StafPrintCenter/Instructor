import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { instructorFetch } from "@/lib/api-url";
import { parseApiError } from "@/lib/api-error";
import type { APIQuiz, APIQuizQuestion, QuizPayload, QuizQuestionPayload } from "@/data/content";

const resourceKey = "instructor-quizzes";

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

async function fetchQuiz(id: string): Promise<APIQuiz | null> {
  const response = await instructorFetch(`/api/instructor/trainings/quizzes/${id}`);
  if (response.status === 404) return null;
  if (!response.ok) throw await parseApiError(response, "Erreur lors de la récupération du quiz");
  const json: DetailResponse<APIQuiz> = await response.json();
  return json.data;
}

async function createQuiz(lessonId: string, payload: QuizPayload): Promise<APIQuiz> {
  const response = await instructorFetch(`/api/instructor/trainings/quizzes/${lessonId}/create`, {
    method: "POST",
    body: buildFormData(payload as unknown as Record<string, unknown>),
  });
  if (!response.ok) throw await parseApiError(response, "Erreur lors de la création du quiz");
  const json: DetailResponse<APIQuiz> = await response.json();
  return json.data;
}

async function updateQuiz(id: string, payload: QuizPayload): Promise<APIQuiz> {
  const response = await instructorFetch(`/api/instructor/trainings/quizzes/${id}`, {
    method: "PUT",
    body: buildFormData(payload as unknown as Record<string, unknown>),
  });
  if (!response.ok) throw await parseApiError(response, "Erreur lors de la modification du quiz");
  const json: DetailResponse<APIQuiz> = await response.json();
  return json.data;
}

async function deleteQuiz(id: string): Promise<void> {
  const response = await instructorFetch(`/api/instructor/trainings/quizzes/${id}`, { method: "DELETE" });
  if (!response.ok && response.status !== 204) throw await parseApiError(response, "Erreur lors de la suppression du quiz");
}

async function submitQuizForReview(id: string): Promise<APIQuiz> {
  const response = await instructorFetch(`/api/instructor/trainings/quizzes/${id}/submit-for-review`, { method: "PUT" });
  if (!response.ok) throw await parseApiError(response, "Erreur lors de la soumission du quiz");
  const json: DetailResponse<APIQuiz> = await response.json();
  return json.data;
}

async function createQuestion(quizId: string, payload: QuizQuestionPayload): Promise<APIQuizQuestion> {
  const response = await instructorFetch(`/api/instructor/quizzes/${quizId}/questions/create`, {
    method: "POST",
    body: buildFormData(payload as unknown as Record<string, unknown>),
  });
  if (!response.ok) throw await parseApiError(response, "Erreur lors de la création de la question");
  const json: DetailResponse<APIQuizQuestion> = await response.json();
  return json.data;
}

async function updateQuestion(id: string, payload: QuizQuestionPayload): Promise<APIQuizQuestion> {
  const response = await instructorFetch(`/api/instructor/questions/${id}`, {
    method: "PUT",
    body: buildFormData(payload as unknown as Record<string, unknown>),
  });
  if (!response.ok) throw await parseApiError(response, "Erreur lors de la modification de la question");
  const json: DetailResponse<APIQuizQuestion> = await response.json();
  return json.data;
}

async function deleteQuestion(id: string): Promise<void> {
  const response = await instructorFetch(`/api/instructor/questions/${id}`, { method: "DELETE" });
  if (!response.ok && response.status !== 204) throw await parseApiError(response, "Erreur lors de la suppression de la question");
}

export function useQuiz(id: string | undefined) {
  const query = useQuery({
    queryKey: [resourceKey, "detail", id],
    queryFn: () => fetchQuiz(id as string),
    enabled: !!id,
  });
  return { quiz: query.data ?? null, isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
}

function setQuizCache(qc: ReturnType<typeof useQueryClient>, quiz: APIQuiz) {
  qc.setQueryData([resourceKey, "detail", quiz.id], quiz);
}

export function useCreateQuiz() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, payload }: { lessonId: string; payload: QuizPayload }) => createQuiz(lessonId, payload),
    onSuccess: (quiz) => setQuizCache(qc, quiz),
  });
}

export function useUpdateQuiz() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: QuizPayload }) => updateQuiz(id, payload),
    onSuccess: (quiz) => setQuizCache(qc, quiz),
  });
}

export function useDeleteQuiz() {
  return useMutation({
    mutationFn: (id: string) => deleteQuiz(id),
  });
}

export function useSubmitQuizForReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => submitQuizForReview(id),
    onSuccess: (quiz) => setQuizCache(qc, quiz),
  });
}

export function useCreateQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ quizId, payload }: { quizId: string; payload: QuizQuestionPayload }) => createQuestion(quizId, payload),
    onSuccess: (_question, { quizId }) => qc.invalidateQueries({ queryKey: [resourceKey, "detail", quizId] }),
  });
}

export function useUpdateQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quizId, payload }: { id: string; quizId: string; payload: QuizQuestionPayload }) => updateQuestion(id, payload),
    onSuccess: (_question, { quizId }) => qc.invalidateQueries({ queryKey: [resourceKey, "detail", quizId] }),
  });
}

export function useDeleteQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quizId }: { id: string; quizId: string }) => deleteQuestion(id).then(() => quizId),
    onSuccess: (quizId) => qc.invalidateQueries({ queryKey: [resourceKey, "detail", quizId] }),
  });
}