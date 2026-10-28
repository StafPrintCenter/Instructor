import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { APIQuiz } from "@/data/content";
import { useUpdateQuiz } from "@/stores/useQuizzesStore";
import { QuizSettingsFields } from "./SettingsFields";
import { isQuizTimeLimitMissing, quizSettingsFromQuiz, toQuizPayload, type QuizSettingsValues } from "./Settings";

/** Réglages pré-remplis avec les valeurs actuelles : à consulter, modifier si souhaité */
export function QuizSettingsCard({ quiz }: { quiz: APIQuiz }) {
  const updateQuiz = useUpdateQuiz();
  const [values, setValues] = useState<QuizSettingsValues>(() => quizSettingsFromQuiz(quiz));

  // Dépendances sur les valeurs des réglages : ajouter une question (qui recharge le quiz) n'écrase pas une saisie en cours
  useEffect(() => {
    setValues(quizSettingsFromQuiz(quiz));
  }, [quiz.id, quiz.mode, quiz.timeLimitSec, quiz.passScore, quiz.maxAttempts, quiz.autoSubmitOnTimeout]);

  const save = () =>
    updateQuiz.mutate(
      { id: quiz.id, payload: toQuizPayload(values) },
      {
        onSuccess: () => toast.success("Réglages enregistrés."),
        onError: (e) => toast.error(e.message),
      }
    );

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <p className="text-sm font-semibold">Réglages</p>

      <QuizSettingsFields idPrefix="qe" values={values} onChange={setValues} />

      <div className="flex justify-end">
        <Button variant="outline" size="sm" disabled={isQuizTimeLimitMissing(values) || updateQuiz.isPending} onClick={save}>
          {updateQuiz.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          Enregistrer les réglages
        </Button>
      </div>
    </div>
  );
}