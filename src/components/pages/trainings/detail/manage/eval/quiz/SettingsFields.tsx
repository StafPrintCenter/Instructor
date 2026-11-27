import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { quizModeLabels } from "@/data/content";
import type { QuizSettingsValues } from "./Settings";

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
      <div className={`grid gap-4 ${isTimed ? "sm:grid-cols-2" : ""}`}>
        <div className="space-y-2">
          <Label>Mode</Label>
          <p className="text-sm text-muted-foreground">{quizModeLabels[values.mode]}</p>
        </div>
        {isTimed && (
          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-time`}>
              Limite de temps (sec) <span className="text-destructive">*</span>
            </Label>
            <Input
              id={`${idPrefix}-time`}
              type="number"
              min={10}
              value={values.time_limit_sec}
              onChange={(e) => set("time_limit_sec", Number(e.target.value))}
            />
          </div>
        )}
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
          <Label className="cursor-pointer">
            {isTimed ? "Soumission automatique à expiration du temps" : "Soumission automatique"}
          </Label>
          {!isTimed && <p className="text-xs text-muted-foreground">Aucun compte à rebours en mode exercice.</p>}
        </div>
        <Switch
          checked={values.auto_submit_on_timeout}
          onCheckedChange={(v) => set("auto_submit_on_timeout", v)}
        />
      </div>
    </div>
  );
}