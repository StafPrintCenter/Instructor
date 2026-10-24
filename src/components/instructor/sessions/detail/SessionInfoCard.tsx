import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionModalityBadge } from "@/components/instructor/sessions";
import type { APIInstructorSessionDetail } from "@/data/sessions";
import { formatSessionDateTime, formatSessionShortDateTime, formatSessionTimeRange } from "@/lib/session-time";

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{children}</dd>
    </div>
  );
}

export function SessionInfoCard({ session }: { session: APIInstructorSessionDetail }) {
  return (
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
  );
}