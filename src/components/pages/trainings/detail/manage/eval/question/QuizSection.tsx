import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { APIQuiz, APIQuizQuestion } from "@/data/content";
import { DeleteQuestionConfirm } from "./DeleteConfirm";
import { QuestionFormDialog } from "./FormDialog";
import { QuestionItem } from "./Item";

/** Liste des questions - consultables immédiatement, modifiables / supprimables au besoin */
export function QuizQuestionsSection({ quiz }: { quiz: APIQuiz }) {
  const questions = quiz.questions ?? [];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<APIQuizQuestion | null>(null);
  const [toDelete, setToDelete] = useState<APIQuizQuestion | null>(null);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (question: APIQuizQuestion) => {
    setEditing(question);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Questions</p>
        <Button variant="outline" size="sm" onClick={openCreate}>
          <Plus className="size-4" /> Ajouter une question
        </Button>
      </div>

      {questions.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground">
          Aucune question pour l'instant. Utilisez le bouton ci-dessus pour en ajouter une.
        </div>
      ) : (
        <div className="space-y-2">
          {questions.map((q, i) => (
            <QuestionItem key={q.id} question={q} index={i} onEdit={() => openEdit(q)} onDelete={() => setToDelete(q)} />
          ))}
        </div>
      )}

      <QuestionFormDialog
        open={dialogOpen}
        onClose={closeDialog}
        quizId={quiz.id}
        question={editing}
        nextSortOrder={questions.length}
      />

      <DeleteQuestionConfirm quizId={quiz.id} question={toDelete} onClose={() => setToDelete(null)} />
    </div>
  );
}