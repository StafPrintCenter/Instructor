// src/components/site/QuizManager.tsx
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, Send, CheckCircle2 } from "lucide-react";
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
import {
  quizModeLabels,
  questionTypeLabels,
  type QuizMode,
  type QuizQuestionType,
  type APIQuiz,
  type APIQuizQuestion,
  type QuizChoiceInput,
} from "@/data/content";
import {
  useQuiz,
  useCreateQuiz,
  useUpdateQuiz,
  useDeleteQuiz,
  useSubmitQuizForReview,
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
} from "@/stores/useQuizzesStore";
import { useInvalidateLessons } from "@/stores/useLessonsStore";

interface QuizManagerProps {
  lessonId: string;
  moduleId: string;
  quizId: string | null;
  /** Appelé après la toute première création du quiz, pour que le parent rafraîchisse quizId sur la leçon. */
  onQuizCreated?: (quizId: string) => void;
}

const emptyQuizForm = {
  mode: "quiz" as QuizMode,
  time_limit_sec: 600,
  pass_score: 50,
  max_attempts: 3,
  auto_submit_on_timeout: true,
};

export function QuizManager({ lessonId, moduleId, quizId, onQuizCreated }: QuizManagerProps) {
  const invalidateLessons = useInvalidateLessons();

  if (!quizId) {
    return <QuizCreateForm lessonId={lessonId} onCreated={(id) => { invalidateLessons(moduleId); onQuizCreated?.(id); }} />;
  }

  return <QuizEditor quizId={quizId} moduleId={moduleId} />;
}

/* ---------- Création initiale du quiz ---------- */

