import { COMMUNITY_COMMENT_SORTS, communityCommentSortLabels, type CommunityCommentSort } from "@/data/community-comments";
import type { CommunityAuthorRole } from "@/data/community";
import { FilterSelect, authorRoleOptions, type FilterOption } from "../filters";

const sortOptions: FilterOption<CommunityCommentSort>[] = COMMUNITY_COMMENT_SORTS.map((s) => ({
  value: s,
  label: communityCommentSortLabels[s],
}));

interface CommentsToolbarProps {
  sort: CommunityCommentSort;
  authorRole: CommunityAuthorRole | "all";
  onSortChange: (sort: CommunityCommentSort) => void;
  onAuthorRoleChange: (role: CommunityAuthorRole | "all") => void;
}

export function CommentsToolbar({ sort, authorRole, onSortChange, onAuthorRoleChange }: CommentsToolbarProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:max-w-lg">
      <FilterSelect label="Tri" value={sort} options={sortOptions} onChange={onSortChange} />
      <FilterSelect label="Auteur" value={authorRole} options={authorRoleOptions} onChange={onAuthorRoleChange} />
    </div>
  );
}