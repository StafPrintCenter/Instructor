import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instructorFetch } from "@/lib/api-url";
import { parseApiError } from "@/lib/api-error";
import { createResourceStore } from "./createResourceStore";
import type {
  APIInstructorSubmission,
  APIInstructorSubmissionGraded,
  InstructorSubmissionGradePayload,
} from "@/data/submissions";

const resourceKey = "submissions";
const basePath = "trainings/students/submissions";

// fetchList({ status, page }) → /api/instructor/trainings/submissions/list?status=...&page=...
const store = createResourceStore<APIInstructorSubmission>({ resourceKey, basePath });

export const fetchInstructorSubmissions = store.fetchList;
export const useInstructorSubmissionsList = store.useList;

/* ---- Action dédiée ---- */

interface GradeResponse {
  message: string;
  data: APIInstructorSubmissionGraded;
}

async function gradeSubmission(
  id: string,
  payload: InstructorSubmissionGradePayload
): Promise<APIInstructorSubmissionGraded> {
  const fd = new FormData();
  fd.append("decision", payload.decision);
  if (payload.note !== undefined) fd.append("note", String(payload.note));
  if (payload.comment) fd.append("comment", payload.comment);

  const response = await instructorFetch(`/api/instructor/${basePath}/${id}/grade`, { method: "PUT", body: fd });
  if (!response.ok) throw await parseApiError(response, "Erreur lors de la notation du travail");
  const json: GradeResponse = await response.json();
  return json.data;
}

export function useGradeInstructorSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: InstructorSubmissionGradePayload }) =>
      gradeSubmission(id, payload),
    // La réponse ne contient ni body ni fileUrl : on refetch.
    // "trainings" couvre le suivi apprenant et la progression (une validation peut compléter une leçon).
    onSuccess: () =>
      Promise.all([
        qc.invalidateQueries({ queryKey: [resourceKey] }),
        qc.invalidateQueries({ queryKey: ["trainings"] }),
      ]),
  });
}