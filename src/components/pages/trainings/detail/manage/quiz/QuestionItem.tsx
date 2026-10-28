import { CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { questionTypeLabels, type APIQuizQuestion } from "@/data/content";

interface QuestionItemProps {
  question: APIQuizQuestion;
  /** Position dans la liste (affichée à partir de 1) */
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function QuestionItem({ question: q, index, onEdit, onDelete }: QuestionItemProps) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">#{index + 1}</span>
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
          {q.explanation ? <p className="mt-2 text-xs italic text-muted-foreground">Explication : {q.explanation}</p> : null}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button size="icon" variant="ghost" className="size-7" aria-label="Éditer" onClick={onEdit}>
            <Pencil className="size-3.5" />
          </Button>
          <Button size="icon" variant="ghost" className="size-7" aria-label="Supprimer" onClick={onDelete}>
            <Trash2 className="size-3.5 text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  );
}