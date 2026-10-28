import type { APIInstructorStudentTrainingFollowUp } from "@/data/students";

/** Agrégats calculés à partir des formations d'un apprenant */
export function summarizeStudentTrainings(
  trainings: APIInstructorStudentTrainingFollowUp[]) {
  const toReview = trainings.reduce(
    (sum, t) => sum + t.submissions.filter((s) => s.status === "submitted").length,
    0
  );

  const ratios = trainings.map((t) => t.attendance.ratio).filter((r): r is number => r !== null);
  const averageAttendance = ratios.length > 0 ? Math.round(ratios.reduce((a, b) => a + b, 0) / ratios.length) : null;

  return { toReview, averageAttendance };
}