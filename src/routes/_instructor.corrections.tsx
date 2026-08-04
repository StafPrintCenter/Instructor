import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { ClipboardCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, EmptyState } from "@/components/instructor/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmissionBadge } from "@/components/instructor/status-badges";
import { SubmissionAttachment } from "@/components/instructor/submission-attachment";
import { queueQuery, trainingsQuery, qk } from "@/lib/queries";
import { getSessionInstructorId, useInstructorAuth } from "@/lib/instructor-auth";
import { daysSince, formatDateTime, gradingApi, initials, lessonTypeLabels } from "@/lib/api";

export const Route = createFileRoute("/_instructor/corrections")({
  head: () => ({
    meta: [
      { title: "File de correction — STAF PRINT CENTER" },
      {
        name: "description",
        content: "Corrigez les exercices, devoirs et projets rendus par vos apprenants et renvoyez un retour détaillé.",
      },
      { property: "og:title", content: "File de correction — STAF PRINT CENTER" },
      { property: "og:description", content: "Notation, retours et corrections groupées des travaux rendus." },
    ],
  }),
  loader: ({ context }) => {
    const id = getSessionInstructorId();
    return Promise.all([
      context.queryClient.ensureQueryData(queueQuery(id)),
      context.queryClient.ensureQueryData(trainingsQuery(id)),
    ]);
  },
  component: CorrectionsPage,
});

function CorrectionsPage() {
  const { instructorId } = useInstructorAuth();
  const queryClient = useQueryClient();
  const { data: queue } = useSuspenseQuery(queueQuery(instructorId));
  const { data: trainings } = useSuspenseQuery(trainingsQuery(instructorId));

  const [training, setTraining] = useState("all");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("pending");
  const [selected, setSelected] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<Record<string, { grade: string; comment: string }>>({});
  const [bulkGrade, setBulkGrade] = useState("");
  const [bulkComment, setBulkComment] = useState("");

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["grading"] });
    queryClient.invalidateQueries({ queryKey: ["students"] });
    queryClient.invalidateQueries({ queryKey: qk.stats(instructorId) });
  };

  const gradeOne = useMutation({
    mutationFn: (input: { submissionId: string; grade: number; comment: string; decision: "validated" | "returned" }) =>
      gradingApi.grade({ instructorId, ...input }),
    onSuccess: (_, vars) => {
      invalidate();
      setSelected((s) => s.filter((id) => id !== vars.submissionId));
      toast.success(vars.decision === "validated" ? "Travail validé." : "Travail renvoyé à l'apprenant.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const gradeBulk = useMutation({
    mutationFn: (decision: "validated" | "returned") =>
      gradingApi.gradeBulk({
        instructorId,
        submissionIds: selected,
        grade: Number(bulkGrade),
        comment: bulkComment,
        decision,
      }),
    onSuccess: (res) => {
      invalidate();
      setSelected([]);
      setBulkGrade("");
      setBulkComment("");
      toast.success(`${res.updated} correction(s) enregistrée(s).`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = useMemo(
    () =>
      queue
        .filter((s) => (training === "all" ? true : s.training_id === training))
        .filter((s) => (type === "all" ? true : s.type === type))
        .filter((s) => (status === "all" ? true : s.status === status)),
    [queue, training, type, status],
  );

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const pending = queue.filter((s) => s.status === "pending").length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Évaluation"
        title="File de correction"
        description="Exercices, devoirs et projets en attente de votre retour."
        actions={
          <Badge variant="outline" className="border-accent/40 bg-accent/20 px-3 py-1.5 text-sm text-accent-foreground">
            {pending} à corriger
          </Badge>
        }
      />

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
          <Select value={training} onValueChange={setTraining}>
            <SelectTrigger className="sm:w-60">
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
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="sm:w-44">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="exercise">Exercice</SelectItem>
              <SelectItem value="assignment">Devoir</SelectItem>
              <SelectItem value="project">Projet</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="sm:w-44">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">À corriger</SelectItem>
              <SelectItem value="graded">Corrigé</SelectItem>
              <SelectItem value="returned">Renvoyé</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selected.length > 0 ? (
        <Card className="border-accent/40 bg-accent/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Correction groupée — {selected.length} sélection(s)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="sm:w-28">
              <Input
                type="number"
                min={0}
                max={100}
                placeholder="Note /100"
                value={bulkGrade}
                onChange={(e) => setBulkGrade(e.target.value)}
              />
            </div>
            <Textarea
              placeholder="Commentaire commun…"
              value={bulkComment}
              onChange={(e) => setBulkComment(e.target.value)}
              className="min-h-[42px] flex-1"
            />
            <div className="flex gap-2">
              <Button
                variant="accent"
                disabled={gradeBulk.isPending || bulkGrade === ""}
                onClick={() => gradeBulk.mutate("validated")}
              >
                Valider
              </Button>
              <Button
                variant="outline"
                disabled={gradeBulk.isPending || bulkGrade === ""}
                onClick={() => gradeBulk.mutate("returned")}
              >
                Renvoyer
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {filtered.length === 0 ? (
        <EmptyState
          icon={<ClipboardCheck className="size-6" />}
          title="Rien à corriger"
          description="Aucune soumission ne correspond aux filtres sélectionnés."
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((s) => {
            const draft = drafts[s.id] ?? { grade: s.grade?.toString() ?? "", comment: s.feedback ?? "" };
            const late = s.status === "pending" && daysSince(s.submitted_at) > 5;
            return (
              <Card key={s.id} className={late ? "border-destructive/40" : undefined}>
                <CardContent className="space-y-4 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selected.includes(s.id)}
                        onCheckedChange={() => toggle(s.id)}
                        aria-label={`Sélectionner le rendu de ${s.student.full_name}`}
                        className="mt-1"
                      />
                      <Avatar className="size-9">
                        <AvatarFallback className="bg-secondary text-xs">
                          {initials(s.student.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{s.student.full_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.lesson_title} · {s.training_title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{lessonTypeLabels[s.type]}</Badge>
                      <SubmissionBadge status={s.status} />
                      {late ? <Badge variant="outline" className="border-destructive/30 text-destructive">En retard</Badge> : null}
                    </div>
                  </div>

                  <p className="rounded-lg bg-secondary/60 px-4 py-3 text-sm">{s.content}</p>
                  <SubmissionAttachment
                    fileName={s.attachment_name}
                    description={s.content}
                    studentName={s.student.full_name}
                  />
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>Rendu le {formatDateTime(s.submitted_at)}</span>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-end">
                    <div className="sm:w-28">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="Note /100"
                        value={draft.grade}
                        onChange={(e) =>
                          setDrafts((d) => ({ ...d, [s.id]: { ...draft, grade: e.target.value } }))
                        }
                      />
                    </div>
                    <Textarea
                      placeholder="Retour pédagogique…"
                      value={draft.comment}
                      onChange={(e) =>
                        setDrafts((d) => ({ ...d, [s.id]: { ...draft, comment: e.target.value } }))
                      }
                      className="min-h-[42px] flex-1"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="accent"
                        disabled={gradeOne.isPending || draft.grade === ""}
                        onClick={() =>
                          gradeOne.mutate({
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
                        disabled={gradeOne.isPending || draft.grade === ""}
                        onClick={() =>
                          gradeOne.mutate({
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
          })}
        </div>
      )}
    </div>
  );
}
