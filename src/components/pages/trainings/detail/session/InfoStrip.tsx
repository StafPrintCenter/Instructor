import type { ReactNode } from "react";
import { Clock, ExternalLink, MapPin, UserRound, Video } from "lucide-react";
import type { APIInstructorSessionDetail } from "@/data/sessions";
import { formatSessionTimeRange } from "@/lib/session-time";

function SessionTile({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-4">
      <span className="shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        {children}
      </div>
    </div>
  );
}

export function TrainingSessionInfoStrip({
  session,
  mainColor,
}: {
  session: APIInstructorSessionDetail;
  mainColor: string;
}) {
  const iconStyle = { color: mainColor };
  const isOnline = session.modality === "online";

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <SessionTile icon={<Clock className="size-5" style={iconStyle} />} label="Horaire">
        <p className="text-sm font-medium">
          {formatSessionTimeRange(session.startsAt, session.endsAt)} · {Number(session.durationMinutes)} min
        </p>
      </SessionTile>

      <SessionTile
        icon={isOnline ? <Video className="size-5" style={iconStyle} /> : <MapPin className="size-5" style={iconStyle} />}
        label={isOnline ? "Réunion en ligne" : "Lieu"}
      >
        {isOnline && session.meetingUrl ? (
          <a
            href={session.meetingUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Rejoindre <ExternalLink className="size-3.5" />
          </a>
        ) : (
          <p className="truncate text-sm font-medium">{session.location ?? "À définir"}</p>
        )}
      </SessionTile>

      <SessionTile icon={<UserRound className="size-5" style={iconStyle} />} label="Animateur">
        <p className="text-sm font-medium">{session.instructorName}</p>
      </SessionTile>
    </div>
  );
}