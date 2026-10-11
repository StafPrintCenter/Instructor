// src/stores/useSubmissionsStore.ts
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
const basePath = "submissions";

// Liste filtrable : fetchList({ status: "submitted" }) → /api/instructor/submissions/list?status=submitted
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
    // La réponse ne contient ni body ni fileUrl et la liste dépend du filtre actif :
    // on refetch plutôt que de fusionner dans le cache.
    onSuccess: () => qc.invalidateQueries({ queryKey: [resourceKey] }),
  });
}