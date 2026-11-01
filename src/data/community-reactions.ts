import type { InstructorPaginationMeta } from "@/data/pagination";
import type { APICommunityAuthor, CommunityAuthorRole } from "./community";

/** App\Enums\CommunityReactionType */
export type CommunityReactionType = "like" | "love" | "celebrate" | "support" | "insightful" | "funny";

/** Ordre d'affichage dans le sélecteur */
export const COMMUNITY_REACTION_TYPES: CommunityReactionType[] = [
  "like",
  "love",
  "celebrate",
  "support",
  "insightful",
  "funny",
];

export const communityReactionEmojis: Record<CommunityReactionType, string> = {
  like: "👍",
  love: "❤️",
  celebrate: "🎉",
  support: "🤝",
  insightful: "💡",
  funny: "😄",
};

export const communityReactionLabels: Record<CommunityReactionType, string> = {
  like: "J'aime",
  love: "J'adore",
  celebrate: "Bravo",
  support: "Soutien",
  insightful: "Instructif",
  funny: "Drôle",
};

/** Les compteurs de l'API sont indexés par chaîne : on tolère un type inconnu */
export function getReactionEmoji(type: string): string {
  return communityReactionEmojis[type as CommunityReactionType] ?? "👍";
}

export function getReactionLabel(type: string): string {
  return communityReactionLabels[type as CommunityReactionType] ?? type;
}

/** Cible d'une réaction : une publication ou un commentaire */
export type ReactionTargetKind = "post" | "comment";

export interface ReactionTarget {
  kind: ReactionTargetKind;
  id: string;
}

/** Réponse de PUT / DELETE .../reaction */
export interface APICommunityReactionSummary {
  myReaction: string | null;
  reactions: Record<string, number>;
  reactionsTotal: number;
}

/** Une réaction dans « Qui a réagi » */
export interface APICommunityReactionEntry {
  id: string;
  type: CommunityReactionType;
  reactedAt: string;
  user: APICommunityAuthor;
}

/** GET .../reactions/list */
export interface APICommunityReactionsListResponse {
  summary: Record<string, number>;
  total: number;
  data: APICommunityReactionEntry[];
  meta: InstructorPaginationMeta;
}

/** Paramètres de GET .../reactions/list (alias de type) */
export type CommunityReactionsFilters = {
  type?: CommunityReactionType;
  role?: CommunityAuthorRole;
  page?: number;
  perPage?: number;
};