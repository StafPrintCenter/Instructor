import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/site";
import { Button } from "@/components/ui/button";
import { CommunityFeed, PostFormDialog } from "@/components/pages/community/home";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/community/")({
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
          <Button variant="accent" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" /> Nouvelle publication
          </Button>
        }
      />

      <CommunityFeed />

      <PostFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
