import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Plus, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, EmptyState } from "@/components/instructor/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ContentStatusBadge } from "@/components/instructor/status-badges";
import { QuizBuilder } from "@/components/instructor/quiz-builder";
import { contentApi, lessonTypeLabels, type Lesson, type LessonType } from "@/lib/api";
import { lessonsQuery, modulesQuery, qk, trainingOverviewQuery } from "@/lib/queries";
import { getSessionInstructorId, useInstructorAuth } from "@/lib/instructor-auth";

export const Route = createFileRoute("/_instructor/trainings/$trainingId/_instructor/formations/$trainingId/contenu")({
  head: () => ({
    meta: [
      { title: "Contenu de la formation — Espace Formateur STAF PRINT CENTER" },
      { name: "description", content: "Créez et organisez modules, leçons, quiz et exercices, puis soumettez-les à validation administrateur." },
      { property: "og:title", content: "Contenu de la formation — Espace Formateur STAF PRINT CENTER" },
      { property: "og:description", content: "Créez et organisez modules, leçons, quiz et exercices, puis soumettez-les à validation administrateur." },
    ],
  }),
  loader: async ({ context, params }) => {
    const id = getSessionInstructorId();
    await Promise.all([
      context.queryClient.ensureQueryData(modulesQuery(id, params.trainingId)),
      context.queryClient.ensureQueryData(lessonsQuery(id, params.trainingId)),
      context.queryClient.ensureQueryData(trainingOverviewQuery(id, params.trainingId)),
    ]);
  },
  component: ContentPage,
});

