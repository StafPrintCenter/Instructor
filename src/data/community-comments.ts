import type { APICommunityAuthor, CommunityAuthorRole, CommunityContentStatus } from "./community";

export type CommunityCommentSort = "oldest" | "recent" | "popular";
export const COMMUNITY_COMMENT_SORTS: CommunityCommentSort[] = ["oldest", "recent", "popular"];
export const communityCommentSortLabels: Record<CommunityCommentSort, string> = {
  oldest: "Plus anciens",
  recent: "Plus récents",
  popular: "Plus populaires",
};

export const COMMUNITY_COMMENT_LIMITS = { bodyMin: 1, bodyMax: 5000 } as const;

/** Personne visée par une réponse (le fil reste à 2 niveaux : la réponse est rattachée au commentaire racine) */
export interface APICommunityCommentReplyTo {
  commentId: string;
  authorId: string;
  authorName: string;
  authorRole: CommunityAuthorRole;
}

export interface APICommunityCommentPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canHide: boolean;
  canReply: boolean;
  canReact: boolean;
  canReport: boolean;
}

/** Commentaire (liste, réponses, création, modification) */
export interface APICommunityComment {
  id: string;
  postId: string;
  parentId: string | null;
  body: string;
  author: APICommunityAuthor;
  isPostAuthor: boolean;
  isBestAnswer: boolean;
  isMine: boolean;
  status: CommunityContentStatus;
  replyTo: APICommunityCommentReplyTo | null;
  repliesCount: number;
  reactionsTotal: number;
  reactions: Record<string, number>;
  myReaction: string | null;
  createdAt: string;
  editedAt: string | null;
  permissions: APICommunityCommentPermissions;
  hiddenReason?: string | null;
  hiddenAt?: string | null;
}

export interface CommunityCommentCreatePayload {
  body: string;
  parentId?: string;
}

/** Paramètres de GET /community/posts/{postId}/comments/list (alias de type) */
export type CommunityCommentFilters = {
  sort?: CommunityCommentSort;
  authorRole?: CommunityAuthorRole;
  page?: number;
  perPage?: number;
};

/** Paramètres de GET /community/comments/{id}/replies */
export type CommunityRepliesFilters = {
  page?: number;
  perPage?: number;
};