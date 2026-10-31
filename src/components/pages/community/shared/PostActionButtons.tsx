import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { APICommunityPostListItem } from "@/data/community";

interface PostActionButtonsProps {
  post: APICommunityPostListItem;
  onEdit: () => void;
  onDelete: () => void;
}

/** Les boutons suivent les permissions renvoyées par l'API */
export function PostActionButtons({ post, onEdit, onDelete }: PostActionButtonsProps) {
  return (
    <>
      {post.permissions.canEdit ? (
        <Button size="sm" variant="outline" onClick={onEdit}>
          <Pencil className="size-4" /> Modifier
        </Button>
      ) : null}
      {post.permissions.canDelete ? (
        <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={onDelete}>
          <Trash2 className="size-4" /> Supprimer
        </Button>
      ) : null}
    </>
  );
}