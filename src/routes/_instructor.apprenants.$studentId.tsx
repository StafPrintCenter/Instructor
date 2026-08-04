import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, BookOpen, CheckCircle2, ClipboardCheck, FileText, Gauge, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/instructor/page-header";
import { StatCard } from "@/components/instructor/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentBadge, SubmissionBadge } from "@/components/instructor/status-badges";
import { SubmissionAttachment } from "@/components/instructor/submission-attachment";
import { qk, studentQuery } from "@/lib/queries";
import { getSessionInstructorId, useInstructorAuth } from "@/lib/instructor-auth";
import { formatDate, formatDateTime, gradingApi, initials, lessonTypeLabels } from "@/lib/api";

export const Route = createFileRoute("/_instructor/apprenants/$studentId")({
  head: () => ({
    meta: [
      { title: "Fiche apprenant — STAF PRINT CENTER" },
      {
        name: "description",
        content: "Parcours détaillé de l'apprenant : progression, leçons terminées, quiz et travaux rendus.",
      },
      { property: "og:title", content: "Fiche apprenant — STAF PRINT CENTER" },
      { property: "og:description", content: "Progression, quiz et travaux rendus par apprenant." },
    ],
  }),
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(studentQuery(getSessionInstructorId(), params.studentId)),
  component: StudentDetailPage,
});

