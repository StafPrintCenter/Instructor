import { getLatestFeedback, type APIInstructorSubmission, type APIInstructorSubmissionDetail } from "@/data/submissions";

export function buildGradeTarget(d: APIInstructorSubmissionDetail): APIInstructorSubmission {
  const latest = getLatestFeedback(d.feedbacks);

  return {
    id: d.submissionId,
    lessonId: d.lesson.id,
    lessonTitle: d.lesson.title,
    studentId: d.student.id,
    studentName: d.student.name,
    body: d.body,
    fileUrl: d.fileUrl,
    status: d.status,
    submittedAt: d.submittedAt,
    feedback: latest
      ? { id: latest.id, note: latest.note, comment: latest.comment, validated: latest.validated }
      : null,
  };
}