import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instructorFetch } from "@/lib/api/resolve-url";
import { parseApiError } from "@/lib/api/error";
import type { APIInstructorAttendanceRecord, InstructorAttendancePayload } from "@/data/attendance";

interface DetailResponse<T> {
  data: T;
}

async function markAttendance(
  enrollmentId: string,
  payload: InstructorAttendancePayload
): Promise<APIInstructorAttendanceRecord> {
  const fd = new FormData();
  fd.append("date", payload.date);
  fd.append("status", payload.status);

  const response = await instructorFetch(`/api/instructor/trainings/students/enrollments/${enrollmentId}/mark-attendance`, {
    method: "POST",
    body: fd,
  });
  if (!response.ok) throw await parseApiError(response, "Erreur lors de l'enregistrement de l'assiduité");
  const json: DetailResponse<APIInstructorAttendanceRecord> = await response.json();
  return json.data;
}

export function useMarkInstructorAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ enrollmentId, payload }: { enrollmentId: string; payload: InstructorAttendancePayload }) =>
      markAttendance(enrollmentId, payload),
    // Le taux d'assiduité des apprenants sera exposé via le détail de formation (clé "trainings")
    onSuccess: () => qc.invalidateQueries({ queryKey: ["trainings"] }),
  });
}