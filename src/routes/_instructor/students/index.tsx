import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/instructor/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaymentBadge } from "@/components/instructor/status-badges";
import { studentsQuery, trainingsQuery } from "@/lib/queries";
import { getSessionInstructorId, useInstructorAuth } from "@/lib/instructor-auth";
import { initials, relativeTime } from "@/lib/api";

export const Route = createFileRoute("/_instructor/students/")({
  head: () => ({
    meta: [
      { title: "Suivi des apprenants — STAF PRINT CENTER" },
      {
        name: "description",
        content:
          "Suivez la progression, l'assiduité et le statut de paiement des apprenants inscrits à vos cohortes.",
      },
      { property: "og:title", content: "Suivi des apprenants — STAF PRINT CENTER" },
      { property: "og:description", content: "Progression, assiduité et paiements par apprenant." },
    ],
  }),
  loader: ({ context }) => {
    const id = getSessionInstructorId();
    return Promise.all([
      context.queryClient.ensureQueryData(studentsQuery(id)),
      context.queryClient.ensureQueryData(trainingsQuery(id)),
    ]);
  },
  component: StudentsPage,
});

function StudentsPage() {
  const { instructorId } = useInstructorAuth();
  const { data: rows } = useSuspenseQuery(studentsQuery(instructorId));
  const { data: trainings } = useSuspenseQuery(trainingsQuery(instructorId));
  const [term, setTerm] = useState("");
  const [training, setTraining] = useState("all");
  const [payment, setPayment] = useState("all");

  const filtered = useMemo(
    () =>
      rows
        .filter((r) => (training === "all" ? true : r.training_id === training))
        .filter((r) => (payment === "all" ? true : r.payment_status === payment))
        .filter((r) =>
          term.trim()
            ? `${r.student.full_name} ${r.student.email} ${r.student.city}`
              .toLowerCase()
              .includes(term.trim().toLowerCase())
            : true,
        ),
    [rows, training, payment, term],
  );

  const average = filtered.length
    ? Math.round(filtered.reduce((sum, r) => sum + r.progress, 0) / filtered.length)
    : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Accompagnement"
        title="Apprenants"
        description="Tous les apprenants inscrits aux formations qui vous sont assignées."
        actions={
          <div className="rounded-lg border border-border bg-card px-4 py-2 text-sm">
            <span className="text-muted-foreground">Progression moyenne</span>{" "}
            <span className="font-display text-lg">{average}%</span>
          </div>
        }
      />

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <Input
            placeholder="Rechercher un apprenant…"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="sm:max-w-xs"
          />
          <Select value={training} onValueChange={setTraining}>
            <SelectTrigger className="sm:w-56">
              <SelectValue placeholder="Formation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les formations</SelectItem>
              {trainings.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={payment} onValueChange={setPayment}>
            <SelectTrigger className="sm:w-44">
              <SelectValue placeholder="Paiement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les paiements</SelectItem>
              <SelectItem value="paid">Soldé</SelectItem>
              <SelectItem value="partial">Partiel</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="late">En retard</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="size-6" />}
          title="Aucun apprenant ne correspond"
          description="Ajustez vos filtres ou votre recherche."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Apprenant</TableHead>
                  <TableHead className="hidden md:table-cell">Formation</TableHead>
                  <TableHead className="w-48">Progression</TableHead>
                  <TableHead className="hidden lg:table-cell">Assiduité</TableHead>
                  <TableHead>Paiement</TableHead>
                  <TableHead className="hidden lg:table-cell">Activité</TableHead>
                  <TableHead className="text-right">Fiche</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarFallback className="bg-secondary text-xs">
                            {initials(r.student.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{r.student.full_name}</p>
                          <p className="truncate text-xs text-muted-foreground">{r.student.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {r.training_title}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={r.progress} className="h-2" />
                        <span className="w-9 text-right text-xs tabular-nums">{r.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm tabular-nums">
                      {r.attendance_rate}%
                    </TableCell>
                    <TableCell>
                      <PaymentBadge status={r.payment_status} />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                      {relativeTime(r.last_activity_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="soft" size="sm">
                        <Link to="/students/$studentId" params={{ studentId: r.student_id }}>
                          Ouvrir
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
