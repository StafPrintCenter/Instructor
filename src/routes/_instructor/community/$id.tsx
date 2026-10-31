import { createFileRoute } from "@tanstack/react-router";
import { PostPage } from "@/components/pages/community/detail";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/community/$id")({
  // /community/{postId}?comment={commentId} : lien direct vers un commentaire
  validateSearch: (search: Record<string, unknown>): { comment?: string } => ({
    comment: typeof search.comment === "string" && search.comment.trim() !== "" ? search.comment.trim() : undefined,
  }),
  head: () => ({
    meta: [
      { title: `${SITE.tool} - Publication Communauté | ${SITE.name}` },
      { name: "description", content: "Détail d'une publication de la communauté et de ses commentaires." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CommunityPostRoute,
});

function CommunityPostRoute() {
  const { id } = Route.useParams();
  const { comment } = Route.useSearch();

  return (
    <PostPage
      postId={id}
      focusCommentId={comment}
    />
  );
}