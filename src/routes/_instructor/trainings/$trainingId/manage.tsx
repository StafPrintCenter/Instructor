import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, ChevronRight, Loader2, Pencil, Plus, Send, Trash2, X } from "lucide-react";
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
import { ConfirmDelete, ConfirmAction } from "@/components/site/InstructorBits";
import { lessonKindLabels, getYoutubeEmbedUrl, type LessonKind, type APIInstructorLesson, type APIInstructorModule } from "@/data/content";
import { useModulesList, useCreateModule, useUpdateModule, useDeleteModule, useSubmitModuleForReview } from "@/stores/useModulesStore";
import { useLessonsByModules, useCreateLesson, useUpdateLesson, useDeleteLesson, useSubmitLessonForReview } from "@/stores/useLessonsStore";
import { useInstructorTrainingOverview } from "@/stores/useTrainingsStore";
import { formatDate } from "@/lib/api";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/trainings/$trainingId/manage")({
  head: () => ({
    meta: [
      { title: `Contenu de la formation - Espace Formateur ${SITE.name}` },
      { name: "description", content: "Créez et organisez modules, leçons, quiz et exercices, puis soumettez-les à validation administrateur." },
      { property: "og:title", content: `Contenu de la formation - Espace Formateur ${SITE.name}` },
      { property: "og:description", content: "Créez et organisez modules, leçons, quiz et exercices, puis soumettez-les à validation administrateur." },
    ],
  }),
  component: ContentPage,
});

const emptyLesson = {
  title: "",
  duration_minutes: 15,
  kind: "video" as LessonKind,
  video_url: "",
  content: "",
  brief: "",
  is_mandatory: true,
  chapters: [] as string[],
};

