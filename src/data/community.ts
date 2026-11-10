/** App\Enums\CommunityPostType */
export type CommunityPostType = "discussion" | "question" | "resource" | "announcement";
export const COMMUNITY_POST_TYPES: CommunityPostType[] = ["discussion", "question", "resource", "announcement"];
export const communityPostTypeLabels: Record<CommunityPostType, string> = {
  discussion: "Discussion",
  question: "Question",
  resource: "Ressource",
  announcement: "Annonce",
};

/** App\Enums\CommunityContentStatus */
export type CommunityContentStatus = "published" | "hidden";
export const communityContentStatusLabels: Record<CommunityContentStatus, string> = {
  published: "Publiées",
  hidden: "Masquées",
};

export type CommunityAuthorRole = "admin" | "instructor" | "student";
export const COMMUNITY_AUTHOR_ROLES: CommunityAuthorRole[] = ["admin", "instructor", "student"];
export const communityAuthorRoleLabels: Record<CommunityAuthorRole, string> = {
  admin: "Administrateur",
  instructor: "Formateur",
  student: "Apprenant",
};

/** Portée d'une publication : communauté générale ou une formation */
export type CommunityScope = "general" | "training";

export type CommunityPostSort = "recent" | "popular" | "active";
export const COMMUNITY_POST_SORTS: CommunityPostSort[] = ["recent", "popular", "active"];
export const communityPostSortLabels: Record<CommunityPostSort, string> = {
  recent: "Plus récentes",
  popular: "Plus populaires",
  active: "Activité récente",
};

/* ------------------------------ Limites (API) ------------------------------ */

export const COMMUNITY_LIMITS = {
  titleMin: 3,
  titleMax: 200,
  bodyMin: 3,
  bodyMax: 10000,
  maxTags: 5,
  maxAttachments: 4,
  maxAttachmentBytes: 5 * 1024 * 1024,
} as const;

export const COMMUNITY_ATTACHMENT_EXTENSIONS: string[] = [
  "jpg", "jpeg", "png", "webp", "gif", "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "zip",
];

/* ---------------------------- Couleurs des badges ---------------------------- */

const TONE = {
  primary: "bg-primary/10 text-primary border-primary/30",
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-accent/20 text-accent-foreground border-accent/40",
  muted: "bg-muted text-muted-foreground border-transparent",
};

export function getCommunityPostTypeBadgeClass(type: CommunityPostType): string {
  if (type === "question") return TONE.primary;
  if (type === "resource") return TONE.success;
  if (type === "announcement") return TONE.warning;
  return TONE.muted;
}

export function getCommunityAuthorRoleBadgeClass(role: CommunityAuthorRole): string {
  if (role === "admin") return TONE.primary;
  if (role === "instructor") return TONE.warning;
  return TONE.muted;
}

/* ---------------------------------- Types ---------------------------------- */

/** GET /community/categories/list */
export interface APICommunityCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  sortOrder: number;
  isActive: boolean;
  postsCount: number | null;
}

export interface APICommunityCategoryRef {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export interface APICommunityTrainingRef {
  id: string;
  title: string;
}

export interface APICommunityAuthor {
  id: string;
  name: string;
  photo: string | null;
  role: CommunityAuthorRole;
}

export interface APICommunityPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canModerate: boolean;
  canHide: boolean;
  canLock: boolean;
  canComment: boolean;
  canReact: boolean;
  canReport: boolean;
}

/** Item de liste (le corps complet et les pièces jointes ne sont que dans le détail) */
export interface APICommunityPostListItem {
  id: string;
  title: string;
  type: CommunityPostType;
  excerpt: string;
  tags: string[];
  scope: CommunityScope;
  category: APICommunityCategoryRef;
  training: APICommunityTrainingRef | null;
  author: APICommunityAuthor;
  isMine: boolean;
  status: CommunityContentStatus;
  isPinned: boolean;
  isLocked: boolean;
  bestAnswerId: string | null;
  commentsCount: number;
  reactionsTotal: number;
  reactions: Record<string, number>;
  myReaction: string | null;
  viewsCount: number;
  attachmentsCount: number;
  createdAt: string;
  editedAt: string | null;
  permissions: APICommunityPermissions;
  hiddenReason: string | null;
  hiddenAt: string | null;
}

export interface APICommunityAttachment {
  name: string;
  url: string;
  mime: string;
  size: number;
}

/** GET /community/posts/{id} (aussi renvoyé par POST create et PUT) */
export interface APICommunityPostDetail extends APICommunityPostListItem {
  body: string;
  attachments: APICommunityAttachment[];
}

/* --------------------------------- Payloads --------------------------------- */

/** POST /community/posts/create (camelCase, multipart) */
export interface CommunityPostCreatePayload {
  title: string;
  body: string;
  categoryId: string;
  trainingId?: string;
  type?: CommunityPostType;
  tags?: string[];
  attachments?: File[];
}

/**
 * PUT /community/posts/{id} : un champ vide ou absent = inchangé.
 * La formation et les pièces jointes ne sont pas modifiables.
 */
export type CommunityPostUpdatePayload = Partial<
  Pick<CommunityPostCreatePayload, "title" | "body" | "categoryId" | "type" | "tags">
>;

/** Paramètres de GET /community/posts/list */
export type CommunityPostFilters = {
  scope?: CommunityScope;
  trainingId?: string;
  categoryId?: string;
  type?: CommunityPostType;
  authorRole?: CommunityAuthorRole;
  authorId?: string;
  mine?: boolean;
  pinned?: boolean;
  unanswered?: boolean;
  status?: CommunityContentStatus;
  query?: string;
  sort?: CommunityPostSort;
  page?: number;
  perPage?: number;
};