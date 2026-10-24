import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/instructor/page-header";
import { Button } from "@/components/ui/button";
import { SessionActions } from "@/components/instructor/sessions";
import {
  SessionDetailError,
  SessionDetailSkeleton,
  SessionInfoCard,
  SessionNotFound,
  SessionResponsesCard,
  SessionReviewRequestsCard,
  SessionStatusCard,
  SessionTrainingLinks,
} from "@/components/instructor/sessions/detail";
import { useInstructorSessionDetail } from "@/stores/useSessionsStore";
import { formatSessionDateTime } from "@/lib/session-time";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/sessions/$id")({
  head: () => ({
    meta: [
      { title: `Session | Espace Formateur ${SITE.name}` },
      { name: "description", content: "Détail d'une session : horaires, lieu, réponses des apprenants et demandes de réexamen." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SessionDetailPage,
});

function SessionDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { item: session, isLoading, isError, refetch } = useInstructorSessionDetail(id);

  const backButton = (
    <Button asChild variant="outline" size="sm">
      <Link to="/sessions">
        <ArrowLeft className="size-4" /> Retour aux sessions
      </Link>
    </Button>
  );

  if (isLoading) return <SessionDetailSkeleton />;

  if (isError || !session) {
    return (
      <div className="space-y-6">
        {backButton}
        {isError ? <SessionDetailError onRetry={() => refetch()} /> : <SessionNotFound />}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={session.trainingTitle}
        title={session.title}
        description={formatSessionDateTime(session.startsAt)}
        actions={
          <>
            {backButton}
            <SessionActions session={session} onDeleted={() => navigate({ to: "/sessions" })} />
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SessionInfoCard session={session} />
          <SessionResponsesCard session={session} />
        </div>

        <div className="space-y-6">
          <SessionStatusCard session={session} />
          <SessionReviewRequestsCard session={session} />
          <SessionTrainingLinks session={session} />
        </div>
      </div>
    </div>
  );
}