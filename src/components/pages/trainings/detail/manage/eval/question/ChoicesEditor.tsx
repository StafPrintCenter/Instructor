import { CheckCircle2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { QuizChoiceInput, QuizQuestionType } from "@/data/content";
import { toggleCorrectChoice } from "../../quiz/quizQuestionForm";

const MIN_CHOICES = 2;

interface QuestionChoicesEditorProps {
  type: QuizQuestionType;
  choices: QuizChoiceInput[];
  onChange: (choices: QuizChoiceInput[]) => void;
  hasCorrectChoice: boolean;
}

export function QuestionChoicesEditor({ type, choices, onChange, hasCorrectChoice }: QuestionChoicesEditorProps) {
  const setLabel = (index: number, label: string) =>
    onChange(choices.map((c, i) => (i === index ? { ...c, label } : c)));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Choix de réponse</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...choices, { label: "", is_correct: false }])}
        >
          <Plus className="size-4" /> Ajouter un choix
        </Button>
      </div>

      {choices.map((c, i) => (
        <div key={i} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange(toggleCorrectChoice(choices, i, type))}
            className="shrink-0"
            aria-label={c.is_correct ? "Marquer comme incorrect" : "Marquer comme correct"}
          >
            <CheckCircle2 className={`size-5 ${c.is_correct ? "text-emerald-500" : "text-muted-foreground/30"}`} />
          </button>
          <Input value={c.label} placeholder={`Choix ${i + 1}`} onChange={(e) => setLabel(i, e.target.value)} />
          {choices.length > MIN_CHOICES ? (
            <Button
              size="icon"
              variant="ghost"
              aria-label="Retirer"
              onClick={() => onChange(choices.filter((_, idx) => idx !== i))}
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          ) : null}
        </div>
      ))}

      {!hasCorrectChoice ? <p className="text-xs text-destructive">Sélectionnez au moins une réponse correcte.</p> : null}
    </div>
  );
}