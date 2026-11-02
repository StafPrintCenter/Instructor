import { useRef, useState, type ChangeEvent } from "react";
import { Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { COMMUNITY_ATTACHMENT_EXTENSIONS, COMMUNITY_LIMITS } from "@/data/community";
import { formatFileSize } from "@/lib/file-size";

const ATTACHMENTS_ACCEPT = COMMUNITY_ATTACHMENT_EXTENSIONS.map((ext) => `.${ext}`).join(",");

function validateAttachments(current: File[], incoming: File[]) {
  const accepted: File[] = [];
  const errors: string[] = [];

  for (const file of incoming) {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

    if (!COMMUNITY_ATTACHMENT_EXTENSIONS.includes(extension)) {
      errors.push(`« ${file.name} » : format non accepté.`);
      continue;
    }
    if (file.size > COMMUNITY_LIMITS.maxAttachmentBytes) {
      errors.push(`« ${file.name} » dépasse 5 Mo.`);
      continue;
    }
    const all = [...current, ...accepted];
    if (all.some((f) => f.name === file.name && f.size === file.size)) continue;
    if (all.length >= COMMUNITY_LIMITS.maxAttachments) {
      errors.push(`${COMMUNITY_LIMITS.maxAttachments} fichiers maximum : « ${file.name} » ignoré.`);
      continue;
    }
    accepted.push(file);
  }

  return { accepted, errors };
}

interface AttachmentsInputProps {
  files: File[];
  onChange: (files: File[]) => void;
}

export function AttachmentsInput({ files, onChange }: AttachmentsInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const isFull = files.length >= COMMUNITY_LIMITS.maxAttachments;

  const handlePick = (e: ChangeEvent<HTMLInputElement>) => {
    const result = validateAttachments(files, Array.from(e.target.files ?? []));
    onChange([...files, ...result.accepted]);
    setErrors(result.errors);
    e.target.value = ""; // permet de rechoisir le même fichier
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Pièces jointes (optionnel)</Label>
        <span className="text-[11px] text-muted-foreground">
          {files.length}/{COMMUNITY_LIMITS.maxAttachments} · 5 Mo maximum chacune
        </span>
      </div>

      <input ref={inputRef} type="file" multiple accept={ATTACHMENTS_ACCEPT} className="hidden" onChange={handlePick} />
      <Button type="button" variant="outline" size="sm" disabled={isFull} onClick={() => inputRef.current?.click()}>
        <Paperclip className="size-4" /> Ajouter des fichiers
      </Button>

      {files.length > 0 ? (
        <ul className="space-y-1.5">
          {files.map((file) => (
            <li
              key={`${file.name}-${file.size}`}
              className="flex items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-1.5 text-sm"
            >
              <span className="min-w-0 truncate">{file.name}</span>
              <span className="flex shrink-0 items-center gap-2">
                <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                <button
                  type="button"
                  aria-label={`Retirer ${file.name}`}
                  className="rounded-sm p-0.5 text-muted-foreground hover:text-destructive"
                  onClick={() => onChange(files.filter((f) => f !== file))}
                >
                  <X className="size-4" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {errors.map((message) => (
        <p key={message} className="text-xs text-destructive">{message}</p>
      ))}
    </div>
  );
}