import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SESSION_MODALITIES, sessionModalityLabels, type SessionModality } from "@/data/sessions";
import { FieldError } from "@/components/pages/sessions/detail";
import type { SessionFieldsProps } from "../form/sessionFormSchema";

export function ModalityFields({ values, errors, setField }: SessionFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label>Modalité</Label>
        <Select value={values.modality} onValueChange={(v) => setField("modality", v as SessionModality)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {SESSION_MODALITIES.map((m) => (
              <SelectItem key={m} value={m}>{sessionModalityLabels[m]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {values.modality === "in_person" ? (
        <div className="space-y-2">
          <Label htmlFor="sf-location">Lieu</Label>
          <Input id="sf-location" value={values.location} onChange={(e) => setField("location", e.target.value)} />
          <FieldError message={errors.location} />
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="sf-url">Lien de la réunion</Label>
          <Input
            id="sf-url"
            type="url"
            placeholder="https://meet.google.com/…"
            value={values.meetingUrl}
            onChange={(e) => setField("meetingUrl", e.target.value)}
          />
          <FieldError message={errors.meetingUrl} />
        </div>
      )}
    </>
  );
}