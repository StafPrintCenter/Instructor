import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, ChevronRight, Loader2, Pencil, Plus, Send, Trash2, X, Video, BookOpen, HelpCircle, Dumbbell, FileCheck, FolderKanban, Clock, ExternalLink, Sparkles } from "lucide-react";
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

/** Kinds pour lesquels le chapitrage est proposé — quiz/exercise/assignment/project n'en ont pas besoin. */
const CHAPTERS_ALLOWED_KINDS: LessonKind[] = ["video", "reading"];
const BRIEF_KINDS: LessonKind[] = ["exercise", "assignment", "project", "quiz"];

/** Icônes associées au type de leçon */
const LESSON_KIND_ICONS: Record<LessonKind, React.ElementType> = {
  video: Video,
  reading: BookOpen,
  quiz: HelpCircle,
  exercise: Dumbbell,
  assignment: FileCheck,
  project: FolderKanban,
};

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
                  disabled={!moduleForm.title || createModule.isPending}
                  onClick={() =>
                    createModule.mutate(
                      { title: moduleForm.title, description: moduleForm.description, sort_order: moduleForm.sort_order },
                      {
                        onSuccess: () => {
                          setIsCreateModuleOpen(false);
                          toast.success("Module créé en brouillon.");
                        },
                        onError: (e) => toast.error(e.message),
                      }
                    )
                  }
                >
                  {createModule.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                  Créer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {modules.length === 0 ? <EmptyState title="Aucun module" description="Commencez par créer un module." /> : null}

      <div className="space-y-4">
        {modules.map((m, index) => {
          const moduleLessons = lessonsByModule[m.id] ?? [];
          const isExpanded = expandedModules.has(m.id);

          return (
            <Card key={m.id} className="border-border/70 shadow-sm transition-all hover:border-border">
              <CardHeader className="flex flex-row items-start justify-between gap-3 py-4">
                <button
                  type="button"
                  onClick={() => toggleModule(m.id)}
                  className="flex flex-1 items-start gap-2.5 text-left"
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? (
                    <ChevronDown className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform" />
                  ) : (
                    <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform" />
                  )}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="font-display text-lg">{index + 1}. {m.title}</CardTitle>
                      <ContentStatusBadge status={m.status} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {m.lessonsCount} leçon{m.lessonsCount > 1 ? "s" : ""} · ordre {m.sortOrder} · créé le {formatDate(m.createdAt)}
                    </p>
                  </div>
                </button>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Modifier"
                    onClick={() => {
                      setModuleEditForm({ title: m.title, description: m.description ?? "", sort_order: Number(m.sortOrder) });
                      setEditingModule(m);
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button size="icon" variant="ghost" aria-label="Soumettre" onClick={() => setModuleToSubmit(m)}>
                    <Send className="size-4" />
                  </Button>
                  <Button size="icon" variant="ghost" aria-label="Supprimer" onClick={() => setModuleToDelete(m)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>

              {isExpanded ? (
                <CardContent className="space-y-2.5 pt-0">
                  {isLessonsLoading ? (
                    <div className="space-y-2">
                      <div className="h-12 animate-pulse rounded-xl bg-muted/60" />
                      <div className="h-12 animate-pulse rounded-xl bg-muted/60" />
                    </div>
                  ) : moduleLessons.length > 0 ? (
                    <div className="space-y-2">
                      {moduleLessons.map((l) => (
                        <LessonRow
                          key={l.id}
                          lesson={l}
                          isOpen={expandedLessons.has(l.id)}
                          onToggle={() => toggleLesson(l.id)}
                          onEdit={() => setEditingLesson({ moduleId: m.id, lesson: l })}
                          onSubmit={() => setLessonToSubmit({ moduleId: m.id, lesson: l })}
                          onDelete={() => setLessonToDelete({ moduleId: m.id, lesson: l })}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border/80 p-6 text-center text-xs text-muted-foreground">
                      Aucune leçon dans ce module. Cliquez ci-dessous pour en ajouter une.
                    </div>
                  )}

                  <Dialog
                    open={lessonDialogModuleId === m.id}
                    onOpenChange={(open) => {
                      setLessonDialogModuleId(open ? m.id : null);
                      if (open) setLessonForm({ ...emptyLesson });
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="mt-2 w-full border-dashed hover:border-solid hover:bg-accent/5">
                        <Plus className="mr-1.5 size-4" /> Ajouter une leçon
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
                      <DialogHeader><DialogTitle className="font-display">Nouvelle leçon</DialogTitle></DialogHeader>
                      <LessonForm
                        form={lessonForm}
                        onChange={setLessonForm}
                        isPending={createLesson.isPending}
                        onSubmit={() =>
                          createLesson.mutate(
                            {
                              moduleId: m.id,
                              payload: {
                                title: lessonForm.title,
                                sort_order: moduleLessons.length,
                                duration_minutes: lessonForm.duration_minutes,
                                kind: lessonForm.kind,
                                is_mandatory: lessonForm.is_mandatory,
                                video_url: lessonForm.kind === "video" ? lessonForm.video_url : undefined,
                                content: lessonForm.kind === "reading" ? lessonForm.content : undefined,
                                brief: BRIEF_KINDS.includes(lessonForm.kind) ? lessonForm.brief : undefined,
                                chapters: CHAPTERS_ALLOWED_KINDS.includes(lessonForm.kind) && lessonForm.chapters.length > 0 ? lessonForm.chapters : undefined,
                              },
                            },
                            {
                              onSuccess: () => {
                                toast.success("Leçon créée en brouillon.");
                                setLessonDialogModuleId(null);
                              },
                              onError: (e) => toast.error(e.message),
                            }
                          )
                        }
                        submitLabel="Créer en brouillon"
                      />
                    </DialogContent>
                  </Dialog>
                </CardContent>
              ) : null}
            </Card>
          );
        })}
      </div>

      {/* Édition module */}
      <Dialog open={!!editingModule} onOpenChange={(open) => !open && setEditingModule(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Modifier le module</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label htmlFor="emt">Titre</Label><Input id="emt" value={moduleEditForm.title} onChange={(e) => setModuleEditForm((f) => ({ ...f, title: e.target.value }))} /></div>
            <div className="space-y-2"><Label htmlFor="emd">Description</Label><Textarea id="emd" value={moduleEditForm.description} onChange={(e) => setModuleEditForm((f) => ({ ...f, description: e.target.value }))} /></div>
            <div className="space-y-2"><Label htmlFor="emo">Ordre</Label><Input id="emo" type="number" min={0} value={moduleEditForm.sort_order} onChange={(e) => setModuleEditForm((f) => ({ ...f, sort_order: Number(e.target.value) }))} /></div>
          </div>
          <DialogFooter>
            <Button
              variant="accent"
              disabled={!moduleEditForm.title || updateModule.isPending}
              onClick={() => {
                if (!editingModule) return;
                updateModule.mutate(
                  { id: editingModule.id, payload: moduleEditForm },
                  {
                    onSuccess: () => { toast.success("Module modifié."); setEditingModule(null); },
                    onError: (e) => toast.error(e.message),
                  }
                );
              }}
            >
              {updateModule.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Édition leçon */}
      <Dialog open={!!editingLesson} onOpenChange={(open) => !open && setEditingLesson(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader><DialogTitle className="font-display">{editingLesson?.lesson.title}</DialogTitle></DialogHeader>
          {editingLesson ? (
            <LessonEditor
              moduleId={editingLesson.moduleId}
              lesson={editingLesson.lesson}
              onSaved={() => setEditingLesson(null)}
              updateLesson={updateLesson}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Confirmations module */}
      <ConfirmDelete
        open={!!moduleToDelete}
        onOpenChange={(open) => !open && setModuleToDelete(null)}
        title={`Supprimer "${moduleToDelete?.title}" ?`}
        onConfirm={() => {
          if (!moduleToDelete) return;
          deleteModule.mutate(moduleToDelete.id, {
            onSuccess: () => toast.success("Module supprimé."),
            onError: (e) => toast.error(e.message),
          });
          setModuleToDelete(null);
        }}
      />
      <ConfirmAction
        open={!!moduleToSubmit}
        onOpenChange={(open) => !open && setModuleToSubmit(null)}
        title={`Soumettre "${moduleToSubmit?.title}" à validation ?`}
        description="Le module passera en attente de validation par l'administrateur."
        confirmLabel="Soumettre"
        onConfirm={() => {
          if (!moduleToSubmit) return;
          submitModule.mutate(moduleToSubmit.id, {
            onSuccess: () => toast.success("Module soumis à validation."),
            onError: (e) => toast.error(e.message),
          });
          setModuleToSubmit(null);
        }}
      />

      {/* Confirmations leçon */}
      <ConfirmDelete
        open={!!lessonToDelete}
        onOpenChange={(open) => !open && setLessonToDelete(null)}
        title={`Supprimer "${lessonToDelete?.lesson.title}" ?`}
        onConfirm={() => {
          if (!lessonToDelete) return;
          deleteLesson.mutate(
            { id: lessonToDelete.lesson.id, moduleId: lessonToDelete.moduleId },
            {
              onSuccess: () => toast.success("Leçon supprimée."),
              onError: (e) => toast.error(e.message),
            }
          );
          setLessonToDelete(null);
        }}
      />
      <ConfirmAction
        open={!!lessonToSubmit}
        onOpenChange={(open) => !open && setLessonToSubmit(null)}
        title={`Soumettre "${lessonToSubmit?.lesson.title}" à validation ?`}
        description="La leçon passera en attente de validation par l'administrateur."
        confirmLabel="Soumettre"
        onConfirm={() => {
          if (!lessonToSubmit) return;
          submitLesson.mutate(
            { id: lessonToSubmit.lesson.id, moduleId: lessonToSubmit.moduleId },
            {
              onSuccess: () => toast.success("Leçon soumise à validation."),
              onError: (e) => toast.error(e.message),
            }
          );
          setLessonToSubmit(null);
        }}
      />
    </div>
  );
}

function LessonRow({
  lesson: l,
  isOpen,
  onToggle,
  onEdit,
  onSubmit,
  onDelete,
}: {
  lesson: APIInstructorLesson;
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onSubmit: () => void;
  onDelete: () => void;
}) {
  const embedUrl = l.videoUrl ? getYoutubeEmbedUrl(l.videoUrl) : null;
  const hasDetails = Boolean(l.content || l.brief || l.videoUrl || (l.chapters && l.chapters.length > 0));
  const KindIcon = LESSON_KIND_ICONS[l.kind] || BookOpen;

  return (
    <div
      className={`group rounded-xl border transition-all duration-200 ${isOpen
        ? "border-primary/30 bg-muted/20 shadow-sm"
        : "border-border/60 bg-card hover:border-border hover:bg-muted/10"
        }`}
    >
      <div className="flex items-center justify-between gap-3 px-3.5 py-3">
        <button
          type="button"
          onClick={onToggle}
          disabled={!hasDetails}
          className="flex flex-1 items-center gap-3 text-left disabled:cursor-default"
        >
          {/* Indicateur de développement */}
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted/60 text-muted-foreground transition-colors group-hover:bg-muted">
            {hasDetails ? (
              isOpen ? (
                <ChevronDown className="size-4 text-foreground" />
              ) : (
                <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground" />
              )
            ) : (
              <span className="size-1.5 rounded-full bg-muted-foreground/40" />
            )}
          </div>

          {/* Icône du type de leçon */}
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <KindIcon className="size-4" />
          </div>

          {/* Titre & Badges */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-semibold tracking-tight text-foreground">{l.title}</span>
              {l.isMandatory ? (
                <Badge variant="outline" className="h-4 shrink-0 rounded-sm border-amber-500/30 bg-amber-500/10 text-[9px] font-medium text-amber-600 dark:text-amber-400 px-1">
                  Obligatoire
                </Badge>
              ) : null}
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
              <span>{lessonKindLabels[l.kind]}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="size-3" /> {l.durationMinutes ?? "—"} min
              </span>
            </div>
          </div>

          <ContentStatusBadge status={l.status} className="shrink-0" />
        </button>

        {/* Actions sur la leçon */}
        <div className="flex shrink-0 items-center gap-1 pl-2 border-l border-border/40">
          <Button
            size="icon"
            variant="ghost"
            className="size-8 text-muted-foreground hover:text-foreground"
            aria-label="Éditer"
            onClick={onEdit}
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-8 text-muted-foreground hover:text-foreground"
            aria-label="Soumettre"
            onClick={onSubmit}
          >
            <Send className="size-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-8 text-muted-foreground hover:text-destructive"
            aria-label="Supprimer"
            onClick={onDelete}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Détails déroulants de la leçon */}
      {isOpen && hasDetails ? (
        <div className="space-y-4 border-t border-border/40 bg-background/50 p-4 rounded-b-xl text-sm">
          {embedUrl ? (
            <div className="overflow-hidden rounded-lg border border-border/60 shadow-sm aspect-video w-full max-w-2xl mx-auto">
              <iframe src={embedUrl} title={l.title} className="h-full w-full" allowFullScreen />
            </div>
          ) : l.videoUrl ? (
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-muted-foreground">Lien vidéo :</span>
              <a
                href={l.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
              >
                Ouvrir la vidéo dans un nouvel onglet <ExternalLink className="size-3" />
              </a>
            </div>
          ) : null}

          {l.content ? (
            <div className="rounded-lg border border-border/40 bg-card p-3.5 space-y-1.5">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <BookOpen className="size-3.5" /> Contenu
              </p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{l.content}</p>
            </div>
          ) : null}

          {l.brief ? (
            <div className="rounded-lg border border-border/40 bg-card p-3.5 space-y-1.5">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Sparkles className="size-3.5" /> Résumé
              </p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{l.brief}</p>
            </div>
          ) : null}

          {l.chapters && l.chapters.length > 0 ? (
            <div className="rounded-lg border border-border/40 bg-card p-3.5 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Chapitres</p>
              <ul className="grid gap-1.5 sm:grid-cols-2">
                {l.chapters.map((c, i) => (
                  <li key={i} className="flex items-center gap-2 rounded-md bg-muted/40 px-2.5 py-1.5 text-xs text-foreground/90">
                    <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="truncate">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ChaptersEditor({ chapters, onChange }: { chapters: string[]; onChange: (chapters: string[]) => void }) {
  return (
    <div className="space-y-2">
      <Label>Chapitres (optionnel)</Label>
      {chapters.map((c, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={c}
            placeholder={`Chapitre ${i + 1}`}
            onChange={(e) => {
              const next = [...chapters];
              next[i] = e.target.value;
              onChange(next);
            }}
          />
          <Button size="icon" variant="ghost" aria-label="Retirer" onClick={() => onChange(chapters.filter((_, idx) => idx !== i))}>
            <X className="size-4 text-destructive" />
          </Button>
        </div>
      ))}
      <Button variant="ghost" size="sm" onClick={() => onChange([...chapters, ""])}>
        <Plus className="size-4" /> Ajouter un chapitre
      </Button>
    </div>
  );
}

/* ---------- Formulaire leçon (création) ---------- */

function LessonForm({
  form,
  onChange,
  onSubmit,
  isPending,
  submitLabel,
}: {
  form: typeof emptyLesson;
  onChange: (form: typeof emptyLesson) => void;
  onSubmit: () => void;
  isPending: boolean;
  submitLabel: string;
}) {
  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2"><Label htmlFor="lt">Titre</Label><Input id="lt" value={form.title} onChange={(e) => onChange({ ...form, title: e.target.value })} /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={form.kind} onValueChange={(v) => onChange({ ...form, kind: v as LessonKind })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(lessonKindLabels) as LessonKind[]).map((k) => (<SelectItem key={k} value={k}>{lessonKindLabels[k]}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label htmlFor="ld">Durée (min)</Label><Input id="ld" type="number" value={form.duration_minutes} onChange={(e) => onChange({ ...form, duration_minutes: Number(e.target.value) })} /></div>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3">
          <Label className="cursor-pointer">Leçon obligatoire</Label>
          <Switch checked={form.is_mandatory} onCheckedChange={(v) => onChange({ ...form, is_mandatory: v })} />
        </div>

        {form.kind === "video" ? (
          <div className="space-y-2"><Label htmlFor="lv">URL de la vidéo</Label><Input id="lv" value={form.video_url} onChange={(e) => onChange({ ...form, video_url: e.target.value })} /></div>
        ) : null}
        {form.kind === "reading" ? (
          <div className="space-y-2"><Label htmlFor="lc">Contenu</Label><Textarea id="lc" rows={4} value={form.content} onChange={(e) => onChange({ ...form, content: e.target.value })} /></div>
        ) : null}
        {BRIEF_KINDS.includes(form.kind) ? (
          <div className="space-y-2"><Label htmlFor="lb">Résumé</Label><Textarea id="lb" rows={4} value={form.brief} onChange={(e) => onChange({ ...form, brief: e.target.value })} /></div>
        ) : null}

        {CHAPTERS_ALLOWED_KINDS.includes(form.kind) ? (
          <ChaptersEditor chapters={form.chapters} onChange={(chapters) => onChange({ ...form, chapters })} />
        ) : null}
      </div>
      <DialogFooter>
        <Button variant="accent" disabled={!form.title || isPending} onClick={onSubmit}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          {submitLabel}
        </Button>
      </DialogFooter>
    </>
  );
}

/* ---------- Éditeur de leçon (édition) ---------- */

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
    is_mandatory: lesson.isMandatory,
    chapters: lesson.chapters ?? [],
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
          is_mandatory: draft.is_mandatory,
          video_url: lesson.kind === "video" ? draft.video_url : undefined,
          content: lesson.kind === "reading" ? draft.content : undefined,
          brief: BRIEF_KINDS.includes(lesson.kind) ? draft.brief : undefined,
          chapters: CHAPTERS_ALLOWED_KINDS.includes(lesson.kind) && draft.chapters.length > 0 ? draft.chapters : undefined,
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

      <div className="flex items-center justify-between rounded-lg border p-3">
        <Label className="cursor-pointer">Leçon obligatoire</Label>
        <Switch checked={draft.is_mandatory} onCheckedChange={(v) => setDraft({ ...draft, is_mandatory: v })} />
      </div>

      {lesson.kind === "video" ? (
        <div className="space-y-2"><Label htmlFor="ev">URL vidéo</Label><Input id="ev" value={draft.video_url} onChange={(e) => setDraft({ ...draft, video_url: e.target.value })} /></div>
      ) : null}
      {lesson.kind === "reading" ? (
        <div className="space-y-2"><Label htmlFor="ec">Contenu</Label><Textarea id="ec" rows={6} value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} /></div>
      ) : null}
      {BRIEF_KINDS.includes(lesson.kind) ? (
        <div className="space-y-2"><Label htmlFor="eb">Résumé</Label><Textarea id="eb" rows={5} value={draft.brief} onChange={(e) => setDraft({ ...draft, brief: e.target.value })} /></div>
      ) : null}

      {CHAPTERS_ALLOWED_KINDS.includes(lesson.kind) ? (
        <ChaptersEditor chapters={draft.chapters} onChange={(chapters) => setDraft({ ...draft, chapters })} />
      ) : null}

      <div className="flex justify-end gap-2">
        <Button variant="accent" onClick={save} disabled={updateLesson.isPending}>
          {updateLesson.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          Enregistrer
        </Button>
      </div>
    </div>
  );
}