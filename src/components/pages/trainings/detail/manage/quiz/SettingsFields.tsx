import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { quizModeLabels, type QuizMode } from "@/data/content";
import type { QuizSettingsValues } from "../eval/quiz/Settings";

interface QuizSettingsFieldsProps {
  /** Préfixe des ids HTML (deux formulaires peuvent coexister) */
  idPrefix: string;
  values: QuizSettingsValues;
  onChange: (values: QuizSettingsValues) => void;
}

export function QuizSettingsFields({ idPrefix, values, onChange }: QuizSettingsFieldsProps) {
  const set = <K extends keyof QuizSettingsValues>(key: K, value: QuizSettingsValues[K]) =>
    onChange({ ...values, [key]: value });

  const isTimed = values.mode === "quiz";

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Mode</Label>
          <Select value={values.mode} onValueChange={(v) => set("mode", v as QuizMode)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(quizModeLabels) as QuizMode[]).map((m) => (
                <SelectItem key={m} value={m}>{quizModeLabels[m]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-time`}>
            Limite de temps (sec) {isTimed ? <span className="text-destructive">*</span> : "(optionnel)"}
          </Label>
          <Input
            id={`${idPrefix}-time`}
            type="number"
            min={0}
            value={values.time_limit_sec}
            onChange={(e) => set("time_limit_sec", Number(e.target.value))}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-pass`}>Score de passage (%)</Label>
          <Input
            id={`${idPrefix}-pass`}
            type="number"
            min={0}
            max={100}
            value={values.pass_score}
            onChange={(e) => set("pass_score", Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-attempts`}>Tentatives maximum</Label>
          <Input
            id={`${idPrefix}-attempts`}
            type="number"
            min={1}
            value={values.max_attempts}
            onChange={(e) => set("max_attempts", Number(e.target.value))}
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <Label className="cursor-pointer">Soumission automatique à expiration du temps</Label>
          <p className="text-xs text-muted-foreground">Pertinent seulement en mode "Quiz chronométré".</p>
        </div>
        <Switch
          checked={values.auto_submit_on_timeout}
          onCheckedChange={(v) => set("auto_submit_on_timeout", v)}
          disabled={!isTimed}
        />
      </div>
    </div>
  );
}