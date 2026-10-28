import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useCreateQuiz } from "@/stores/useQuizzesStore";
import { QuizSettingsFields } from "../../quiz/SettingsFields";
import { emptyQuizSettings, isQuizTimeLimitMissing, toQuizPayload, type QuizSettingsValues } from "./Settings";

interface QuizCreateFormProps {
  lessonId: string;
  onCreated: (quizId: string) => void;
}

export function QuizCreateForm({ lessonId, onCreated }: QuizCreateFormProps) {
  const [values, setValues] = useState<QuizSettingsValues>(emptyQuizSettings);
  const createQuiz = useCreateQuiz();

  const submit = () =>
    createQuiz.mutate(
      { lessonId, payload: toQuizPayload(values) },
      {
        onSuccess: (quiz) => {
          toast.success("Évaluation créée en brouillon. Vous pouvez maintenant ajouter des questions.");
          onCreated(quiz.id);
        },
        onError: (e) => toast.error(e.message),
      }
    );

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Cette leçon n'a pas encore d'évaluation. Configurez-la ci-dessous pour commencer à ajouter des questions.
      </p>

      <QuizSettingsFields idPrefix="qc" values={values} onChange={setValues} />

      <DialogFooter>
        <Button variant="accent" disabled={isQuizTimeLimitMissing(values) || createQuiz.isPending} onClick={submit}>
          {createQuiz.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          Créer l'évaluation
        </Button>
      </DialogFooter>
    </div>
  );
}