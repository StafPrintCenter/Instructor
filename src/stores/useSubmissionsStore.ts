import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instructorFetch } from "@/lib/api-url";
import { parseApiError } from "@/lib/api-error";
import { createResourceStore } from "./createResourceStore";
import type {
  APIInstructorCorrectionListItem,
  APIInstructorCorrectionsListResponse,
  APIInstructorSubmissionDetail,
  APIInstructorSubmissionGraded,
  InstructorCorrectionsFilters,
  InstructorSubmissionGradePayload,
} from "@/data/submissions";

const resourceKey = "submissions";
const basePath = "trainings/students/submissions";

// Les items de liste et le détail n'ont pas de champ `id` (clé = submissionId) alors que la factory
// l'exige dans son contrat. `id` n'est jamais lu : les hooks exposés renvoient les vrais types.
const listStore = createResourceStore<APIInstructorCorrectionListItem & { id: string }>({ resourceKey, basePath });
const detailStore = createResourceStore<APIInstructorSubmissionDetail & { id: string }>({ resourceKey, basePath });

/* ---- Liste (stats + items + meta) ---- */

export function useInstructorCorrectionsList(filters: InstructorCorrectionsFilters = {}) {
  const query = useQuery({
    // préfixe "submissions" : invalidé par la notation
    queryKey: [resourceKey, "corrections", filters],
    // fetchList renvoie la réponse JSON complète, stats incluses (non typées par la factory)
    queryFn: async () => (await listStore.fetchList(filters)) as unknown as APIInstructorCorrectionsListResponse,
    staleTime: 1000 * 30,
    placeholderData: keepPreviousData, // évite le clignotement lors d'un changement de filtre / de page
  });

  return {
    stats: query.data?.stats ?? null,
    items: query.data?.data ?? [],
    meta: query.data?.meta ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  };
}

/* ---- Détail : GET /instructor/trainings/submissions/{id} ---- */

export function useInstructorSubmissionDetail(id: string | undefined) {
  const { item, isLoading, isError, refetch } = detailStore.useDetail(id);
  const submission: APIInstructorSubmissionDetail | null = item;
  return { submission, isLoading, isError, refetch };
}

/* ---- Notation : PUT /instructor/trainings/submissions/{id}/grade ---- */

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
    // Rafraîchit liste, stats et détail ("submissions"), ainsi que suivi apprenant et progression ("trainings")
    onSuccess: () =>
      Promise.all([
        qc.invalidateQueries({ queryKey: [resourceKey] }),
        qc.invalidateQueries({ queryKey: ["trainings"] }),
      ]),
  });
}