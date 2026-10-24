import { getReviewRequestStatusLabel, type APIInstructorSessionDetail } from "@/data/sessions";

export type TimelineTone = "info" | "success" | "danger" | "muted";

export interface TimelineEvent {
  key: string;
  at: string;
  title: string;
  detail?: string | null;
  tone: TimelineTone;
}

/** Création, suspension éventuelle, puis chaque demande de réexamen et sa décision, du plus ancien au plus récent */
export function buildSessionTimeline(session: APIInstructorSessionDetail): TimelineEvent[] {
  const events: TimelineEvent[] = [
    { key: "created", at: session.createdAt, title: "Session créée et publiée", tone: "info" },
  ];

  if (session.suspendedAt) {
    events.push({
      key: "suspended",
      at: session.suspendedAt,
      title: "Session suspendue",
      detail: [session.suspensionReason, session.suspendedBy ? `Par ${session.suspendedBy}` : null]
        .filter(Boolean)
        .join(" — "),
      tone: "danger",
    });
  }

  session.reviewRequests.forEach((r) => {
    events.push({
      key: `${r.id}-request`,
      at: r.createdAt,
      title: "Demande de réexamen envoyée",
      detail: r.message,
      tone: "muted",
    });
    if (r.reviewedAt) {
      events.push({
        key: `${r.id}-review`,
        at: r.reviewedAt,
        title: `Réexamen : ${getReviewRequestStatusLabel(r.status).toLowerCase()}`,
        detail: r.rejectionReason,
        tone: r.status === "validated" ? "success" : r.status === "rejected" ? "danger" : "muted",
      });
    }
  });

  return events.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
}