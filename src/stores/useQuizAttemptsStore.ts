// src/stores/useQuizAttemptsStore.ts
import { useMutation } from "@tanstack/react-query";
import { instructorFetch } from "@/lib/api-url";
import { parseApiError } from "@/lib/api-error";
import type { APIInstructorQuizAttemptFeedback, InstructorQuizAttemptFeedbackPayload } from "@/data/quiz-attempts";

interface DetailResponse<T> {
  data: T;
}

async function sendQuizAttemptFeedback(
  attemptId: string,
  payload: InstructorQuizAttemptFeedbackPayload
): Promise<APIInstructorQuizAttemptFeedback> {
  const fd = new FormData();
  fd.append("comment", payload.comment);
  fd.append("validated", payload.validated ? "1" : "0");

  const response = await instructorFetch(`/api/instructor/quiz-attempts/${attemptId}/feedback`, {
    method: "POST",
    body: fd,
  });
  if (!response.ok) throw await parseApiError(response, "Erreur lors de l'envoi du feedback");
  const json: DetailResponse<APIInstructorQuizAttemptFeedback> = await response.json();
  return json.data;
}

// Pas d'invalidation : aucune liste de tentatives n'est encore consommée côté front.
export function useSendInstructorQuizAttemptFeedback() {
  return useMutation({
    mutationFn: ({ attemptId, payload }: { attemptId: string; payload: InstructorQuizAttemptFeedbackPayload }) =>
      sendQuizAttemptFeedback(attemptId, payload),
  });
}