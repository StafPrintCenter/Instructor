import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/site";
import { Button } from "@/components/ui/button";
import { CommunityFeed } from "@/components/pages/community/home";
import { PostFormDialog } from "@/components/pages/community/content/form";
import { PendingReportsLink } from "@/components/pages/community/reports";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/community/posts/")({
  head: () => ({
    meta: [
      { title: `${SITE.tool} - Communauté | ${SITE.name}` },
      { name: "description", content: "Échangez avec vos apprenants : discussions, questions, ressources et annonces." },
    ],
  }),
  component: CommunityPage,
});

function CommunityPage() {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Échanges"
        title="Communauté"
        description="Discussions, questions, ressources et annonces de la communauté générale et de vos formations."
        actions={
          <div className="flex flex-wrap gap-2">
            <PendingReportsLink />
            <Button variant="accent" onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" /> Nouvelle publication
            </Button>
          </div>
        }
      />

      <CommunityFeed />

      <PostFormDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
