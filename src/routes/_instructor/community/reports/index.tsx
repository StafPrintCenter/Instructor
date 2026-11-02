import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/site";
import { Button } from "@/components/ui/button";
import { ReportsView } from "@/components/pages/community/reports";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/community/reports/")({
  head: () => ({
    meta: [
      { title: `Signalements | Communauté | Espace Formateur ${SITE.name}` },
      { name: "description", content: "Traitez les contenus signalés par les apprenants dans vos formations." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Modération"
        title="Signalements"
        description="Contenus signalés par les apprenants dans vos formations : masquez, rejetez ou transmettez aux administrateurs."
        actions={
          <Button asChild variant="outline">
            <Link to="/community">
              <ArrowLeft className="size-4" /> Retour à la communauté
            </Link>
          </Button>
        }
      />

      <ReportsView />
    </div>
  );
}