function StudentDetailPage() {
  const { studentId } = Route.useParams();
  const { instructorId } = useInstructorAuth();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(studentQuery(instructorId, studentId));
  const { student, enrollments, completions, attempts, submissions, totalLessons } = data;
  const [drafts, setDrafts] = useState<Record<string, { grade: string; comment: string }>>({});

  const grade = useMutation({
    mutationFn: (input: {
      submissionId: string;
      grade: number;
      comment: string;
      decision: "validated" | "returned";
    }) => gradingApi.grade({ instructorId, ...input }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: qk.student(instructorId, studentId) });
      queryClient.invalidateQueries({ queryKey: ["grading"] });
      queryClient.invalidateQueries({ queryKey: qk.stats(instructorId) });
      toast.success(vars.decision === "validated" ? "Travail validé." : "Travail renvoyé à l'apprenant.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const averageQuiz = attempts.length
    ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
    : 0;
  const averageProgress = enrollments.length
    ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
    : 0;
  const pendingSubmissions = submissions.filter((s) => s.status === "pending").length;

  return (
    <div className="space-y-8">
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link to="/apprenants">
          <ArrowLeft className="size-4" /> Retour aux apprenants
        </Link>
      </Button>

      <PageHeader
        eyebrow="Fiche apprenant"
        title={student.full_name}
        description={`${student.city} · inscrit à ${enrollments.length} formation${enrollments.length > 1 ? "s" : ""}`}
        actions={
          <Avatar className="size-14">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials(student.full_name)}
            </AvatarFallback>
          </Avatar>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Leçons terminées"
          value={`${completions.length}/${totalLessons}`}
          hint={totalLessons ? `${Math.round((completions.length / totalLessons) * 100)}% du parcours` : undefined}
          icon={<BookOpen className="size-5" />}
        />
        <StatCard
          label="Moyenne quiz"
          value={`${averageQuiz}%`}
          hint={`${attempts.filter((a) => a.passed).length}/${attempts.length} tentative(s) réussie(s)`}
          icon={<Gauge className="size-5" />}
          tone="accent"
        />
        <StatCard
          label="Progression moyenne"
          value={`${averageProgress}%`}
          hint="Toutes formations confondues"
          icon={<CheckCircle2 className="size-5" />}
          tone="success"
        />
        <StatCard
          label="Travaux à corriger"
          value={pendingSubmissions}
          hint={`${submissions.length} rendu(s) au total`}
          icon={<ClipboardCheck className="size-5" />}
          tone="warning"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Coordonnées</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-sm">
            <p className="flex items-center gap-2 text-muted-foreground">
              <Mail className="size-4" /> {student.email}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Phone className="size-4" /> {student.phone}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4" /> {student.city}
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Inscriptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {enrollments.map((e) => (
              <div key={e.id} className="space-y-2 rounded-lg border border-border/70 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium">{e.training_title}</p>
                  <PaymentBadge status={e.payment_status} />
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={e.progress} className="h-2" />
                  <span className="w-10 text-right text-xs tabular-nums">{e.progress}%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Assiduité {e.attendance_rate}% · inscrit le {formatDate(e.enrolled_at)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="submissions">
        <TabsList>
          <TabsTrigger value="submissions">Travaux rendus ({submissions.length})</TabsTrigger>
          <TabsTrigger value="completions">Leçons terminées ({completions.length})</TabsTrigger>
          <TabsTrigger value="quizzes">Quiz ({attempts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="completions" className="mt-4 space-y-2">
          {completions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune leçon terminée pour le moment.</p>
          ) : (
            completions.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-card px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="size-4 text-success" />
                  <div>
                    <p className="text-sm font-medium">{c.lesson_title}</p>
                    <p className="text-xs text-muted-foreground">{lessonTypeLabels[c.lesson_type]}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{formatDateTime(c.completed_at)}</span>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="quizzes" className="mt-4 space-y-2">
          {attempts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune tentative enregistrée.</p>
          ) : (
            attempts.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-card px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{a.lesson_title}</p>
                  <p className="text-xs text-muted-foreground">
                    Tentative {a.attempt_number} · {formatDateTime(a.taken_at)}
                  </p>
                </div>
                <Badge variant="outline" className={a.passed ? "border-success/30 bg-success/15 text-success" : "border-destructive/30 bg-destructive/12 text-destructive"}>
                  {a.score}/100 {a.passed ? "réussi" : "échoué"}
                </Badge>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="submissions" className="mt-4 space-y-3">
          {submissions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun travail rendu.</p>
          ) : (
            submissions.map((s) => {
              const draft = drafts[s.id] ?? { grade: s.grade?.toString() ?? "", comment: s.feedback ?? "" };
              return (
                <Card key={s.id} className="border-border/70">
                  <CardContent className="space-y-3 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 text-muted-foreground" />
                        <p className="text-sm font-medium">{s.lesson_title}</p>
                        <Badge variant="secondary">{lessonTypeLabels[s.type]}</Badge>
                      </div>
                      <SubmissionBadge status={s.status} />
                    </div>
                    <p className="rounded-lg bg-secondary/60 px-4 py-3 text-sm">{s.content}</p>
                    <SubmissionAttachment
                      fileName={s.attachment_name}
                      description={s.content}
                      studentName={student.full_name}
                    />
                    <p className="text-xs text-muted-foreground">
                      Rendu le {formatDateTime(s.submitted_at)}
                      {s.grade !== null ? ` · note ${s.grade}/100` : ""}
                    </p>
                    {s.feedback ? (
                      <p className="rounded-md bg-secondary px-3 py-2 text-xs">Retour : {s.feedback}</p>
                    ) : null}

                    <div className="flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-end">
                      <div className="sm:w-28">
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          placeholder="Note /100"
                          value={draft.grade}
                          onChange={(e) => setDrafts((d) => ({ ...d, [s.id]: { ...draft, grade: e.target.value } }))}
                        />
                      </div>
                      <Textarea
                        placeholder="Retour pédagogique…"
                        value={draft.comment}
                        onChange={(e) => setDrafts((d) => ({ ...d, [s.id]: { ...draft, comment: e.target.value } }))}
                        className="min-h-[42px] flex-1"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="accent"
                          disabled={grade.isPending || draft.grade === ""}
                          onClick={() =>
                            grade.mutate({
                              submissionId: s.id,
                              grade: Number(draft.grade),
                              comment: draft.comment,
                              decision: "validated",
                            })
                          }
                        >
                          Valider
                        </Button>
                        <Button
                          variant="outline"
                          disabled={grade.isPending || draft.grade === ""}
                          onClick={() =>
                            grade.mutate({
                              submissionId: s.id,
                              grade: Number(draft.grade),
                              comment: draft.comment,
                              decision: "returned",
                            })
                          }
                        >
                          Renvoyer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
