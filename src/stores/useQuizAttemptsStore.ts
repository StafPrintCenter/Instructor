import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instructorFetch } from "@/lib/api/resolve-url";
import { parseApiError } from "@/lib/api/error";
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

  const response = await instructorFetch(`/api/instructor/trainings/students/quiz-attempts/${attemptId}/feedback`, {
    method: "POST",
    body: fd,
  });
  if (!response.ok) throw await parseApiError(response, "Erreur lors de l'envoi du feedback");
  const json: DetailResponse<APIInstructorQuizAttemptFeedback> = await response.json();
  return json.data;
}

export function useSendInstructorQuizAttemptFeedback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ attemptId, payload }: { attemptId: string; payload: InstructorQuizAttemptFeedbackPayload }) =>
      sendQuizAttemptFeedback(attemptId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["trainings"] }),
  });
}