import { useState } from "react";
import { ArrowDown, ArrowUp, Eye, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { reorder, type QuizConfig, type QuizQuestion } from "@/lib/api";

export function QuizBuilder({
  value,
  onChange,
  isExercise = false,
}: {
  value: QuizConfig;
  onChange: (config: QuizConfig) => void;
  isExercise?: boolean;
}) {
  const [preview, setPreview] = useState(false);
  const set = (patch: Partial<QuizConfig>) => onChange({ ...value, ...patch });

  const setQuestions = (questions: QuizQuestion[]) =>
    set({ questions: questions.map((q, i) => ({ ...q, position: i + 1 })) });

  const addQuestion = () =>
    setQuestions([
      ...value.questions,
      {
        id: `qst_${Date.now()}`,
        prompt: "Nouvelle question",
        kind: "single",
        points: 10,
        position: value.questions.length + 1,
        options: [
          { id: `opt_${Date.now()}a`, label: "Réponse A", is_correct: true },
          { id: `opt_${Date.now()}b`, label: "Réponse B", is_correct: false },
        ],
      },
    ]);

  return (
    <div className="space-y-4 rounded-xl border border-border bg-secondary/40 p-4">
      <div className="flex items-center justify-between">
        <p className="font-display text-lg">{isExercise ? "Exercice" : "Quiz"}</p>
        <Button size="sm" variant="ghost" onClick={() => setPreview((p) => !p)}><Eye className="size-4" /> Vue apprenant</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {!isExercise ? (
          <div className="space-y-2">
            <Label htmlFor="tl">Limite de temps (min)</Label>
            <Input id="tl" type="number" value={value.time_limit_minutes ?? 0} onChange={(e) => set({ time_limit_minutes: Number(e.target.value) || null })} />
          </div>
        ) : (
          <div className="flex items-center gap-2 pt-6">
            <Switch id="mg" checked={value.manual_grading} onCheckedChange={(v) => set({ manual_grading: v })} />
            <Label htmlFor="mg">Correction manuelle</Label>
          </div>
        )}
        <div className="space-y-2"><Label htmlFor="pt">Seuil de réussite (%)</Label><Input id="pt" type="number" value={value.pass_threshold} onChange={(e) => set({ pass_threshold: Number(e.target.value) })} /></div>
        <div className="space-y-2"><Label htmlFor="ma">Tentatives autorisées</Label><Input id="ma" type="number" value={value.max_attempts} onChange={(e) => set({ max_attempts: Number(e.target.value) })} /></div>
      </div>

      {preview ? (
        <Card className="border-dashed">
          <CardContent className="space-y-4 p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Aperçu apprenant</p>
            {value.questions.map((q, i) => (
              <div key={q.id} className="space-y-2">
                <p className="text-sm font-medium">{i + 1}. {q.prompt} <Badge variant="outline">{q.points} pts</Badge></p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {q.options.map((o) => (<li key={o.id} className="rounded-md border border-border px-3 py-1.5">{o.label}</li>))}
                </ul>
              </div>
            ))}
            {value.questions.length === 0 ? <p className="text-sm text-muted-foreground">Aucune question pour le moment.</p> : null}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {value.questions.map((q, index) => (
            <Card key={q.id} className="border-border/70">
              <CardContent className="space-y-3 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Input value={q.prompt} onChange={(e) => { const qs = [...value.questions]; qs[index] = { ...q, prompt: e.target.value }; setQuestions(qs); }} className="flex-1 min-w-48" />
                  <Select value={q.kind} onValueChange={(v) => { const qs = [...value.questions]; qs[index] = { ...q, kind: v as QuizQuestion["kind"] }; setQuestions(qs); }}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Choix unique</SelectItem>
                      <SelectItem value="multiple">Choix multiples</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="number" value={q.points} className="w-20" aria-label="Points" onChange={(e) => { const qs = [...value.questions]; qs[index] = { ...q, points: Number(e.target.value) }; setQuestions(qs); }} />
                  <Button size="icon" variant="ghost" aria-label="Monter" onClick={() => index > 0 && setQuestions(reorder(value.questions, index, index - 1))}><ArrowUp className="size-4" /></Button>
                  <Button size="icon" variant="ghost" aria-label="Descendre" onClick={() => index < value.questions.length - 1 && setQuestions(reorder(value.questions, index, index + 1))}><ArrowDown className="size-4" /></Button>
                  <Button size="icon" variant="ghost" aria-label="Supprimer la question" onClick={() => setQuestions(value.questions.filter((x) => x.id !== q.id))}><Trash2 className="size-4 text-destructive" /></Button>
                </div>
                <div className="space-y-2 pl-1">
                  {q.options.map((o, oi) => (
                    <div key={o.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={o.is_correct}
                        aria-label="Bonne réponse"
                        onCheckedChange={(checked) => {
                          const qs = [...value.questions];
                          const options = q.options.map((x, xi) =>
                            q.kind === "single"
                              ? { ...x, is_correct: xi === oi ? !!checked : false }
                              : xi === oi ? { ...x, is_correct: !!checked } : x,
                          );
                          qs[index] = { ...q, options };
                          setQuestions(qs);
                        }}
                      />
                      <Input value={o.label} onChange={(e) => { const qs = [...value.questions]; const options = [...q.options]; options[oi] = { ...o, label: e.target.value }; qs[index] = { ...q, options }; setQuestions(qs); }} />
                      <Button size="icon" variant="ghost" aria-label="Supprimer la réponse" onClick={() => { const qs = [...value.questions]; qs[index] = { ...q, options: q.options.filter((x) => x.id !== o.id) }; setQuestions(qs); }}><Trash2 className="size-4" /></Button>
                    </div>
                  ))}
                  <Button size="sm" variant="ghost" onClick={() => { const qs = [...value.questions]; qs[index] = { ...q, options: [...q.options, { id: `opt_${Date.now()}`, label: "Nouvelle réponse", is_correct: false }] }; setQuestions(qs); }}><Plus className="size-4" /> Ajouter une réponse</Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="soft" size="sm" onClick={addQuestion}><Plus className="size-4" /> Ajouter une question</Button>
        </div>
      )}
    </div>
  );
}
