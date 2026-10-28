import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { questionTypeLabels, type QuizQuestionType } from "@/data/content";
import type { QuestionFormValues } from "../../quiz/quizQuestionForm";

interface QuestionMainFieldsProps {
  values: QuestionFormValues;
  onPromptChange: (prompt: string) => void;
  onTypeChange: (type: QuizQuestionType) => void;
  onPointsChange: (points: number) => void;
}

export function QuestionMainFields({ values, onPromptChange, onTypeChange, onPointsChange }: QuestionMainFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="qp">Question</Label>
        <Textarea id="qp" rows={2} value={values.prompt} onChange={(e) => onPromptChange(e.target.value)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={values.type} onValueChange={(v) => onTypeChange(v as QuizQuestionType)}>
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
          <Input
            id="qpt"
            type="number"
            min={0}
            value={values.points}
            onChange={(e) => onPointsChange(Number(e.target.value))}
          />
        </div>
      </div>
    </>
  );
}