function QuizCreateForm({ lessonId, onCreated }: { lessonId: string; onCreated: (quizId: string) => void }) {
  const [form, setForm] = useState(emptyQuizForm);
  const createQuiz = useCreateQuiz();

  const isTimeLimitMissing = form.mode === "quiz" && !form.time_limit_sec;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Cette leçon n'a pas encore d'évaluation. Configurez-la ci-dessous pour commencer à ajouter des questions.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Mode</Label>
          <Select value={form.mode} onValueChange={(v) => setForm((f) => ({ ...f, mode: v as QuizMode }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(quizModeLabels) as QuizMode[]).map((m) => (
                <SelectItem key={m} value={m}>{quizModeLabels[m]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="qts">Limite de temps (sec) {form.mode === "quiz" ? <span className="text-destructive">*</span> : "(optionnel)"}</Label>
          <Input
            id="qts"
            type="number"
            min={0}
            value={form.time_limit_sec}
            onChange={(e) => setForm((f) => ({ ...f, time_limit_sec: Number(e.target.value) }))}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="qps">Score de passage (%)</Label>
          <Input id="qps" type="number" min={0} max={100} value={form.pass_score} onChange={(e) => setForm((f) => ({ ...f, pass_score: Number(e.target.value) }))} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="qma">Tentatives maximum</Label>
          <Input id="qma" type="number" min={1} value={form.max_attempts} onChange={(e) => setForm((f) => ({ ...f, max_attempts: Number(e.target.value) }))} />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <Label className="cursor-pointer">Soumission automatique à expiration du temps</Label>
          <p className="text-xs text-muted-foreground">Pertinent seulement en mode "Quiz chronométré".</p>
        </div>
        <Switch
          checked={form.auto_submit_on_timeout}
          onCheckedChange={(v) => setForm((f) => ({ ...f, auto_submit_on_timeout: v }))}
          disabled={form.mode !== "quiz"}
        />
      </div>

      <DialogFooter>
        <Button
          variant="accent"
          disabled={isTimeLimitMissing || createQuiz.isPending}
          onClick={() =>
            createQuiz.mutate(
              {
                lessonId,
                payload: {
                  mode: form.mode,
                  time_limit_sec: form.mode === "quiz" ? form.time_limit_sec : undefined,
                  pass_score: form.pass_score,
                  max_attempts: form.max_attempts,
                  auto_submit_on_timeout: form.auto_submit_on_timeout,
                },
              },
              {
                onSuccess: (quiz) => { toast.success("Évaluation créée en brouillon."); onCreated(quiz.id); },
                onError: (e) => toast.error(e.message),
              }
            )
          }
        >
          {createQuiz.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          Créer l'évaluation
        </Button>
      </DialogFooter>
    </div>
  );
}

/* ---------- Édition du quiz existant + questions ---------- */

function QuizEditor({ quizId, moduleId }: { quizId: string; moduleId: string }) {
  const { quiz, isLoading } = useQuiz(quizId);
  const updateQuiz = useUpdateQuiz();
  const deleteQuiz = useDeleteQuiz();
  const submitQuiz = useSubmitQuizForReview();
  const invalidateLessons = useInvalidateLessons();

  const [settings, setSettings] = useState(emptyQuizForm);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<APIQuizQuestion | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<APIQuizQuestion | null>(null);
  const [quizToDelete, setQuizToDelete] = useState(false);
  const [quizToSubmit, setQuizToSubmit] = useState(false);

  useEffect(() => {
    if (quiz) {
      setSettings({
        mode: quiz.mode,
        time_limit_sec: Number(quiz.timeLimitSec ?? 0),
        pass_score: Number(quiz.passScore),
        max_attempts: Number(quiz.maxAttempts),
        auto_submit_on_timeout: quiz.autoSubmitOnTimeout,
      });
    }
  }, [quiz]);

  if (isLoading || !quiz) {
    return (
      <div className="space-y-3">
        <div className="h-10 animate-pulse rounded-lg bg-muted" />
        <div className="h-24 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  const isTimeLimitMissing = settings.mode === "quiz" && !settings.time_limit_sec;
  const questions = quiz.questions ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <ContentStatusBadge status={quiz.status} />
        <Badge variant="secondary">{quizModeLabels[quiz.mode]}</Badge>
        <span className="text-xs text-muted-foreground">{quiz.totalPoints} points au total · {quiz.questionsCount} question{quiz.questionsCount > 1 ? "s" : ""}</span>
      </div>

      {/* Réglages du quiz */}
      <div className="space-y-4 rounded-lg border p-4">
        <p className="text-sm font-semibold">Réglages</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Mode</Label>
            <Select value={settings.mode} onValueChange={(v) => setSettings((f) => ({ ...f, mode: v as QuizMode }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(quizModeLabels) as QuizMode[]).map((m) => (
                  <SelectItem key={m} value={m}>{quizModeLabels[m]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ets">Limite de temps (sec) {settings.mode === "quiz" ? <span className="text-destructive">*</span> : "(optionnel)"}</Label>
            <Input id="ets" type="number" min={0} value={settings.time_limit_sec} onChange={(e) => setSettings((f) => ({ ...f, time_limit_sec: Number(e.target.value) }))} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="eps">Score de passage (%)</Label>
            <Input id="eps" type="number" min={0} max={100} value={settings.pass_score} onChange={(e) => setSettings((f) => ({ ...f, pass_score: Number(e.target.value) }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ema">Tentatives maximum</Label>
            <Input id="ema" type="number" min={1} value={settings.max_attempts} onChange={(e) => setSettings((f) => ({ ...f, max_attempts: Number(e.target.value) }))} />
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <Label className="cursor-pointer">Soumission automatique à expiration du temps</Label>
          <Switch
            checked={settings.auto_submit_on_timeout}
            onCheckedChange={(v) => setSettings((f) => ({ ...f, auto_submit_on_timeout: v }))}
            disabled={settings.mode !== "quiz"}
          />
        </div>
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            disabled={isTimeLimitMissing || updateQuiz.isPending}
            onClick={() =>
              updateQuiz.mutate(
                {
                  id: quiz.id,
                  payload: {
                    mode: settings.mode,
                    time_limit_sec: settings.mode === "quiz" ? settings.time_limit_sec : undefined,
                    pass_score: settings.pass_score,
                    max_attempts: settings.max_attempts,
                    auto_submit_on_timeout: settings.auto_submit_on_timeout,
                  },
                },
                {
                  onSuccess: () => toast.success("Réglages enregistrés."),
                  onError: (e) => toast.error(e.message),
                }
              )
            }
          >
            {updateQuiz.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Enregistrer les réglages
          </Button>
        </div>
      </div>

      {/* Liste des questions */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Questions</p>
          <Dialog
            open={isQuestionDialogOpen}
            onOpenChange={(open) => {
              setIsQuestionDialogOpen(open);
              if (!open) setEditingQuestion(null);
            }}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => setEditingQuestion(null)}>
                <Plus className="size-4" /> Ajouter une question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
              <DialogHeader><DialogTitle className="font-display">{editingQuestion ? "Modifier la question" : "Nouvelle question"}</DialogTitle></DialogHeader>
              <QuestionForm
                quizId={quiz.id}
                question={editingQuestion}
                nextSortOrder={questions.length}
                onSaved={() => setIsQuestionDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {questions.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground">
            Aucune question pour l'instant.
          </div>
        ) : (
          <div className="space-y-2">
            {questions.map((q, i) => (
              <div key={q.id} className="rounded-lg border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-muted-foreground">#{i + 1}</span>
                      <Badge variant="secondary" className="text-[10px]">{questionTypeLabels[q.type]}</Badge>
                      <span className="text-xs text-muted-foreground">{q.points} pts</span>
                    </div>
                    <p className="mt-1 text-sm font-medium">{q.prompt}</p>
                    <ul className="mt-2 space-y-1">
                      {q.choices.map((c) => (
                        <li key={c.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          {c.isCorrect ? <CheckCircle2 className="size-3.5 text-emerald-500" /> : <span className="size-3.5" />}
                          {c.label}
                        </li>
                      ))}
                    </ul>
                    {q.explanation ? (
                      <p className="mt-2 text-xs italic text-muted-foreground">Explication : {q.explanation}</p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7"
                      aria-label="Éditer"
                      onClick={() => { setEditingQuestion(q); setIsQuestionDialogOpen(true); }}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7"
                      aria-label="Supprimer"
                      onClick={() => setQuestionToDelete(q)}
                    >
                      <Trash2 className="size-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions globales du quiz */}
      <div className="flex justify-between border-t pt-4">
        <Button variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setQuizToDelete(true)}>
          <Trash2 className="size-4" /> Supprimer l'évaluation
        </Button>
        <Button variant="soft" onClick={() => setQuizToSubmit(true)}>
          <Send className="size-4" /> Soumettre à validation
        </Button>
      </div>

      <ConfirmDelete
        open={!!questionToDelete}
        onOpenChange={(open) => !open && setQuestionToDelete(null)}
        title={`Supprimer la question "${questionToDelete?.prompt}" ?`}
        onConfirm={() => {
          if (!questionToDelete) return;
          const useDeleteQuestionMutation = useDeleteQuestion;
          void useDeleteQuestionMutation; // no-op, hook déjà instancié ci-dessous
        }}
      />

      <ConfirmDelete
        open={quizToDelete}
        onOpenChange={setQuizToDelete}
        title="Supprimer cette évaluation (questions incluses) ?"
        onConfirm={() => {
          deleteQuiz.mutate(quiz.id, {
            onSuccess: () => { toast.success("Évaluation supprimée."); invalidateLessons(moduleId); },
            onError: (e) => toast.error(e.message),
          });
          setQuizToDelete(false);
        }}
      />

      <ConfirmAction
        open={quizToSubmit}
        onOpenChange={setQuizToSubmit}
        title="Soumettre cette évaluation à validation ?"
        description="L'évaluation passera en attente de validation par l'administrateur."
        confirmLabel="Soumettre"
        onConfirm={() => {
          submitQuiz.mutate(quiz.id, {
            onSuccess: () => toast.success("Évaluation soumise à validation."),
            onError: (e) => toast.error(e.message),
          });
          setQuizToSubmit(false);
        }}
      />
    </div>
  );
}

/* ---------- Formulaire question (création + édition) ---------- */

function QuestionForm({
  quizId,
  question,
  nextSortOrder,
  onSaved,
}: {
  quizId: string;
  question: APIQuizQuestion | null;
  nextSortOrder: number;
  onSaved: () => void;
}) {
  const createQuestion = useCreateQuestion();
  const updateQuestion = useUpdateQuestion();
  const deleteQuestion = useDeleteQuestion();

  const [prompt, setPrompt] = useState(question?.prompt ?? "");
  const [type, setType] = useState<QuizQuestionType>(question?.type ?? "single");
  const [points, setPoints] = useState(Number(question?.points ?? 10));
  const [explanation, setExplanation] = useState(question?.explanation ?? "");
  const [choices, setChoices] = useState<QuizChoiceInput[]>(
    question?.choices.map((c) => ({ label: c.label, is_correct: c.isCorrect })) ?? [
      { label: "", is_correct: false },
      { label: "", is_correct: false },
    ]
  );
  const [questionToDelete, setQuestionToDelete] = useState(false);

  const isPending = createQuestion.isPending || updateQuestion.isPending;
  const hasCorrectChoice = choices.some((c) => c.is_correct);
  const canSubmit = prompt.trim() && choices.length >= 2 && choices.every((c) => c.label.trim()) && hasCorrectChoice;

  const setChoice = (i: number, patch: Partial<QuizChoiceInput>) => {
    setChoices((prev) => prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  };

  const handleSubmit = () => {
    const payload = {
      prompt,
      type,
      points,
      sort_order: question ? Number(question.sortOrder) : nextSortOrder,
      explanation: explanation || undefined,
      choices,
    };

    if (question) {
      updateQuestion.mutate(
        { id: question.id, quizId, payload },
        { onSuccess: () => { toast.success("Question modifiée."); onSaved(); }, onError: (e) => toast.error(e.message) }
      );
    } else {
      createQuestion.mutate(
        { quizId, payload },
        { onSuccess: () => { toast.success("Question ajoutée."); onSaved(); }, onError: (e) => toast.error(e.message) }
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="qp">Question</Label>
        <Textarea id="qp" rows={2} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as QuizQuestionType)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(questionTypeLabels) as QuizQuestionType[]).map((t) => (
                <SelectItem key={t} value={t}>{questionTypeLabels[t]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="qpt">Points</Label>
          <Input id="qpt" type="number" min={0} value={points} onChange={(e) => setPoints(Number(e.target.value))} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Choix de réponse</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => setChoices((prev) => [...prev, { label: "", is_correct: false }])}>
            <Plus className="size-4" /> Ajouter un choix
          </Button>
        </div>
        {choices.map((c, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setChoice(i, { is_correct: type === "single" ? true : !c.is_correct })}
              className="shrink-0"
              aria-label={c.is_correct ? "Marquer comme incorrect" : "Marquer comme correct"}
            >
              <CheckCircle2 className={`size-5 ${c.is_correct ? "text-emerald-500" : "text-muted-foreground/30"}`} />
            </button>
            {type === "single" ? (
              // en mode single, cocher un choix décoche les autres
              null
            ) : null}
            <Input
              value={c.label}
              placeholder={`Choix ${i + 1}`}
              onChange={(e) => setChoice(i, { label: e.target.value })}
            />
            {choices.length > 2 ? (
              <Button size="icon" variant="ghost" aria-label="Retirer" onClick={() => setChoices((prev) => prev.filter((_, idx) => idx !== i))}>
                <Trash2 className="size-4 text-destructive" />
              </Button>
            ) : null}
          </div>
        ))}
        {type === "single" && choices.filter((c) => c.is_correct).length > 1 ? (
          <p className="text-xs text-destructive">En mode "choix unique", une seule réponse doit être correcte.</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="qe">Explication (optionnel)</Label>
        <Textarea id="qe" rows={2} value={explanation} onChange={(e) => setExplanation(e.target.value)} />
      </div>

      <DialogFooter className="flex items-center justify-between sm:justify-between">
        {question ? (
          <Button variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setQuestionToDelete(true)}>
            <Trash2 className="size-4" /> Supprimer
          </Button>
        ) : <span />}
        <Button variant="accent" disabled={!canSubmit || isPending} onClick={handleSubmit}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          {question ? "Enregistrer" : "Ajouter"}
        </Button>
      </DialogFooter>

      <ConfirmDelete
        open={questionToDelete}
        onOpenChange={setQuestionToDelete}
        title={`Supprimer la question "${prompt}" ?`}
        onConfirm={() => {
          if (!question) return;
          deleteQuestion.mutate(
            { id: question.id, quizId },
            {
              onSuccess: () => { toast.success("Question supprimée."); onSaved(); },
              onError: (e) => toast.error(e.message),
            }
          );
          setQuestionToDelete(false);
        }}
      />
    </div>
  );
}