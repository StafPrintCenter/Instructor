import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BookOpen, MapPin, Users } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/instructor/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trainingsQuery } from "@/lib/queries";
import { getSessionInstructorId, useInstructorAuth } from "@/lib/instructor-auth";
import { formatDate } from "@/lib/api";

export const Route = createFileRoute("/_instructor/_instructor/formations/")({
  head: () => ({
    meta: [
      { title: "Mes formations assignées — STAF PRINT CENTER" },
      { name: "description", content: "Consultez les formations où vous êtes assigné·e comme formateur et suivez leur avancement." },
      { property: "og:title", content: "Mes formations assignées — STAF PRINT CENTER" },
      { property: "og:description", content: "Cohortes, dates, apprenants inscrits et avancement global." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(trainingsQuery(getSessionInstructorId())),
  component: TrainingsPage,
});

function TrainingsPage() {
  const { instructorId } = useInstructorAuth();
  const { data: trainings } = useSuspenseQuery(trainingsQuery(instructorId));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Pédagogie"
        title="Mes formations assignées"
        description="Seul l'administrateur crée les formations ; vous en remplissez le contenu pédagogique."
      />
      {trainings.length === 0 ? (
        <EmptyState icon={<BookOpen className="size-6" />} title="Aucune formation assignée" description="Contactez l'administration pour être assigné·e à une cohorte." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {trainings.map((t) => (
            <Card key={t.id} className="overflow-hidden border-border/70 transition-shadow hover:shadow-[var(--shadow-lift)]">
              <div className="h-1.5 w-full" style={{ backgroundColor: `var(--${t.cover_color})` }} />
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge variant="outline" className="mb-2">{t.category}</Badge>
                    <h2 className="font-display text-xl leading-snug">{t.title}</h2>
                  </div>
                  <Badge variant="secondary">{t.level}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{t.summary}</p>
                <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                  <span className="flex items-center gap-1.5"><Users className="size-3.5" /> {t.enrolled_count} apprenants — {t.cohort}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="size-3.5" /> {t.location}</span>
                  <span>Du {formatDate(t.starts_at)} au {formatDate(t.ends_at)}</span>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="accent" size="sm"><Link to="/formations/$trainingId" params={{ trainingId: t.id }}>Ouvrir</Link></Button>
                  <Button asChild variant="soft" size="sm"><Link to="/formations/$trainingId/contenu" params={{ trainingId: t.id }}>Contenu</Link></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
