import type { InstructorPaginationMeta } from "@/data/pagination";
import type { APICommunityAuthor, CommunityContentStatus } from "./community";
import type { CommunityReportLevel, CommunityReportReason, CommunityReportStatus } from "./community-moderation";

/* --------------------------------- Énumérations --------------------------------- */

export type CommunityReportTargetType = "post" | "comment";
export const COMMUNITY_REPORT_TARGET_TYPES: CommunityReportTargetType[] = ["post", "comment"];
export const communityReportTargetTypeLabels: Record<CommunityReportTargetType, string> = {
  post: "Publication",
  comment: "Commentaire",
};

/** App\Enums\CommunityReportStatus */
export const COMMUNITY_REPORT_STATUSES: CommunityReportStatus[] = ["pending", "resolved", "dismissed"];
export const communityReportStatusLabels: Record<CommunityReportStatus, string> = {
  pending: "À traiter",
  resolved: "Traité",
  dismissed: "Rejeté",
};

export function getCommunityReportStatusBadgeClass(status: CommunityReportStatus): string {
  if (status === "pending") return "bg-accent/20 text-accent-foreground border-accent/40";
  if (status === "resolved") return "bg-success/15 text-success border-success/30";
  return "bg-muted text-muted-foreground border-transparent";
}

/** App\Enums\CommunityReportLevel : qui traite le signalement */
export const communityReportLevelLabels: Record<CommunityReportLevel, string> = {
  instructor: "Formateurs de la formation",
  admin: "Administrateurs",
};

/** Actions de POST .../resolve (la suppression est réservée aux admins : utiliser escalate) */
export type CommunityReportResolveAction = "dismiss" | "hide";

/** Action enregistrée dans `resolution.action` — enum non communiqué, on tolère d'autres valeurs */
const resolutionLabels: Record<string, string> = {
  hidden: "Contenu masqué",
  dismissed: "Signalement rejeté",
  deleted: "Contenu supprimé par la modération",
  deleted_by_author: "Contenu supprimé par son auteur",
};

export function getCommunityReportResolutionLabel(action: string): string {
  return resolutionLabels[action] ?? action;
}

export const COMMUNITY_REPORT_NOTE_MAX = 1000;

/* ------------------------------------ Types ------------------------------------ */

/** Contenu signalé (les champs peuvent manquer si le contenu a été supprimé : `exists` vaut alors false) */
export interface APICommunityReportTarget {
  type: CommunityReportTargetType;
  id: string;
  exists: boolean;
  /** Publication qui contient le contenu (la publication elle-même pour un post) */
  postId: string;
  /** null pour un commentaire */
  title: string | null;
  excerpt: string | null;
  status: CommunityContentStatus | null;
  author: APICommunityAuthor | null;
  trainingId: string | null;
  trainingTitle: string | null;
  /** Nom de la catégorie */
  category: string | null;
}

export interface APICommunityReportResolution {
  /** hidden, dismissed, deleted… */
  action: string;
  note: string | null;
  by: APICommunityAuthor | null;
  at: string;
}

export interface APICommunityReportEscalation {
  note: string;
  at: string;
}

/** Item de GET /instructor/community/reports/list */
export interface APICommunityReport {
  id: string;
  status: CommunityReportStatus;
  level: CommunityReportLevel;
  reason: CommunityReportReason;
  details: string | null;
  reportedAt: string;
  reporter: APICommunityAuthor;
  target: APICommunityReportTarget;
  resolution: APICommunityReportResolution | null;
  escalation: APICommunityReportEscalation | null;
}

/** GET /instructor/community/reports/{id} (aussi renvoyé par resolve et escalate) — objet plat, sans clé `data` */
export interface APICommunityReportDetail extends APICommunityReport {
  target: APICommunityReportTarget & { body: string | null };
  /** Nombre total de signalements visant ce contenu */
  reportsOnTarget: number;
}

export interface APICommunityReportsStats {
  pending: number;
  resolved: number;
  dismissed: number;
}

export interface APICommunityReportsListResponse {
  stats: APICommunityReportsStats;
  data: APICommunityReport[];
  meta: InstructorPaginationMeta;
}

/** Paramètres de GET /instructor/community/reports/list (alias de type) */
export type CommunityReportsFilters = {
  status?: CommunityReportStatus;
  reason?: CommunityReportReason;
  targetType?: CommunityReportTargetType;
  trainingId?: string;
  page?: number;
  perPage?: number;
};

/* --------------------------------- Payloads --------------------------------- */

export interface CommunityReportResolvePayload {
  action: CommunityReportResolveAction;
  /** Facultative, 1000 caractères maximum */
  note?: string;
}

export interface CommunityReportEscalatePayload {
  /** Obligatoire */
  note: string;
}