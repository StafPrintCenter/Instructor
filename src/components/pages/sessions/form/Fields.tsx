import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/pages/sessions/detail";
import { ModalityFields, ScheduleFields, TrainingField, SessionFieldsProps } from "./";

interface SessionFormFieldsProps extends SessionFieldsProps {
  isEdit: boolean;
  trainingId?: string;
}

export function SessionFormFields({ isEdit, trainingId, ...fields }: SessionFormFieldsProps) {
  const { values, errors, setField } = fields;

  return (
    <div className="space-y-4">
      {!isEdit && !trainingId ? <TrainingField {...fields} /> : null}

      <div className="space-y-2">
        <Label htmlFor="sf-title">Titre</Label>
        <Input id="sf-title" value={values.title} onChange={(e) => setField("title", e.target.value)} />
        <FieldError message={errors.title} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sf-desc">Description (optionnel)</Label>
        <Textarea
          id="sf-desc"
          rows={3}
          value={values.description}
          onChange={(e) => setField("description", e.target.value)}
        />
        <FieldError message={errors.description} />
      </div>

      <ScheduleFields {...fields} isEdit={isEdit} />
      <ModalityFields {...fields} />
    </div>
  );
}