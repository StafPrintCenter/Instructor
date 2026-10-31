import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCommunityPostDetail } from "@/stores/useCommunityStore";
import { PostForm } from "./PostForm";

interface EditPostLoaderProps {
  postId: string;
  onClose: () => void;
}

/** Charge le détail complet (le corps n'est pas dans la liste) avant d'afficher le formulaire */
export function EditPostLoader({ postId, onClose }: EditPostLoaderProps) {
  const { post, isLoading, isError, refetch } = useCommunityPostDetail(postId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-10 animate-pulse rounded-lg bg-muted" />
        <div className="h-40 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-8 text-center">
        <AlertTriangle className="size-6 text-destructive" />
        <p className="text-sm text-muted-foreground">Impossible de charger cette publication.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="size-4" /> Réessayer
        </Button>
      </div>
    );
  }

  if (!post) return <p className="text-sm text-muted-foreground">Publication introuvable.</p>;

  return <PostForm key={post.id} post={post} onClose={onClose} />;
}