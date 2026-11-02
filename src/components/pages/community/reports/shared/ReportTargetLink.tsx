import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { APICommunityReportTarget } from "@/data/community-reports";

/** Lien vers la publication, ou vers le commentaire signalé (lien direct ?comment=) */
export function ReportTargetLink({ target }: { target: APICommunityReportTarget }) {
  if (!target.exists) {
    return <p className="text-xs italic text-muted-foreground">Ce contenu n'existe plus.</p>;
  }

  return (
    <Button asChild size="sm" variant="outline">
      {target.type === "post" ? (
        <Link to="/community/$id" params={{ id: target.postId }}>
          <ExternalLink className="size-4" /> Voir la publication
        </Link>
      ) : (
        <Link to="/community/$id" params={{ id: target.postId }} search={{ comment: target.id }}>
          <ExternalLink className="size-4" /> Voir le commentaire
        </Link>
      )}
    </Button>
  );
}