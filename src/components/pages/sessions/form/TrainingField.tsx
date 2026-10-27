import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInstructorTrainingsList } from "@/stores/useTrainingsStore";
import { FieldError } from "@/components/pages/sessions/detail";
import type { SessionFieldsProps } from "./sessionFormSchema";

export function TrainingField({ values, errors, setField }: SessionFieldsProps) {
  const { items: trainings } = useInstructorTrainingsList({ perPage: 100 });

  return (
    <div className="space-y-2">
      <Label>Formation</Label>
      <Select value={values.trainingId} onValueChange={(v) => setField("trainingId", v)}>
        <SelectTrigger><SelectValue placeholder="Choisir une formation" /></SelectTrigger>
        <SelectContent>
          {trainings.map((t) => (
            <SelectItem key={t.trainingId} value={t.trainingId}>{t.trainingTitle}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError message={errors.trainingId} />
    </div>
  );
}