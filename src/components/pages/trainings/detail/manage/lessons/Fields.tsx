import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { lessonKindLabels, type LessonKind } from "@/data/content";
import { ChaptersEditor } from "./ChaptersEditor";
import { BRIEF_KINDS, CHAPTERS_ALLOWED_KINDS, QUIZ_ALLOWED_KINDS, type LessonFormValues } from "./Config";

interface LessonFieldsProps {
  /** Création : le type est choisi ici ; édition : il est fixe */
  mode: "create" | "edit";
  idPrefix: string;
  values: LessonFormValues;
  onChange: (values: LessonFormValues) => void;
}

export function LessonFields({ mode, idPrefix, values, onChange }: LessonFieldsProps) {
  const set = <K extends keyof LessonFormValues>(key: K, value: LessonFormValues[K]) =>
    onChange({ ...values, [key]: value });

  const isCreate = mode === "create";

  const durationField = (
    <div className="space-y-2">
      <Label htmlFor={`${idPrefix}-duration`}>Durée (min)</Label>
      <Input
        id={`${idPrefix}-duration`}
        type="number"
        value={values.duration_minutes}
        onChange={(e) => set("duration_minutes", Number(e.target.value))}
      />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-title`}>Titre</Label>
        <Input id={`${idPrefix}-title`} value={values.title} onChange={(e) => set("title", e.target.value)} />
      </div>

      {isCreate ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={values.kind} onValueChange={(v) => set("kind", v as LessonKind)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(lessonKindLabels) as LessonKind[]).map((k) => (
                  <SelectItem key={k} value={k}>{lessonKindLabels[k]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {durationField}
        </div>
      ) : (
        durationField
      )}

      <div className="flex items-center justify-between rounded-lg border p-3">
        <Label className="cursor-pointer">Leçon obligatoire</Label>
        <Switch checked={values.is_mandatory} onCheckedChange={(v) => set("is_mandatory", v)} />
      </div>

      {values.kind === "video" ? (
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-video`}>URL de la vidéo</Label>
          <Input id={`${idPrefix}-video`} value={values.video_url} onChange={(e) => set("video_url", e.target.value)} />
        </div>
      ) : null}

      {values.kind === "reading" ? (
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-content`}>Contenu</Label>
          <Textarea
            id={`${idPrefix}-content`}
            rows={5}
            value={values.content}
            onChange={(e) => set("content", e.target.value)}
          />
        </div>
      ) : null}

      {BRIEF_KINDS.includes(values.kind) ? (
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-brief`}>Résumé</Label>
          <Textarea
            id={`${idPrefix}-brief`}
            rows={4}
            value={values.brief}
            onChange={(e) => set("brief", e.target.value)}
          />
        </div>
      ) : null}

      {CHAPTERS_ALLOWED_KINDS.includes(values.kind) ? (
        <ChaptersEditor chapters={values.chapters} onChange={(chapters) => set("chapters", chapters)} />
      ) : null}

      {isCreate && QUIZ_ALLOWED_KINDS.includes(values.kind) ? (
        <p className="rounded-lg border border-dashed p-3 text-xs text-muted-foreground">
          Une fois la leçon créée, un bouton <span className="font-medium text-foreground">"Créer un quiz"</span> apparaîtra
          dessus pour configurer l'évaluation et ses questions.
        </p>
      ) : null}
    </div>
  );
}