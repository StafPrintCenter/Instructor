import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Eye, Mail, Phone, RefreshCw, Users } from "lucide-react";
import { PageHeader } from "@/components/site";
import { EmptyState } from "@/components/instructor/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getEnrollmentStatusBadgeClass, getEnrollmentStatusLabel } from "@/data/training-students";
import { getPaymentStatusBadgeClass, getPaymentStatusLabel } from "@/data/trainings";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationBar } from "@/components/site";
import { useInstructorStudentsList } from "@/stores/useStudentsStore";
import { resolveStorageUrl } from "@/lib/file-url";
import { formatDateTime } from "@/lib/date-time";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/students/")({
  head: () => ({
    meta: [
      { title: `Mes apprenants | Espace Formateur ${SITE.name}` },
      { name: "description", content: "Apprenants inscrits à vos formations, avec leur progression et leur dernière activité." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: StudentsPage,
});

function StudentsPage() {
  const [page, setPage] = useState(1);
  const { students, meta, isLoading, isError, refetch } = useInstructorStudentsList({ page });

  // Si la page courante n'existe plus (ex. liste réduite), on recule à la dernière page
  useEffect(() => {
    if (meta && meta.lastPage >= 1 && page > meta.lastPage) setPage(meta.lastPage);
  }, [meta, page]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Suivi"
        title="Mes apprenants"
        description="Apprenants inscrits à vos formations, avec leur progression et leur dernière activité."
      />

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-16 animate-pulse rounded-lg bg-muted" />
          <div className="h-64 animate-pulse rounded-lg bg-muted" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-8 text-center">
          <AlertTriangle className="size-6 text-destructive" />
          <p className="text-sm text-muted-foreground">Impossible de charger les apprenants.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="size-4" /> Réessayer
          </Button>
        </div>
      ) : students.length === 0 ? (
        <EmptyState
          icon={<Users className="size-6" />}
          title="Aucun apprenant"
          description="Les apprenants inscrits à vos formations apparaîtront ici."
        />
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-border/70 bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Apprenant</TableHead>
                  <TableHead>Formations</TableHead>
                  <TableHead>Progression moyenne</TableHead>
                  <TableHead>Dernière activité</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s) => {
                  const initials = `${s.firstName?.[0] ?? ""}${s.lastName?.[0] ?? ""}`.toUpperCase();
                  const photo = resolveStorageUrl(s.photo);

                  return (
                    <TableRow key={s.studentId}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-10 border border-border">
                            {photo ? <AvatarImage src={photo} alt={s.name} /> : null}
                            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                              {initials || "AP"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 space-y-0.5">
                            <p className="truncate text-sm font-medium leading-none">{s.name}</p>
                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail className="size-3" /> {s.email}
                            </p>
                            {s.phone ? (
                              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Phone className="size-3" /> {s.phone}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="min-w-72">
                        <div className="space-y-1.5">
                          {s.trainings.map((t) => (
                            <Link
                              key={t.enrollmentId}
                              to="/trainings/$trainingId/students/$studentId"
                              params={{ trainingId: t.trainingId, studentId: s.studentId }}
                              className="block space-y-1.5 rounded-md border border-border/60 px-2.5 py-2 text-xs transition-colors hover:bg-card/80 hover:border-primary"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <span className="truncate font-medium">{t.trainingTitle}</span>
                                <span className="shrink-0 font-semibold">{t.progress}%</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                <Badge
                                  variant="outline"
                                  className={cn("border px-1.5 py-0 text-[10px] font-medium", getEnrollmentStatusBadgeClass(t.status))}
                                >
                                  {getEnrollmentStatusLabel(t.status)}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={cn("border px-1.5 py-0 text-[10px] font-medium", getPaymentStatusBadgeClass(t.paymentStatus))}
                                >
                                  {getPaymentStatusLabel(t.paymentStatus)}
                                </Badge>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </TableCell>

                      <TableCell className="min-w-36">
                        <div className="space-y-1.5">
                          <span className="text-xs font-medium">{s.averageProgress}%</span>
                          <Progress value={s.averageProgress} className="h-1.5" />
                        </div>
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground">
                        {s.lastActivityAt ? formatDateTime(s.lastActivityAt) : "Aucune activité"}
                      </TableCell>

                      <TableCell className="text-right">
                        <Button asChild size="sm" variant="soft">
                          <Link to="/students/$studentId" params={{ studentId: s.studentId }}>
                            <Eye className="size-4" /> Voir le profil
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {meta ? (
            <PaginationBar page={meta.currentPage} lastPage={meta.lastPage} total={meta.total} onPageChange={setPage} />
          ) : null}
        </div>
      )}
    </div>
  );
}
