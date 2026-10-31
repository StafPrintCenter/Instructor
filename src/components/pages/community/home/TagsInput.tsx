import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COMMUNITY_LIMITS } from "@/data/community";
import { FieldError } from "./FieldError";

interface TagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  error?: string;
  /** Note affichée sous le champ (ex. limite en édition) */
  note?: string;
}

export function TagsInput({ tags, onChange, error, note }: TagsInputProps) {
  const [draft, setDraft] = useState("");
  const isFull = tags.length >= COMMUNITY_LIMITS.maxTags;

  const addTag = (raw: string) => {
    const tag = raw.replace(/,/g, " ").trim();
    setDraft("");
    if (!tag || isFull) return;
    if (tags.some((t) => t.toLowerCase() === tag.toLowerCase())) return;
    onChange([...tags, tag]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(draft);
    } else if (e.key === "Backspace" && draft === "" && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="post-tags">Tags (optionnel)</Label>
        <span className="text-[11px] text-muted-foreground">
          {tags.length}/{COMMUNITY_LIMITS.maxTags}
        </span>
      </div>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1 pr-1 text-xs font-normal">
              #{tag}
              <button
                type="button"
                aria-label={`Retirer le tag ${tag}`}
                className="rounded-sm p-0.5 hover:bg-background/60"
                onClick={() => onChange(tags.filter((t) => t !== tag))}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : null}

      <Input
        id="post-tags"
        value={draft}
        disabled={isFull}
        placeholder={isFull ? "Nombre maximum de tags atteint" : "Saisissez un tag puis appuyez sur Entrée"}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addTag(draft)}
      />
      <FieldError message={error} />
      {note ? <p className="text-[11px] text-muted-foreground">{note}</p> : null}
    </div>
  );
}