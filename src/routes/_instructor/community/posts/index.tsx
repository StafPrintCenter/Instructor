import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MessagesSquare, Plus } from "lucide-react";
import { PageHeader } from "@/components/site";
import { Button } from "@/components/ui/button";
import { CommunityFeed } from "@/components/pages/community/posts/home";
import { PostFormDialog } from "@/components/pages/community/posts/content/form";
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
  const [totalPosts, setTotalPosts] = useState<number | null>(null);

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

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <CommunityFeed onTotalChange={setTotalPosts} />
        <aside className="rounded-2xl border bg-card p-5" aria-live="polite">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <MessagesSquare className="size-4 text-primary" />
            Publications
          </div>
          <p className="mt-2 text-2xl font-bold">{totalPosts ?? "—"}</p>
          <p className="text-xs text-muted-foreground">
            {totalPosts === null
              ? "Chargement du total…"
              : `publication${totalPosts > 1 ? "s" : ""} correspondant aux filtres`}
          </p>
        </aside>
      </div>

      <PostFormDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
