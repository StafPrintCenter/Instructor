import { useMemo, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { CommunityAuthorRole, CommunityContentStatus, CommunityPostFilters, CommunityPostSort, CommunityPostType } from "@/data/community";

export interface PostFiltersState {
  query: string;
  sort: CommunityPostSort;
  audience: string;
  categoryId: string;
  type: CommunityPostType | "all";
  authorRole: CommunityAuthorRole | "all";
  status: CommunityContentStatus | "all";
  mine: boolean;
  unanswered: boolean;
}

export const DEFAULT_POST_FILTERS: PostFiltersState = {
  query: "",
  sort: "recent",
  audience: "all",
  categoryId: "all",
  type: "all",
  authorRole: "all",
  status: "all",
  mine: false,
  unanswered: false,
};

function audienceParams(audience: string): Pick<CommunityPostFilters, "scope" | "trainingId"> {
  if (audience === "all") return {};
  if (audience === "general" || audience === "training") return { scope: audience };
  return { trainingId: audience };
}

export function usePostFilters() {
  const [filters, setFilters] = useState<PostFiltersState>(DEFAULT_POST_FILTERS);
  const [page, setPage] = useState(1);

  const debouncedQuery = useDebouncedValue(filters.query.trim());

  const params = useMemo<CommunityPostFilters>(
    () => ({
      ...audienceParams(filters.audience),
      categoryId: filters.categoryId === "all" ? undefined : filters.categoryId,
      type: filters.type === "all" ? undefined : filters.type,
      authorRole: filters.authorRole === "all" ? undefined : filters.authorRole,
      status: filters.status === "all" ? undefined : filters.status,
      mine: filters.mine,
      unanswered: filters.unanswered,
      query: debouncedQuery || undefined,
      sort: filters.sort,
      page,
    }),
    [filters, debouncedQuery, page]
  );

  const patch = (next: Partial<PostFiltersState>) => {
    setFilters((f) => ({ ...f, ...next }));
    setPage(1);
  };

  const reset = () => patch({ ...DEFAULT_POST_FILTERS, sort: filters.sort });

  const hasActiveFilters =
    filters.query !== "" ||
    filters.audience !== "all" ||
    filters.categoryId !== "all" ||
    filters.type !== "all" ||
    filters.authorRole !== "all" ||
    filters.status !== "all" ||
    filters.mine ||
    filters.unanswered;

  return { filters, params, page, setPage, patch, reset, hasActiveFilters };
}