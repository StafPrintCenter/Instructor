// src/routes/_instructor/sessions/$id.tsx
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, ExternalLink, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/instructor/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ReviewRequestStatusBadge,
  SessionActions,
  SessionModalityBadge,
  SessionResponseBadge,
  SessionStatusBadge,
} from "@/components/instructor/sessions";
import { useInstructorSessionDetail } from "@/stores/useSessionsStore";
import { formatSessionDateTime, formatSessionShortDateTime, formatSessionTimeRange } from "@/lib/session-time";
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

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{children}</dd>
    </div>
  );
}

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-16 animate-pulse rounded-lg bg-muted" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-64 animate-pulse rounded-lg bg-muted lg:col-span-2" />
          <div className="h-64 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        {backButton}
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-8 text-center">
          <AlertTriangle className="size-6 text-destructive" />
          <p className="text-sm text-muted-foreground">Impossible de charger cette session.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="size-4" /> Réessayer
          </Button>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="space-y-6">
        {backButton}
        <p className="text-muted-foreground">Session introuvable.</p>
      </div>
    );
  }

  const invited = session.invitedCount;
  const waiting = invited !== null ? Math.max(invited - session.confirmedCount - session.declinedCount, 0) : null;

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
        {/* Colonne principale */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle className="font-display text-lg">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <dl className="grid gap-4 sm:grid-cols-2">
                <InfoRow label="Date et heure">{formatSessionDateTime(session.startsAt)}</InfoRow>
                <InfoRow label="Horaire">
                  {formatSessionTimeRange(session.startsAt, session.endsAt)} · {Number(session.durationMinutes)} min
                </InfoRow>
                <InfoRow label="Modalité">
                  <SessionModalityBadge modality={session.modality} />
                </InfoRow>
                <InfoRow label={session.modality === "online" ? "Réunion en ligne" : "Lieu"}>
                  {session.modality === "online" ? (
                    session.meetingUrl ? (
                      <a
                        href={session.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        Rejoindre la réunion <ExternalLink className="size-3.5" />
                      </a>
                    ) : (
                      "Lien à définir"
                    )
                  ) : (
                    (session.location ?? "À définir")
                  )}
                </InfoRow>
                <InfoRow label="Animateur">{session.instructorName}</InfoRow>
                <InfoRow label="Créée le">{formatSessionShortDateTime(session.createdAt)}</InfoRow>
              </dl>

              {session.description ? (
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{session.description}</p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader>
              <CardTitle className="font-display text-lg">Réponses des apprenants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Invités</p>
                  <p className="text-lg font-semibold">{invited ?? "—"}</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Confirmés</p>
                  <p className="text-lg font-semibold">{session.confirmedCount}</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Absents</p>
                  <p className="text-lg font-semibold">{session.declinedCount}</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Sans réponse</p>
                  <p className="text-lg font-semibold">{waiting ?? "—"}</p>
                </div>
              </div>

              {session.responses.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun apprenant n'a encore répondu à l'invitation.</p>
              ) : (
                <ul className="space-y-2">
                  {session.responses.map((r) => (
                    <li
                      key={r.studentId}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2"
                    >
                      <Link
                        to="/students/$studentId"
                        params={{ studentId: r.studentId }}
                        className="text-sm font-medium hover:underline"
                      >
                        {r.studentName}
                      </Link>
                      <div className="flex items-center gap-3">
                        {r.respondedAt ? (
                          <span className="text-xs text-muted-foreground">{formatSessionShortDateTime(r.respondedAt)}</span>
                        ) : null}
                        <SessionResponseBadge response={r.response} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          <Card className="border-border/70">
            <CardContent className="space-y-3 p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Statut</p>
              <div className="flex flex-wrap items-center gap-1.5">
                <SessionStatusBadge status={session.status} />
                {!session.isUpcoming ? (
                  <span className="text-xs text-muted-foreground">Session passée</span>
                ) : null}
              </div>

              {session.status === "suspended" ? (
                <div className="space-y-1 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
                  <p className="font-medium text-destructive">Session suspendue</p>
                  {session.suspensionReason ? <p className="text-muted-foreground">{session.suspensionReason}</p> : null}
                  {session.suspendedAt ? (
                    <p className="text-xs text-muted-foreground">
                      Le {formatSessionShortDateTime(session.suspendedAt)}
                      {session.suspendedBy ? ` par ${session.suspendedBy}` : ""}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {session.pendingReviewRequest ? (
                <p className="rounded-lg border border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground">
                  Une demande de réexamen est en attente de décision.
                </p>
              ) : null}
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardContent className="space-y-3 p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Demandes de réexamen ({session.reviewRequests.length})
              </p>
              {session.reviewRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune demande.</p>
              ) : (
                <ul className="space-y-2">
                  {session.reviewRequests.map((r) => (
                    <li key={r.id} className="space-y-1.5 rounded-lg border border-border/60 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <ReviewRequestStatusBadge status={r.status} />
                        <span className="text-[11px] text-muted-foreground">{formatSessionShortDateTime(r.createdAt)}</span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm text-muted-foreground">{r.message}</p>
                      {r.reviewedAt ? (
                        <p className="text-xs text-muted-foreground">
                          Traitée le {formatSessionShortDateTime(r.reviewedAt)}
                          {r.rejectionReason ? ` — ${r.rejectionReason}` : ""}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Button asChild variant="outline" className="w-full">
            <Link
              to="/trainings/$trainingId/sessions/$sessionId"
              params={{ trainingId: session.trainingId, sessionId: session.id }}
            >
              Voir dans la formation
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}