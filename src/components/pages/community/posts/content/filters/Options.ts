import { COMMUNITY_AUTHOR_ROLES, COMMUNITY_POST_SORTS, COMMUNITY_POST_TYPES, communityAuthorRoleLabels, communityContentStatusLabels, communityPostSortLabels, communityPostTypeLabels, type APICommunityCategory, type CommunityAuthorRole, type CommunityContentStatus, type CommunityPostSort, type CommunityPostType } from "@/data/community";
import type { FilterOption } from "./Select";

export const sortOptions: FilterOption<CommunityPostSort>[] = COMMUNITY_POST_SORTS.map((s) => ({
  value: s,
  label: communityPostSortLabels[s],
}));

export const typeOptions: FilterOption<CommunityPostType | "all">[] = [
  { value: "all", label: "Tous les types" },
  ...COMMUNITY_POST_TYPES.map((t) => ({ value: t, label: communityPostTypeLabels[t] })),
];

export const authorRoleOptions: FilterOption<CommunityAuthorRole | "all">[] = [
  { value: "all", label: "Tous les auteurs" },
  ...COMMUNITY_AUTHOR_ROLES.map((r) => ({ value: r, label: communityAuthorRoleLabels[r] })),
];

export const statusOptions: FilterOption<CommunityContentStatus | "all">[] = [
  { value: "all", label: "Tous les statuts" },
  ...(["published", "hidden"] as CommunityContentStatus[]).map((status) => ({
    value: status,
    label: communityContentStatusLabels[status],
  })),
];

/** « Espace » : toutes les publications, la communauté générale, les formations, ou une formation précise */
export function buildAudienceOptions(
  trainings: { trainingId: string; trainingTitle: string }[]
): FilterOption<string>[] {
  return [
    { value: "all", label: "Toutes les publications" },
    { value: "general", label: "Communauté générale" },
    { value: "training", label: "Toutes mes formations" },
    ...trainings.map((t) => ({ value: t.trainingId, label: t.trainingTitle })),
  ];
}

export function buildCategoryOptions(categories: APICommunityCategory[]): FilterOption<string>[] {
  return [{ value: "all", label: "Toutes les catégories" }, ...categories.map((c) => ({ value: c.id, label: c.name }))];
}