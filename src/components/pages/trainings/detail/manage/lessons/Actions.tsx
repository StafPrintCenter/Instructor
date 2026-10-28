import { HelpCircle, Pencil, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LessonActionsProps {
  hasQuiz: boolean;
  /** Défini uniquement pour les leçons quiz / exercice */
  onManageQuiz?: () => void;
  onEdit: () => void;
  onSubmit: () => void;
  onDelete: () => void;
}

export function LessonActions({ hasQuiz, onManageQuiz, onEdit, onSubmit, onDelete }: LessonActionsProps) {
  return (
    <>
      {/* Bouton évaluation - toujours visible pour quiz/exercice, texte + icône, qu'un quiz existe déjà ou non */}
      {onManageQuiz ? (
        <Button size="sm" variant={hasQuiz ? "soft" : "outline"} className="shrink-0" onClick={onManageQuiz}>
          <HelpCircle className="size-3.5" />
          {hasQuiz ? "Gérer l'évaluation" : "Créer un quiz"}
        </Button>
      ) : null}

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
    </>
  );
}