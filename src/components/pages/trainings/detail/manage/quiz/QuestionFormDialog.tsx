import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { APIQuizQuestion } from "@/data/content";
import { QuestionForm } from "./QuestionForm";

interface QuestionFormDialogProps {
  open: boolean;
  onClose: () => void;
  quizId: string;
  /** Question à modifier ; null = création */
  question: APIQuizQuestion | null;
  nextSortOrder: number;
}

export function QuestionFormDialog({ open, onClose, quizId, question, nextSortOrder }: QuestionFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display">{question ? "Modifier la question" : "Nouvelle question"}</DialogTitle>
        </DialogHeader>
        <QuestionForm
          key={question?.id ?? "new"}
          quizId={quizId}
          question={question}
          nextSortOrder={nextSortOrder}
          onSaved={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}