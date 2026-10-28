import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SessionDetailError, SessionDetailSkeleton, SessionNotFound } from "@/components/pages/sessions/detail";
import { TrainingSessionHero, TrainingSessionTimeline, TrainingSessionInfoStrip, TrainingSessionParticipation } from "@/components/pages/trainings/detail/session";
import { useInstructorSessionDetail } from "@/stores/useSessionsStore";
import { useInstructorTrainingOverview } from "@/stores/useTrainingsStore";
import { SITE } from "@/data/site";
import { useDynamicPageMetadata } from "@/hooks/useDynamicPageMetadata";

export const Route = createFileRoute("/_instructor/trainings/$trainingId/sessions/$sessionId")({
  head: () => ({
    meta: [
      { title: `${SITE.tool} - Session d'une formation | ${SITE.name}` },
      { name: "description", content: "Consultez le déroulement, la participation et l'historique d'une session de formation." },
    ],
  }),
  component: TrainingSessionPage,
});

function TrainingSessionPage() {
  const { trainingId, sessionId } = Route.useParams();
  const navigate = useNavigate();
  const { overview } = useInstructorTrainingOverview(trainingId);
  const { item: session, isLoading, isError, refetch } = useInstructorSessionDetail(sessionId);
  const isMatchingSession = session?.trainingId === trainingId;
  useDynamicPageMetadata(
    isMatchingSession && session
      ? `${SITE.tool} - ${session.title} | ${SITE.name}`
      : undefined,
    isMatchingSession && session
      ? `Session ${session.title} de la formation ${overview?.data.title ?? session.trainingTitle}.`
      : undefined,
  );

  const mainColor = overview?.data.coverColor || "var(--primary)";
  const trainingTitle = overview?.data.title ?? session?.trainingTitle ?? "la formation";

  const backLink = (
    <Button asChild variant="outline" size="sm">
      <Link to="/trainings/$trainingId" params={{ trainingId }} hash="sessions">
        <ArrowLeft className="size-4" /> Retour aux sessions de la formation
      </Link>
    </Button>
  );

  if (isLoading) return <SessionDetailSkeleton hero />;

  if (isError) {
    return (
      <div className="space-y-6">
        {backLink}
        <SessionDetailError onRetry={() => refetch()} />
      </div>
    );
  }

  // Le détail est identique quel que soit le chemin : on vérifie l'appartenance à la formation de l'URL
  if (!session || session.trainingId !== trainingId) {
    return (
      <div className="space-y-6">
        {backLink}
        <SessionNotFound>Session introuvable dans cette formation.</SessionNotFound>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {backLink}
      <TrainingSessionHero
        session={session}
        trainingTitle={trainingTitle}
        mainColor={mainColor}
        onDeleted={() => navigate({ to: "/trainings/$trainingId", params: { trainingId }, hash: "sessions" })}
      />
      <TrainingSessionInfoStrip session={session} mainColor={mainColor} />
      <TrainingSessionParticipation session={session} trainingId={trainingId} />
      <TrainingSessionTimeline session={session} />
    </div>
  );
}