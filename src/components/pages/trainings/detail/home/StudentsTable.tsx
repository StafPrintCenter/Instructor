import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, CalendarCheck, Eye, Mail, RefreshCw, Search, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationBar } from "@/components/site";
import { AttendanceMarkDialog } from "@/components/pages/trainings/shared";
import { UserAvatar } from "@/components/site/UserAvatar";
import { formatDate } from "@/lib/date-time";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useInstructorTrainingOverview } from "@/stores/useTrainingsStore";
import {
  getPaymentStatusBadgeClass,
  getPaymentStatusLabel,
  type APIInstructorTrainingOverview,
  type InstructorTrainingStudentSort,
  type PaymentStatus,
} from "@/data/trainings";

function PaymentBadge({ status }: { status: PaymentStatus | string | null | undefined }) {
  return (
    <Badge variant="outline" className={cn("border font-medium", getPaymentStatusBadgeClass(status))}>
      {getPaymentStatusLabel(status)}
    </Badge>
  );
}

interface TrainingStudentsTableProps {
  trainingId: string;
  students: APIInstructorTrainingOverview["students"];
  mainColor: string;
}

export function TrainingStudentsTable({ trainingId, students, mainColor }: TrainingStudentsTableProps) {
  const [attendanceFor, setAttendanceFor] = useState<{ enrollmentId: string; name: string } | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<InstructorTrainingStudentSort>("default");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search.trim());
  const { overview, isLoading, isError, refetch } = useInstructorTrainingOverview(trainingId, {
    query: debouncedSearch,
    sortBy,
    sortDir,
    page,
    perPage: 12,
  });
  const pageStudents = overview?.students ?? students;

  const updateSort = (value: string) => {
    const nextSort = value as InstructorTrainingStudentSort;
    setSortBy(nextSort);
    setSortDir(nextSort === "alpha" ? "asc" : "desc");
    setPage(1);
  };

  return (
    <>
      <Card className="border-border/70">
        <CardHeader className="gap-4">
          <CardTitle className="flex items-center gap-2 font-display text-xl">
            <Users className="size-5" style={{ color: mainColor }} /> Apprenants inscrits ({pageStudents.meta.total})
          </CardTitle>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="relative min-w-0 flex-1">
              <Label htmlFor="training-students-search" className="sr-only">Rechercher un apprenant</Label>
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="training-students-search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Rechercher par prénom, nom ou email"
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <div className="w-full sm:w-44">
                <Label htmlFor="training-students-sort" className="sr-only">Trier les apprenants</Label>
                <Select value={sortBy} onValueChange={updateSort}>
                  <SelectTrigger id="training-students-sort"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Plus récents</SelectItem>
                    <SelectItem value="alpha">Ordre alphabétique</SelectItem>
                    <SelectItem value="progress">Progression</SelectItem>
                    <SelectItem value="date">Date d'inscription</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-32">
                <Label htmlFor="training-students-sort-dir" className="sr-only">Ordre de tri</Label>
                <Select
                  value={sortDir}
                  onValueChange={(value: "asc" | "desc") => {
                    setSortDir(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger id="training-students-sort-dir"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Croissant</SelectItem>
                    <SelectItem value="desc">Décroissant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isError ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-6 text-center">
              <AlertTriangle className="size-6 text-destructive" />
              <p className="text-sm text-muted-foreground">Impossible de charger les apprenants.</p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="size-4" /> Réessayer
              </Button>
            </div>
          ) : isLoading ? (
            <div className="space-y-3 py-4" aria-label="Chargement des apprenants">
              <div className="h-10 animate-pulse rounded-lg bg-muted" />
              <div className="h-10 animate-pulse rounded-lg bg-muted" />
              <div className="h-10 animate-pulse rounded-lg bg-muted" />
            </div>
          ) : pageStudents.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="size-12 text-muted-foreground/40" />
              <p className="mt-3 text-sm font-medium text-muted-foreground">
                {debouncedSearch
                  ? "Aucun apprenant ne correspond à cette recherche."
                  : "Aucun apprenant n'est encore inscrit à cette formation."}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Apprenant</TableHead>
                      <TableHead>Paiement</TableHead>
                      <TableHead>Progression</TableHead>
                      <TableHead>Assiduité</TableHead>
                      <TableHead>Dernière activité</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageStudents.data.map((student) => {
                      const fullName = `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim() || "Apprenant";

                      return (
                        <TableRow key={student.enrollmentId}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <UserAvatar
                                name={fullName}
                                photo={student.photo}
                                className="size-10 border border-border"
                                fallbackClassName="bg-primary/10 text-xs font-semibold text-primary"
                              />
                              <div className="space-y-0.5">
                                <Link
                                  to="/students/$studentId"
                                  params={{ studentId: student.studentId }}
                                  className="text-sm font-medium leading-none hover:underline"
                                >
                                  {fullName}
                                </Link>
                                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Mail className="size-3" />
                                  {student.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <PaymentBadge status={student.paymentStatus} />
                          </TableCell>
                          <TableCell className="min-w-35">
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-medium">{student.progress ?? 0}%</span>
                              </div>
                              <Progress value={student.progress ?? 0} className="h-1.5" />
                            </div>
                          </TableCell>
                          <TableCell>
                            {student.attendance !== null ? (
                              <span className="text-xs font-medium">{student.attendance}%</span>
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {student.lastActivityAt ? formatDate(student.lastActivityAt) : "Jamais connecté"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setAttendanceFor({ enrollmentId: student.enrollmentId, name: fullName })}
                              >
                                <CalendarCheck className="size-4" /> Assiduité
                              </Button>
                              <Button asChild size="sm" variant="soft">
                                <Link
                                  to="/trainings/$trainingId/students/$studentId"
                                  params={{ trainingId, studentId: student.studentId }}
                                >
                                  <Eye className="size-4" /> Suivi & soumissions
                                </Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <PaginationBar
                page={pageStudents.meta.currentPage}
                lastPage={pageStudents.meta.lastPage}
                total={pageStudents.meta.total}
                onPageChange={setPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      <AttendanceMarkDialog
        enrollmentId={attendanceFor?.enrollmentId ?? null}
        studentName={attendanceFor?.name}
        onClose={() => setAttendanceFor(null)}
      />
    </>
  );
}