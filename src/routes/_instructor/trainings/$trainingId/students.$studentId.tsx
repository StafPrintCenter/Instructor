import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AttendanceMarkDialog } from "@/components/pages/trainings/shared";
import {
  AttendanceSection,
  LessonProgressSection,
  QuizAttemptsSection,
  StudentFollowUpError,
  StudentFollowUpFallback,
  StudentFollowUpHeader,
  StudentFollowUpSkeleton,
  StudentStatsGrid,
  StudentSubmissionsSection,
} from "@/components/pages/trainings/detail/student";
import { useInstructorTrainingStudent } from "@/stores/useTrainingStudentsStore";
import { SITE } from "@/data/site";
import { useDynamicPageMetadata } from "@/hooks/useDynamicPageMetadata";

export const Route = createFileRoute("/_instructor/trainings/$trainingId/students/$studentId")({
  head: () => ({
    meta: [
      { title: `${SITE.tool} - Suivi d'un apprenant | ${SITE.name}` },
      { name: "description", content: "Consultez la progression, les travaux remis, les quiz et l'assiduité d'un apprenant." },
    ],
  }),
  component: StudentDetailPage,
});

function StudentDetailPage() {
  const { trainingId, studentId } = Route.useParams();
  const { detail, isLoading, isError, error, refetch } = useInstructorTrainingStudent(trainingId, studentId);
  const [attendanceOpen, setAttendanceOpen] = useState(false);

  const studentName = detail
    ? `${detail.data.firstName} ${detail.data.lastName}`.trim() || detail.data.email
    : undefined;
  useDynamicPageMetadata(
    studentName ? `${SITE.tool} - ${studentName} | ${SITE.name}` : undefined,
    studentName ? `Suivi de ${studentName} dans la formation : progression, travaux, quiz et assiduité.` : undefined,
  );

  if (isLoading) return <StudentFollowUpSkeleton />;

  if (isError) {
    return (
      <StudentFollowUpFallback trainingId={trainingId}>
        <StudentFollowUpError
          message={error?.message || "Impossible de charger le suivi de cet apprenant."}
          onRetry={() => refetch()}
        />
      </StudentFollowUpFallback>
    );
  }

  if (!detail || !studentName) {
    return (
      <StudentFollowUpFallback trainingId={trainingId}>
        <p className="text-muted-foreground">Apprenant introuvable.</p>
      </StudentFollowUpFallback>
    );
  }

  const { data: student, lessonProgress, quizAttempts, submissions, attendance } = detail;

  return (
    <div className="space-y-8">
      <StudentFollowUpHeader
        trainingId={trainingId}
        name={studentName}
        email={student.email}
        onMarkAttendance={() => setAttendanceOpen(true)}
      />

      <StudentStatsGrid student={student} attendanceRatio={attendance.ratio} />
      <StudentSubmissionsSection student={student} submissions={submissions} />
      <QuizAttemptsSection attempts={quizAttempts} studentName={studentName} />
      <LessonProgressSection lessons={lessonProgress} />
      <AttendanceSection attendance={attendance} onMark={() => setAttendanceOpen(true)} />

      <AttendanceMarkDialog
        enrollmentId={attendanceOpen ? student.enrollmentId : null}
        studentName={studentName}
        onClose={() => setAttendanceOpen(false)}
      />
    </div>
  );
}