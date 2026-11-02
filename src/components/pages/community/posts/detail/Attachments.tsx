import { Download, FileText } from "lucide-react";
import type { APICommunityAttachment } from "@/data/community";
import { formatFileSize } from "@/lib/file-size";

export function PostAttachments({ attachments }: { attachments: APICommunityAttachment[] }) {
  if (attachments.length === 0) return null;

  const images = attachments.filter((a) => a.mime.startsWith("image/"));
  const files = attachments.filter((a) => !a.mime.startsWith("image/"));

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Pièces jointes ({attachments.length})
      </p>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {images.map((a) => (
            <a
              key={a.url}
              href={a.url}
              target="_blank"
              rel="noreferrer"
              className="block overflow-hidden rounded-lg border border-border/60"
            >
              <img src={a.url} alt={a.name} loading="lazy" className="aspect-square w-full object-cover" />
            </a>
          ))}
        </div>
      ) : null}

      {files.length > 0 ? (
        <ul className="space-y-2">
          {files.map((a) => (
            <li key={a.url}>
              <a
                href={a.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2 text-sm transition-colors hover:bg-muted/40"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{a.name}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                  {formatFileSize(a.size)} <Download className="size-3.5" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}