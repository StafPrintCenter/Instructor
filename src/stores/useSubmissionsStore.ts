import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instructorFetch } from "@/lib/api/resolve-url";
import { parseApiError } from "@/lib/api/error";
import { createResourceStore } from "./createResourceStore";
import type {
  APIInstructorCorrectionsListResponse,
  APIInstructorSubmission,
  APIInstructorSubmissionDetail,
  APIInstructorSubmissionGraded,
  InstructorCorrectionsFilters,
  InstructorSubmissionGradePayload,
} from "@/data/submissions";

const resourceKey = "submissions";

/** Liste simple « Travaux rendus » : /instructor/trainings/students/submissions/list */
const studentsListPath = "trainings/students/submissions";
/** Corrections (liste + stats), détail et notation : /instructor/trainings/submissions/... */
const submissionsPath = "trainings/submissions";

// fetchList({ status, page }) → /api/instructor/trainings/students/submissions/list?status=...&page=...
const store = createResourceStore<APIInstructorSubmission>({ resourceKey, basePath: studentsListPath });

export const fetchInstructorSubmissions = store.fetchList;
export const useInstructorSubmissionsList = store.useList;

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

  const response = await instructorFetch(`/api/instructor/${submissionsPath}/${id}/grade`, { method: "PUT", body: fd });
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

/* ---- Corrections : liste globale (stats + items + meta) ---- */

async function fetchCorrections(filters: InstructorCorrectionsFilters): Promise<APIInstructorCorrectionsListResponse> {
  const qp = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") qp.append(key, String(value));
  }

  const response = await instructorFetch(`/api/instructor/${submissionsPath}/list?${qp.toString()}`);
  if (!response.ok) throw await parseApiError(response, "Erreur lors de la récupération des corrections");
  return response.json();
}

export function useInstructorCorrectionsList(filters: InstructorCorrectionsFilters = {}) {
  const query = useQuery({
    // préfixe "submissions" : invalidé par la notation
    queryKey: [resourceKey, "corrections", filters],
    queryFn: () => fetchCorrections(filters),
    staleTime: 1000 * 30,
    placeholderData: keepPreviousData, // pas de clignotement lors d'un changement de filtre ou de page
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

/* ---- Corrections : détail d'une soumission ---- */

async function fetchCorrectionDetail(id: string): Promise<APIInstructorSubmissionDetail | null> {
  const response = await instructorFetch(`/api/instructor/${submissionsPath}/${id}`);
  if (response.status === 404) return null;
  if (!response.ok) throw await parseApiError(response, "Erreur lors de la récupération de la soumission");
  const json: { data: APIInstructorSubmissionDetail } = await response.json();
  return json.data;
}

export function useInstructorSubmissionDetail(id: string | undefined) {
  const query = useQuery({
    queryKey: [resourceKey, "correction-detail", id ?? ""],
    queryFn: () => fetchCorrectionDetail(id as string),
    enabled: !!id,
  });

  return {
    submission: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}