function ContentPage() {
  const { trainingId } = Route.useParams();
  const { instructorId } = useInstructorAuth();
  const qc = useQueryClient();
  const { data: modules } = useSuspenseQuery(modulesQuery(instructorId, trainingId));
  const { data: lessons } = useSuspenseQuery(lessonsQuery(instructorId, trainingId));
  const { data: overview } = useSuspenseQuery(trainingOverviewQuery(instructorId, trainingId));
  const [editing, setEditing] = useState<Lesson | null>(null);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: qk.modules(instructorId, trainingId) });
    qc.invalidateQueries({ queryKey: qk.lessons(instructorId, trainingId) });
    qc.invalidateQueries({ queryKey: qk.reviews(instructorId) });
  };

  const run = <T,>(promise: Promise<T>, message: string) =>
    promise.then(() => { invalidate(); toast.success(message); }).catch((e: Error) => toast.error(e.message));

  const [moduleForm, setModuleForm] = useState({ title: "", description: "" });
  const [lessonForm, setLessonForm] = useState({ module_id: "", title: "", type: "video" as LessonType, duration_minutes: 15, video_url: "", content: "", brief: "" });

  const createModule = useMutation({
    mutationFn: () => contentApi.createModule(trainingId, moduleForm.title, moduleForm.description),
    onSuccess: () => { invalidate(); setModuleForm({ title: "", description: "" }); toast.success("Module créé en brouillon."); },
    onError: (e: Error) => toast.error(e.message),
  });

  const createLesson = useMutation({
    mutationFn: () => contentApi.createLesson({ ...lessonForm, training_id: trainingId }),
    onSuccess: () => { invalidate(); toast.success("Leçon créée en brouillon."); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={overview.training.cohort}
        title={`Contenu — ${overview.training.title}`}
        description="Toute création ou modification repart en brouillon et nécessite une validation administrateur avant publication."
        actions={
          <Dialog>
            <DialogTrigger asChild><Button variant="accent"><Plus className="size-4" /> Nouveau module</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-display">Créer un module</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2"><Label htmlFor="mt">Titre</Label><Input id="mt" value={moduleForm.title} onChange={(e) => setModuleForm((f) => ({ ...f, title: e.target.value }))} /></div>
                <div className="space-y-2"><Label htmlFor="md">Description</Label><Textarea id="md" value={moduleForm.description} onChange={(e) => setModuleForm((f) => ({ ...f, description: e.target.value }))} /></div>
              </div>
              <DialogFooter><Button variant="accent" onClick={() => createModule.mutate()} disabled={!moduleForm.title}>Créer</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {modules.length === 0 ? <EmptyState title="Aucun module" description="Commencez par créer un module." /> : null}

      <div className="space-y-5">
        {modules.map((m, index) => {
          const moduleLessons = lessons.filter((l) => l.module_id === m.id).sort((a, b) => a.position - b.position);
          return (
            <Card key={m.id} className="border-border/70">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="font-display text-xl">{index + 1}. {m.title}</CardTitle>
                    <ContentStatusBadge status={m.status} />
                    {!m.is_active ? <Badge variant="outline">Désactivé</Badge> : null}
                  </div>
                  <p className="text-sm text-muted-foreground">{m.description}</p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Button size="icon" variant="ghost" aria-label="Monter" onClick={() => run(contentApi.moveModule(m.id, -1), "Ordre mis à jour.")}><ArrowUp className="size-4" /></Button>
                  <Button size="icon" variant="ghost" aria-label="Descendre" onClick={() => run(contentApi.moveModule(m.id, 1), "Ordre mis à jour.")}><ArrowDown className="size-4" /></Button>
                  <div className="flex items-center gap-2 px-2"><Switch checked={m.is_active} onCheckedChange={(v) => run(contentApi.updateModule(m.id, { is_active: v }), "Module mis à jour.")} aria-label="Activer le module" /></div>
                  <Button size="sm" variant="soft" onClick={() => run(contentApi.submitForReview("module", m.id), "Module soumis à validation.")}><Send className="size-4" /> Soumettre</Button>
                  <Button size="icon" variant="ghost" aria-label="Supprimer" onClick={() => run(contentApi.deleteModule(m.id), "Module supprimé.")}><Trash2 className="size-4 text-destructive" /></Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {moduleLessons.map((l) => (
                  <div key={l.id} className="flex flex-col gap-2 rounded-lg border border-border/60 bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{lessonTypeLabels[l.type]}</Badge>
                        <span className="truncate text-sm font-medium">{l.title}</span>
                        <ContentStatusBadge status={l.status} />
                      </div>
                      <p className="text-xs text-muted-foreground">{l.duration_minutes} min</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Button size="icon" variant="ghost" aria-label="Monter la leçon" onClick={() => run(contentApi.moveLesson(l.id, -1), "Ordre mis à jour.")}><ArrowUp className="size-4" /></Button>
                      <Button size="icon" variant="ghost" aria-label="Descendre la leçon" onClick={() => run(contentApi.moveLesson(l.id, 1), "Ordre mis à jour.")}><ArrowDown className="size-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditing(l)}>Éditer</Button>
                      <Button size="sm" variant="soft" onClick={() => run(contentApi.submitForReview("lesson", l.id), "Leçon soumise à validation.")}>Soumettre</Button>
                      <Button size="icon" variant="ghost" aria-label="Supprimer la leçon" onClick={() => run(contentApi.deleteLesson(l.id), "Leçon supprimée.")}><Trash2 className="size-4 text-destructive" /></Button>
                    </div>
                  </div>
                ))}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => setLessonForm((f) => ({ ...f, module_id: m.id }))}><Plus className="size-4" /> Ajouter une leçon</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle className="font-display">Nouvelle leçon</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2"><Label htmlFor="lt">Titre</Label><Input id="lt" value={lessonForm.title} onChange={(e) => setLessonForm((f) => ({ ...f, title: e.target.value }))} /></div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select value={lessonForm.type} onValueChange={(v) => setLessonForm((f) => ({ ...f, type: v as LessonType }))}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {(Object.keys(lessonTypeLabels) as LessonType[]).map((t) => (<SelectItem key={t} value={t}>{lessonTypeLabels[t]}</SelectItem>))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2"><Label htmlFor="ld">Durée (min)</Label><Input id="ld" type="number" value={lessonForm.duration_minutes} onChange={(e) => setLessonForm((f) => ({ ...f, duration_minutes: Number(e.target.value) }))} /></div>
                      </div>
                      {lessonForm.type === "video" ? (<div className="space-y-2"><Label htmlFor="lv">URL de la vidéo</Label><Input id="lv" value={lessonForm.video_url} onChange={(e) => setLessonForm((f) => ({ ...f, video_url: e.target.value }))} /></div>) : null}
                      {lessonForm.type === "reading" ? (<div className="space-y-2"><Label htmlFor="lc">Contenu</Label><Textarea id="lc" rows={4} value={lessonForm.content} onChange={(e) => setLessonForm((f) => ({ ...f, content: e.target.value }))} /></div>) : null}
                      {["exercise", "assignment", "project"].includes(lessonForm.type) ? (<div className="space-y-2"><Label htmlFor="lb">Brief</Label><Textarea id="lb" rows={4} value={lessonForm.brief} onChange={(e) => setLessonForm((f) => ({ ...f, brief: e.target.value }))} /></div>) : null}
                    </div>
                    <DialogFooter><Button variant="accent" onClick={() => createLesson.mutate()} disabled={!lessonForm.title}>Créer en brouillon</Button></DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader><DialogTitle className="font-display">{editing?.title}</DialogTitle></DialogHeader>
          {editing ? (
            <LessonEditor
              lesson={editing}
              onSaved={() => { invalidate(); setEditing(null); }}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LessonEditor({ lesson, onSaved }: { lesson: Lesson; onSaved: () => void }) {
  const [draft, setDraft] = useState(lesson);
  const save = async () => {
    try {
      await contentApi.updateLesson(lesson.id, draft);
      toast.success("Leçon enregistrée en brouillon.");
      onSaved();
    } catch (e) { toast.error((e as Error).message); }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2"><Label htmlFor="et">Titre</Label><Input id="et" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></div>
      <div className="space-y-2"><Label htmlFor="ed">Durée (min)</Label><Input id="ed" type="number" value={draft.duration_minutes} onChange={(e) => setDraft({ ...draft, duration_minutes: Number(e.target.value) })} /></div>
      {draft.type === "video" ? (
        <>
          <div className="space-y-2"><Label htmlFor="ev">URL vidéo</Label><Input id="ev" value={draft.video_url ?? ""} onChange={(e) => setDraft({ ...draft, video_url: e.target.value })} /></div>
          <div className="space-y-2">
            <Label>Chapitrage</Label>
            {(draft.chapters ?? []).map((c, i) => (
              <div key={c.id} className="flex gap-2">
                <Input value={c.timecode} className="w-28" onChange={(e) => { const chapters = [...(draft.chapters ?? [])]; chapters[i] = { ...c, timecode: e.target.value }; setDraft({ ...draft, chapters }); }} />
                <Input value={c.label} onChange={(e) => { const chapters = [...(draft.chapters ?? [])]; chapters[i] = { ...c, label: e.target.value }; setDraft({ ...draft, chapters }); }} />
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={() => setDraft({ ...draft, chapters: [...(draft.chapters ?? []), { id: `chp_${Date.now()}`, label: "Nouveau chapitre", timecode: "00:00" }] })}><Plus className="size-4" /> Ajouter un chapitre</Button>
          </div>
        </>
      ) : null}
      {draft.type === "reading" ? (<div className="space-y-2"><Label htmlFor="ec">Contenu</Label><Textarea id="ec" rows={6} value={draft.content ?? ""} onChange={(e) => setDraft({ ...draft, content: e.target.value })} /></div>) : null}
      {["exercise", "assignment", "project"].includes(draft.type) ? (<div className="space-y-2"><Label htmlFor="eb">Brief</Label><Textarea id="eb" rows={5} value={draft.brief ?? ""} onChange={(e) => setDraft({ ...draft, brief: e.target.value })} /></div>) : null}
      {draft.type === "quiz" || draft.type === "exercise" ? (
        <QuizBuilder
          value={draft.quiz ?? { time_limit_minutes: draft.type === "quiz" ? 15 : null, pass_threshold: 70, max_attempts: 3, manual_grading: draft.type === "exercise", questions: [] }}
          isExercise={draft.type === "exercise"}
          onChange={(quiz) => setDraft({ ...draft, quiz })}
        />
      ) : null}
      <div className="flex justify-end gap-2"><Button variant="accent" onClick={save}>Enregistrer</Button></div>
    </div>
  );
}
