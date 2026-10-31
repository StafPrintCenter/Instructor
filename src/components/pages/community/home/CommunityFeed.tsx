import { useState } from "react";
import { DeletePostDialog } from "../shared/DeletePostDialog";
import { PostDetailDialog } from "../detail/PostDetailDialog";
import { PostFilters } from "./PostFilters";
import { usePostFilters } from "./usePostFilters";
import { PostFormDialog } from "./PostFormDialog";
import { PostsList } from "./PostsList";
import type { APICommunityPostListItem } from "@/data/community";

/** Filtres + liste des publications + dialogs de détail, modification et suppression */
export function CommunityFeed() {
  const f = usePostFilters();

  const [detailId, setDetailId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<APICommunityPostListItem | null>(null);

  return (
    <>
      <PostFilters filters={f.filters} onChange={f.patch} hasActiveFilters={f.hasActiveFilters} onReset={f.reset} />

      <PostsList
        params={f.params}
        hasActiveFilters={f.hasActiveFilters}
        onPageChange={f.setPage}
        onOpen={(post) => setDetailId(post.id)}
        onEdit={(post) => setEditId(post.id)}
        onDelete={setToDelete}
      />

      <PostDetailDialog
        postId={detailId}
        onClose={() => setDetailId(null)}
        onEdit={(post) => {
          setDetailId(null);
          setEditId(post.id);
        }}
        onDelete={(post) => {
          setDetailId(null);
          setToDelete(post);
        }}
      />

      <PostFormDialog open={!!editId} postId={editId} onClose={() => setEditId(null)} />
      <DeletePostDialog post={toDelete} onClose={() => setToDelete(null)} />
    </>
  );
}