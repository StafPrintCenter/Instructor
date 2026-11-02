import { useState, type KeyboardEvent } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { COMMUNITY_COMMENT_LIMITS } from "@/data/community-comments";
import { cn } from "@/lib/utils";

interface CommentEditorProps {
  initialBody?: string;
  placeholder?: string;
  submitLabel: string;
  isPending: boolean;
  autoFocus?: boolean;
  rows?: number;
  /** Reçoit le texte nettoyé (espaces de début et de fin retirés) */
  onSubmit: (body: string) => void;
  onCancel?: () => void;
}

/** Zone de saisie commune : nouveau commentaire, réponse et modification. Ctrl/Cmd + Entrée envoie. */
export function CommentEditor({
  initialBody = "",
  placeholder,
  submitLabel,
  isPending,
  autoFocus,
  rows = 3,
  onSubmit,
  onCancel,
}: CommentEditorProps) {
  const [body, setBody] = useState(initialBody);
  const trimmed = body.trim();
  const tooLong = body.length > COMMUNITY_COMMENT_LIMITS.bodyMax;
  const canSubmit = trimmed.length >= COMMUNITY_COMMENT_LIMITS.bodyMin && !tooLong && !isPending;

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && canSubmit) {
      e.preventDefault();
      onSubmit(trimmed);
    }
  };

  return (
    <div className="space-y-2">
      <Textarea
        rows={rows}
        value={body}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="flex items-center justify-between gap-3">
        <span className={cn("text-[11px]", tooLong ? "text-destructive" : "text-muted-foreground")}>
          {body.length.toLocaleString("fr-FR")}/{COMMUNITY_COMMENT_LIMITS.bodyMax.toLocaleString("fr-FR")}
        </span>
        <div className="flex gap-2">
          {onCancel ? (
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              Annuler
            </Button>
          ) : null}
          <Button type="button" variant="accent" size="sm" disabled={!canSubmit} onClick={() => onSubmit(trimmed)}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}