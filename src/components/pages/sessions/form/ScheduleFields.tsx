import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { minSessionStartInputValue } from "@/lib/session-time";
import { FieldError } from "@/components/pages/sessions/detail";
import type { SessionFieldsProps } from "./sessionFormSchema";

export function ScheduleFields({ values, errors, setField, isEdit }: SessionFieldsProps & { isEdit: boolean }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="sf-start">Début</Label>
        <Input
          id="sf-start"
          type="datetime-local"
          min={isEdit ? undefined : minSessionStartInputValue()}
          value={values.startsAt}
          onChange={(e) => setField("startsAt", e.target.value)}
        />
        <p className="text-[11px] text-muted-foreground">
          Heure de Porto-Novo (UTC+1){isEdit ? "" : " · au moins 3 jours à l'avance"}
        </p>
        <FieldError message={errors.startsAt} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sf-duration">Durée (minutes)</Label>
        <Input
          id="sf-duration"
          type="number"
          min={15}
          max={720}
          step={5}
          value={values.durationMinutes}
          onChange={(e) => setField("durationMinutes", e.target.value)}
        />
        <FieldError message={errors.durationMinutes} />
      </div>
    </div>
  );
}