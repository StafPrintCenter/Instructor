import { createFileRoute } from "@tanstack/react-router";
import { PostPage } from "@/components/pages/community/detail";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/community/$id")({
  head: () => ({
    meta: [
      { title: `Publication | Communauté | Espace Formateur ${SITE.name}` },
      { name: "description", content: "Détail d'une publication de la communauté et de ses commentaires." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CommunityPostRoute,
});

function CommunityPostRoute() {
  const { id } = Route.useParams();
  return <PostPage postId={id} />;
}