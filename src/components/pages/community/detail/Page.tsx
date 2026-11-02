import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/site";
import { Card, CardContent } from "@/components/ui/card";
import { communityPostTypeLabels } from "@/data/community";
import { SITE } from "@/data/site";
import { useDynamicPageMetadata } from "@/hooks/useDynamicPageMetadata";
import { useCommunityPostDetail } from "@/stores/useCommunityStore";
import { DeletePostDialog } from "../shared/DeletePostDialog";
import { PostFormDialog, CommentsSection } from "../content";
import { PostDetailContent, BackToCommunityButton, PostPageError, PostPageFallback, PostPageSkeleton, } from ".";


interface PostPageProps {
  postId: string;
  /** Commentaire visé par le lien (?comment=) */
  focusCommentId?: string;
}

export function PostPage({ postId, focusCommentId }: PostPageProps) {
  const navigate = useNavigate();
  const { post, isLoading, isError, refetch } = useCommunityPostDetail(postId);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useDynamicPageMetadata(
    post ? `${post.title} - Communauté | ${SITE.name}` : undefined,
    post ? post.excerpt.slice(0, 160) : undefined
  );

  // Retire ?comment= de l'adresse (remplace l'entrée d'historique)
  const clearFocus = () =>
    navigate({ to: "/community/posts/$id", params: { id: postId }, search: {}, replace: true });

  if (isLoading) return <PostPageSkeleton />;

  if (isError) {
    return (
      <PostPageFallback>
        <PostPageError onRetry={() => refetch()} />
      </PostPageFallback>
    );
  }

  if (!post) {
    return (
      <PostPageFallback>
        <p className="text-muted-foreground">Publication introuvable.</p>
      </PostPageFallback>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={post.training?.title ?? "Communauté générale"}
        title={post.title}
        description={`${communityPostTypeLabels[post.type]} · ${post.category.name}`}
        actions={<BackToCommunityButton />}
      />

      <Card className="border-border/70">
        <CardContent className="p-6">
          <PostDetailContent post={post} onEdit={() => setEditOpen(true)} onDelete={() => setDeleteOpen(true)} />
        </CardContent>
      </Card>

      <CommentsSection post={post} focusCommentId={focusCommentId} onClearFocus={clearFocus} />

      <PostFormDialog open={editOpen} postId={editOpen ? post.id : null} onClose={() => setEditOpen(false)} />
      <DeletePostDialog
        post={deleteOpen ? post : null}
        onClose={() => setDeleteOpen(false)}
        onDeleted={() => navigate({ to: "/community/posts" })}
      />
    </div>
  );
}