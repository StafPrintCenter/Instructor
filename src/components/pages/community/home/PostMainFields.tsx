import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { COMMUNITY_LIMITS } from "@/data/community";
import { FieldError, PostFieldsProps } from "./";

export function PostMainFields({ values, errors, setField }: PostFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="post-title">Titre</Label>
          <span className="text-[11px] text-muted-foreground">
            {values.title.length}/{COMMUNITY_LIMITS.titleMax}
          </span>
        </div>
        <Input id="post-title" value={values.title} onChange={(e) => setField("title", e.target.value)} />
        <FieldError message={errors.title} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="post-body">Contenu</Label>
          <span className="text-[11px] text-muted-foreground">
            {values.body.length.toLocaleString("fr-FR")}/{COMMUNITY_LIMITS.bodyMax.toLocaleString("fr-FR")}
          </span>
        </div>
        <Textarea id="post-body" rows={8} value={values.body} onChange={(e) => setField("body", e.target.value)} />
        <FieldError message={errors.body} />
      </div>
    </>
  );
}