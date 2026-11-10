import { useState } from "react";
import { DeletePostDialog } from "../../shared/DeletePostDialog";
import { PostFormDialog, PostsListItem, PostFilters, usePostFilters } from "../content";
import type { APICommunityPostListItem } from "@/data/community";

/** Filtres + liste des publications + dialogs de modification et de suppression */
export function CommunityFeed({ onTotalChange }: { onTotalChange?: (total: number | null) => void }) {
  const f = usePostFilters();

  const [editId, setEditId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<APICommunityPostListItem | null>(null);

  return (
    <>
      <PostFilters filters={f.filters} onChange={f.patch} hasActiveFilters={f.hasActiveFilters} onReset={f.reset} />

      <PostsListItem
        params={f.params}
        hasActiveFilters={f.hasActiveFilters}
        onPageChange={f.setPage}
        onEdit={(post) => setEditId(post.id)}
        onDelete={setToDelete}
        onTotalChange={onTotalChange}
      />

      <PostFormDialog open={!!editId} postId={editId} onClose={() => setEditId(null)} />
      <DeletePostDialog post={toDelete} onClose={() => setToDelete(null)} />
    </>
  );
}