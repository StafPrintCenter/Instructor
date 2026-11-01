/** Cible d'un signalement ou d'une modération : une publication ou un commentaire */
export interface CommunityTarget {
  kind: "post" | "comment";
  id: string;
}

/* ------------------------------- Signalement ------------------------------- */

/** App\Enums\CommunityReportReason */
export type CommunityReportReason = "spam" | "harassment" | "inappropriate" | "misinformation" | "off_topic" | "other";

export const COMMUNITY_REPORT_REASONS: CommunityReportReason[] = [
  "spam",
  "harassment",
  "inappropriate",
  "misinformation",
  "off_topic",
  "other",
];

export const communityReportReasonLabels: Record<CommunityReportReason, string> = {
  spam: "Spam ou publicité",
  harassment: "Harcèlement",
  inappropriate: "Contenu inapproprié",
  misinformation: "Désinformation",
  off_topic: "Hors sujet",
  other: "Autre",
};

export const communityReportReasonHints: Record<CommunityReportReason, string> = {
  spam: "Publicité, contenu répétitif ou sans intérêt.",
  harassment: "Propos blessants ou intimidants envers un membre.",
  inappropriate: "Contenu choquant ou contraire aux règles de la communauté.",
  misinformation: "Informations fausses ou trompeuses.",
  off_topic: "Sans rapport avec le sujet ou la formation.",
  other: "Précisez le problème ci-dessous.",
};

/** App\Enums\CommunityReportLevel : qui traite le signalement */
export type CommunityReportLevel = "instructor" | "admin";

/** App\Enums\CommunityReportStatus */
export type CommunityReportStatus = "pending" | "resolved" | "dismissed";

export const COMMUNITY_REPORT_LIMITS = { detailsMax: 1000 } as const;

export interface CommunityReportPayload {
  reason: CommunityReportReason;
  /** Obligatoire si reason = other ; 1000 caractères maximum */
  details?: string;
}

/** Réponse (201) de POST .../report — objet plat, sans clé `data` */
export interface APICommunityReportReceipt {
  id: string;
  level: CommunityReportLevel;
  status: CommunityReportStatus;
  /** Message prêt à afficher, selon le niveau retenu */
  message: string;
}

/* -------------------------------- Modération -------------------------------- */

export type CommunityPostModerationAction = "pin" | "unpin" | "lock" | "unlock" | "hide" | "unhide";
export type CommunityCommentModerationAction = "hide" | "unhide";

export const COMMUNITY_MODERATION_LIMITS = { reasonMax: 1000 } as const;

export const communityPostModerationMessages: Record<CommunityPostModerationAction, string> = {
  pin: "Publication épinglée.",
  unpin: "Épingle retirée.",
  lock: "Commentaires fermés.",
  unlock: "Commentaires rouverts.",
  hide: "Publication masquée.",
  unhide: "Publication rétablie.",
};

export const communityCommentModerationMessages: Record<CommunityCommentModerationAction, string> = {
  hide: "Commentaire masqué.",
  unhide: "Commentaire rétabli.",
};