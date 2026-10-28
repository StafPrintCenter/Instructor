import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { APIQuizQuestion, QuizQuestionType } from "@/data/content";
import { useCreateQuestion, useUpdateQuestion } from "@/stores/useQuizzesStore";
import { DeleteQuestionConfirm } from "./DeleteQuestionConfirm";
import { QuestionChoicesEditor } from "./QuestionChoicesEditor";
import { QuestionMainFields } from "./QuestionMainFields";
import { hasCorrectChoice, isQuestionValid, keepFirstCorrect, questionFormFromQuestion, toQuestionPayload, type QuestionFormValues } from "./quizQuestionForm";

interface QuestionFormProps {
  quizId: string;
  question: APIQuizQuestion | null;
  nextSortOrder: number;
  onSaved: () => void;
}

export function QuestionForm({ quizId, question, nextSortOrder, onSaved }: QuestionFormProps) {
  const createQuestion = useCreateQuestion();
  const updateQuestion = useUpdateQuestion();

  const [values, setValues] = useState<QuestionFormValues>(() => questionFormFromQuestion(question));
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isPending = createQuestion.isPending || updateQuestion.isPending;

  const changeType = (type: QuizQuestionType) =>
    setValues((v) => ({ ...v, type, choices: type === "single" ? keepFirstCorrect(v.choices) : v.choices }));

  const handleSubmit = () => {
    const payload = toQuestionPayload(values, question ? Number(question.sortOrder) : nextSortOrder);
    const callbacks = (message: string) => ({
      onSuccess: () => {
        toast.success(message);
        onSaved();
      },
      onError: (e: Error) => toast.error(e.message),
    });

    if (question) {
      updateQuestion.mutate({ id: question.id, quizId, payload }, callbacks("Question modifiée."));
    } else {
      createQuestion.mutate({ quizId, payload }, callbacks("Question ajoutée."));
    }
  };

  return (
    <div className="space-y-4">
      <QuestionMainFields
        values={values}
        onPromptChange={(prompt) => setValues((v) => ({ ...v, prompt }))}
        onTypeChange={changeType}
        onPointsChange={(points) => setValues((v) => ({ ...v, points }))}
      />

      <QuestionChoicesEditor
        type={values.type}
        choices={values.choices}
        onChange={(choices) => setValues((v) => ({ ...v, choices }))}
        hasCorrectChoice={hasCorrectChoice(values)}
      />

      <div className="space-y-2">
        <Label htmlFor="qe">Explication (optionnel)</Label>
        <Textarea
          id="qe"
          rows={2}
          value={values.explanation}
          onChange={(e) => setValues((v) => ({ ...v, explanation: e.target.value }))}
        />
      </div>

      <DialogFooter className="flex items-center justify-between sm:justify-between">
        {question ? (
          <Button variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="size-4" /> Supprimer
          </Button>
        ) : (
          <span />
        )}
        <Button variant="accent" disabled={!isQuestionValid(values) || isPending} onClick={handleSubmit}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          {question ? "Enregistrer" : "Ajouter"}
        </Button>
      </DialogFooter>

      <DeleteQuestionConfirm
        quizId={quizId}
        question={confirmDelete ? question : null}
        onClose={() => setConfirmDelete(false)}
        onDeleted={onSaved}
      />
    </div>
  );
}