import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ModuleFormValues } from "./Form";

interface ModuleFieldsProps {
  idPrefix: string;
  values: ModuleFormValues;
  onChange: (values: ModuleFormValues) => void;
}

export function ModuleFields({ idPrefix, values, onChange }: ModuleFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-title`}>Titre</Label>
        <Input
          id={`${idPrefix}-title`}
          value={values.title}
          onChange={(e) => onChange({ ...values, title: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-description`}>Description</Label>
        <Textarea
          id={`${idPrefix}-description`}
          value={values.description}
          onChange={(e) => onChange({ ...values, description: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-order`}>Ordre</Label>
        <Input
          id={`${idPrefix}-order`}
          type="number"
          min={0}
          value={values.sort_order}
          onChange={(e) => onChange({ ...values, sort_order: Number(e.target.value) })}
        />
      </div>
    </div>
  );
}