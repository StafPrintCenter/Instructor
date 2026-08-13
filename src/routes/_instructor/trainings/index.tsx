import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, MapPin, Users, Calendar, CalendarPlus } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/instructor/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useInstructorTrainingsList } from "@/stores/useTrainingsStore";
import { formatDate } from "@/lib/api";
import { SITE } from "@/data/site";
import { getInstructorRoleConfig, getTrainingLevelBadgeClass, getTrainingStatusBadgeClass, getTrainingStatusLabel } from "@/data/trainings";
import { cn } from "@/lib/utils";

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
  const { items: trainings, isLoading } = useInstructorTrainingsList();

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
          {trainings.map((t) => {
            const roleConfig = getInstructorRoleConfig(t.role);

            return (
              <Card key={t.assignmentId} className="overflow-hidden border-border/70 transition-shadow hover:shadow-(--shadow-lift)">
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: t.trainingCoverColor || "var(--primary)" }}
                />
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-1.5">
                        <Badge variant="outline">
                          {t.trainingTheme}
                        </Badge>
                        <Badge variant={roleConfig.variant}>
                          {roleConfig.label}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn("border font-medium", getTrainingStatusBadgeClass(t.trainingStatus))}
                        >
                          {getTrainingStatusLabel(t.trainingStatus)}
                        </Badge>
                      </div>
                      <h2 className="font-display text-xl leading-snug">{t.trainingTitle}</h2>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn("border font-medium shrink-0", getTrainingLevelBadgeClass(t.trainingLevel))}
                    >
                      {t.trainingLevel}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">{t.trainingShort}</p>

                  <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                    <span className="flex items-center gap-1.5">
                      <Users className="size-3.5 shrink-0" /> {t.trainingCurrentStudents ?? 0} apprenants
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 shrink-0" /> {t.trainingLocation ?? "À définir"}
                    </span>
                    {t.trainingStartDate && t.trainingEndDate && (
                      <span className="flex items-center gap-1.5 sm:col-span-2">
                        <Calendar className="size-3.5 shrink-0" /> Du {formatDate(t.trainingStartDate)} au {formatDate(t.trainingEndDate)}
                      </span>
                    )}
                    {/* Date d'assignation au formateur */}
                    {t.assignedAt && (
                      <span className="flex items-center gap-1.5 text-muted-foreground/80 sm:col-span-2">
                        <CalendarPlus className="size-3.5 shrink-0" /> Assigné le {formatDate(t.assignedAt)}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button asChild variant="accent" size="sm">
                      <Link to="/trainings/$trainingId" params={{ trainingId: t.trainingId }}>Ouvrir</Link>
                    </Button>
                    <Button asChild variant="soft" size="sm">
                      <Link to="/trainings/$trainingId/manage" params={{ trainingId: t.trainingId }}>Contenu</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