function ContentPage() {
  const { trainingId } = Route.useParams();

  const { overview, isLoading: isOverviewLoading } = useInstructorTrainingOverview(trainingId);
  const { modules, isLoading: isModulesLoading } = useModulesList(trainingId);
  const moduleIds = modules.map((m) => m.id);
  const { lessonsByModule, isLoading: isLessonsLoading } = useLessonsByModules(moduleIds);

  const createModule = useCreateModule(trainingId);
  const updateModule = useUpdateModule(trainingId);
  const deleteModule = useDeleteModule(trainingId);
  const submitModule = useSubmitModuleForReview(trainingId);

  const createLesson = useCreateLesson();
  const updateLesson = useUpdateLesson();
  const deleteLesson = useDeleteLesson();
  const submitLesson = useSubmitLessonForReview();

  const [isCreateModuleOpen, setIsCreateModuleOpen] = useState(false);
  const [moduleForm, setModuleForm] = useState({ title: "", description: "", sort_order: modules.length });

  const [editingModule, setEditingModule] = useState<APIInstructorModule | null>(null);
  const [moduleEditForm, setModuleEditForm] = useState({ title: "", description: "", sort_order: 0 });

  const [lessonDialogModuleId, setLessonDialogModuleId] = useState<string | null>(null);
  const [lessonForm, setLessonForm] = useState(emptyLesson);

  const [editingLesson, setEditingLesson] = useState<{ moduleId: string; lesson: APIInstructorLesson } | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());

  const [moduleToDelete, setModuleToDelete] = useState<APIInstructorModule | null>(null);
  const [moduleToSubmit, setModuleToSubmit] = useState<APIInstructorModule | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<{ moduleId: string; lesson: APIInstructorLesson } | null>(null);
  const [lessonToSubmit, setLessonToSubmit] = useState<{ moduleId: string; lesson: APIInstructorLesson } | null>(null);

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleLesson = (id: string) => {
    setExpandedLessons((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (isOverviewLoading || isModulesLoading || !overview) {
    return (
      <div className="space-y-6">
        <div className="h-16 animate-pulse rounded-lg bg-muted" />
        <div className="h-44 animate-pulse rounded-lg bg-muted" />
        <div className="h-44 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  const training = overview.data;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={training.theme}
        title={training.title}
        description="Gestion des modules et leçons de cette formation."
        actions={
          <Dialog
            open={isCreateModuleOpen}
            onOpenChange={(open) => {
              setIsCreateModuleOpen(open);
              if (open) setModuleForm({ title: "", description: "", sort_order: modules.length });
            }}
          >
            <DialogTrigger asChild>
              <Button variant="accent"><Plus className="size-4" /> Nouveau module</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-display">Créer un module</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2"><Label htmlFor="mt">Titre</Label><Input id="mt" value={moduleForm.title} onChange={(e) => setModuleForm((f) => ({ ...f, title: e.target.value }))} /></div>
                <div className="space-y-2"><Label htmlFor="md">Description</Label><Textarea id="md" value={moduleForm.description} onChange={(e) => setModuleForm((f) => ({ ...f, description: e.target.value }))} /></div>
                <div className="space-y-2"><Label htmlFor="mo">Ordre</Label><Input id="mo" type="number" min={0} value={moduleForm.sort_order} onChange={(e) => setModuleForm((f) => ({ ...f, sort_order: Number(e.target.value) }))} /></div>
              </div>
              <DialogFooter>
                <Button
                  variant="accent"
                  disabled={!moduleForm.title}
                  onClick={() =>
                    createModule.mutate(
                      { title: moduleForm.title, description: moduleForm.description, sort_order: modules.length },
                      {
                        onSuccess: () => { setModuleForm({ title: "", description: "" }); toast.success("Module créé en brouillon."); },
                        onError: (e) => toast.error(e.message),
                      }
                    )
                  }
                >
                  Créer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {modules.length === 0 ? <EmptyState title="Aucun module" description="Commencez par créer un module." /> : null}

      <div className="space-y-5">
        {modules.map((m, index) => {
          const moduleLessons = lessonsByModule[m.id] ?? [];
          return (
            <Card key={m.id} className="border-border/70">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="font-display text-xl">{index + 1}. {m.title}</CardTitle>
                    <ContentStatusBadge status={m.status} />
                    {!m.isEnabled ? <Badge variant="outline">Désactivé</Badge> : null}
                  </div>
                  <p className="text-sm text-muted-foreground">{m.description}</p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="soft"
                    onClick={() => run(submitModule.mutateAsync(m.id), "Module soumis à validation.")}
                  >
                    <Send className="size-4" /> Soumettre
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Supprimer"
                    onClick={() => run(deleteModule.mutateAsync(m.id), "Module supprimé.")}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {isLessonsLoading ? (
                  <div className="h-10 animate-pulse rounded-lg bg-muted" />
                ) : (
                  moduleLessons.map((l) => (
                    <div key={l.id} className="flex flex-col gap-2 rounded-lg border border-border/60 bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary">{lessonKindLabels[l.kind]}</Badge>
                          <span className="truncate text-sm font-medium">{l.title}</span>
                          <ContentStatusBadge status={l.status} />
                        </div>
                        <p className="text-xs text-muted-foreground">{l.durationMinutes ?? 0} min</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Button size="sm" variant="ghost" onClick={() => setEditing({ moduleId: m.id, lesson: l })}>Éditer</Button>
                        <Button
                          size="sm"
                          variant="soft"
                          onClick={() => run(submitLesson.mutateAsync({ id: l.id, moduleId: m.id }), "Leçon soumise à validation.")}
                        >
                          Soumettre
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Supprimer la leçon"
                          onClick={() => run(deleteLesson.mutateAsync({ id: l.id, moduleId: m.id }), "Leçon supprimée.")}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => setLessonForm({ moduleId: m.id, ...empty, sort_order: moduleLessons.length })}>
                      <Plus className="size-4" /> Ajouter une leçon
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle className="font-display">Nouvelle leçon</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2"><Label htmlFor="lt">Titre</Label><Input id="lt" value={lessonForm.title} onChange={(e) => setLessonForm((f) => ({ ...f, title: e.target.value }))} /></div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select value={lessonForm.kind} onValueChange={(v) => setLessonForm((f) => ({ ...f, kind: v as LessonKind }))}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {(Object.keys(lessonKindLabels) as LessonKind[]).map((k) => (<SelectItem key={k} value={k}>{lessonKindLabels[k]}</SelectItem>))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2"><Label htmlFor="ld">Durée (min)</Label><Input id="ld" type="number" value={lessonForm.duration_minutes} onChange={(e) => setLessonForm((f) => ({ ...f, duration_minutes: Number(e.target.value) }))} /></div>
                      </div>
                      {lessonForm.kind === "video" ? (<div className="space-y-2"><Label htmlFor="lv">URL de la vidéo</Label><Input id="lv" value={lessonForm.video_url} onChange={(e) => setLessonForm((f) => ({ ...f, video_url: e.target.value }))} /></div>) : null}
                      {lessonForm.kind === "reading" ? (<div className="space-y-2"><Label htmlFor="lc">Contenu</Label><Textarea id="lc" rows={4} value={lessonForm.content} onChange={(e) => setLessonForm((f) => ({ ...f, content: e.target.value }))} /></div>) : null}
                      {["exercise", "assignment", "project", "quiz"].includes(lessonForm.kind) ? (<div className="space-y-2"><Label htmlFor="lb">Brief</Label><Textarea id="lb" rows={4} value={lessonForm.brief} onChange={(e) => setLessonForm((f) => ({ ...f, brief: e.target.value }))} /></div>) : null}
                    </div>
                    <DialogFooter>
                      <Button
                        variant="accent"
                        disabled={!lessonForm.title}
                        onClick={() =>
                          createLesson.mutate(
                            {
                              moduleId: lessonForm.moduleId,
                              payload: {
                                title: lessonForm.title,
                                sort_order: lessonForm.sort_order,
                                duration_minutes: lessonForm.duration_minutes,
                                kind: lessonForm.kind,
                                video_url: lessonForm.kind === "video" ? lessonForm.video_url : undefined,
                                content: lessonForm.kind === "reading" ? lessonForm.content : undefined,
                                brief: ["exercise", "assignment", "project", "quiz"].includes(lessonForm.kind) ? lessonForm.brief : undefined,
                              },
                            },
                            { onSuccess: () => toast.success("Leçon créée en brouillon."), onError: (e) => toast.error(e.message) }
                          )
                        }
                      >
                        Créer en brouillon
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader><DialogTitle className="font-display">{editing?.lesson.title}</DialogTitle></DialogHeader>
          {editing ? (
            <LessonEditor
              moduleId={editing.moduleId}
              lesson={editing.lesson}
              onSaved={() => setEditing(null)}
              updateLesson={updateLesson}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LessonEditor({
  moduleId,
  lesson,
  onSaved,
  updateLesson,
}: {
  moduleId: string;
  lesson: APIInstructorLesson;
  onSaved: () => void;
  updateLesson: ReturnType<typeof useUpdateLesson>;
}) {
  const [draft, setDraft] = useState({
    title: lesson.title,
    duration_minutes: Number(lesson.durationMinutes ?? 0),
    video_url: lesson.videoUrl ?? "",
    content: lesson.content ?? "",
    brief: lesson.brief ?? "",
  });

  const save = () => {
    updateLesson.mutate(
      {
        id: lesson.id,
        moduleId,
        payload: {
          title: draft.title,
          kind: lesson.kind,
          duration_minutes: draft.duration_minutes,
          video_url: lesson.kind === "video" ? draft.video_url : undefined,
          content: lesson.kind === "reading" ? draft.content : undefined,
          brief: ["exercise", "assignment", "project", "quiz"].includes(lesson.kind) ? draft.brief : undefined,
        },
      },
      {
        onSuccess: () => { toast.success("Leçon enregistrée en brouillon."); onSaved(); },
        onError: (e) => toast.error(e.message),
      }
    );
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2"><Label htmlFor="et">Titre</Label><Input id="et" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></div>
      <div className="space-y-2"><Label htmlFor="ed">Durée (min)</Label><Input id="ed" type="number" value={draft.duration_minutes} onChange={(e) => setDraft({ ...draft, duration_minutes: Number(e.target.value) })} /></div>
      {lesson.kind === "video" ? (
        <div className="space-y-2"><Label htmlFor="ev">URL vidéo</Label><Input id="ev" value={draft.video_url} onChange={(e) => setDraft({ ...draft, video_url: e.target.value })} /></div>
      ) : null}
      {lesson.kind === "reading" ? (
        <div className="space-y-2"><Label htmlFor="ec">Contenu</Label><Textarea id="ec" rows={6} value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} /></div>
      ) : null}
      {["exercise", "assignment", "project", "quiz"].includes(lesson.kind) ? (
        <div className="space-y-2"><Label htmlFor="eb">Brief</Label><Textarea id="eb" rows={5} value={draft.brief} onChange={(e) => setDraft({ ...draft, brief: e.target.value })} /></div>
      ) : null}
      {/* Le chapitrage vidéo et la structure d'un quiz ne sont pas encore confirmés par un curl —
          à réintroduire dès que la forme exacte de `chapters` et d'un éventuel objet quiz sera connue. */}
      <div className="flex justify-end gap-2"><Button variant="accent" onClick={save}>Enregistrer</Button></div>
    </div>
  );
}