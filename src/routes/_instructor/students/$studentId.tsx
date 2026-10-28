import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/site";
import { Button } from "@/components/ui/button";
import { StudentDetailError, StudentDetailSkeleton, StudentProfileCard, StudentSummaryStats, StudentTrainingsSection, summarizeStudentTrainings } from "@/components/pages/students/detail";
import { useInstructorStudentGlobal } from "@/stores/useStudentsStore";
import { SITE } from "@/data/site";
import { useDynamicPageMetadata } from "@/hooks/useDynamicPageMetadata";

export const Route = createFileRoute("/_instructor/students/$studentId")({
  head: () => ({
    meta: [
      { title: `${SITE.tool} - Profil d'un apprenant | ${SITE.name}` },
      { name: "description", content: "Consultez les formations suivies, la progression, les travaux remis et l'assiduité de l'apprenant." },
    ],
  }),
  component: StudentGlobalPage,
});

function StudentGlobalPage() {
  const { studentId } = Route.useParams();
  const { overview, isLoading, isError, error, refetch } = useInstructorStudentGlobal(studentId);
  useDynamicPageMetadata(
    overview ? `${SITE.tool} - ${overview.data.name} | ${SITE.name}` : undefined,
    overview ? `Suivi de ${overview.data.name} dans ses formations : progression, travaux, quiz et assiduité.` : undefined,
  );

  const backButton = (
    <Button asChild variant="outline" size="sm">
      <Link to="/students">
        <ArrowLeft className="size-4" /> Retour aux apprenants
      </Link>
    </Button>
  );

  if (isLoading) return <StudentDetailSkeleton />;

  if (isError) {
    return (
      <div className="space-y-6">
        {backButton}
        <StudentDetailError message={error?.message || "Impossible de charger cet apprenant."} onRetry={() => refetch()} />
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="space-y-6">
        {backButton}
        <p className="text-muted-foreground">Apprenant introuvable.</p>
      </div>
    );
  }

  const { data: student, trainings } = overview;
  const { toReview, averageAttendance } = summarizeStudentTrainings(trainings);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Profil apprenant"
        title={student.name}
        description={`Vue d'ensemble de l\'apprenant ${student.firstName} sur toutes vos formations.`}
        actions={backButton}
      />

      <StudentProfileCard student={student} />
      <StudentSummaryStats student={student} toReview={toReview} averageAttendance={averageAttendance} />
      <StudentTrainingsSection trainings={trainings} studentId={student.studentId} />
    </div>
  );
}