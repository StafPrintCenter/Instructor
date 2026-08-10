import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, MapPin, Users } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/instructor/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useInstructorTrainingsList } from "@/stores/useInstructorTrainingsStore";
import { formatDate } from "@/lib/api";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/trainings/")({
  head: () => ({
    meta: [
      { title: `Mes formations assignées | ${SITE.name}` },
      { name: "description", content: "Consultez les formations où vous êtes assigné·e comme formateur et suivez leur avancement." },
      { property: "og:title", content: `Mes formations assignées | ${SITE.name}` },
      { property: "og:description", content: "Cohortes, dates, apprenants inscrits et avancement global." },
    ],
  }),
  component: TrainingsPage,
});

function TrainingsPage() {
  const { trainings, isLoading } = useInstructorTrainingsList();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Pédagogie"
        title="Mes formations assignées"
        description="Seul l'administrateur crée les formations ; vous en remplissez le contenu pédagogique."
      />
      {!isLoading && trainings.length === 0 ? (
        <EmptyState icon={<BookOpen className="size-6" />} title="Aucune formation assignée" description="Contactez l'administration pour être assigné·e à une cohorte." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {trainings.map((t) => (
            <Card key={t.assignmentId} className="overflow-hidden border-border/70 transition-shadow hover:shadow-(--shadow-lift)">
              <div
                className="h-1.5 w-full"
                style={{ backgroundColor: t.trainingCoverColor ? `var(--${t.trainingCoverColor})` : "var(--muted)" }}
              />
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="outline">{t.trainingTheme}</Badge>
                      {t.role === "lead" && <Badge variant="default">Formateur principal</Badge>}
                    </div>
                    <h2 className="font-display text-xl leading-snug">{t.trainingTitle}</h2>
                  </div>
                  <Badge variant="secondary">{t.trainingLevel}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{t.trainingShort}</p>
                <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                  <span className="flex items-center gap-1.5">
                    <Users className="size-3.5" /> {t.trainingCurrentStudents ?? 0} apprenants
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5" /> {t.trainingLocation ?? "À définir"}
                  </span>
                  {t.trainingStartDate && t.trainingEndDate && (
                    <span className="sm:col-span-2">
                      Du {formatDate(t.trainingStartDate)} au {formatDate(t.trainingEndDate)}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="accent" size="sm">
                    <Link to="/trainings/$trainingId" params={{ trainingId: t.trainingId }}>Ouvrir</Link>
                  </Button>
                  <Button asChild variant="soft" size="sm">
                    <Link to="/trainings/$trainingId/contenu" params={{ trainingId: t.trainingId }}>Contenu</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
