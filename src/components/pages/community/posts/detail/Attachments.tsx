import { useState } from "react";
import { Download, FileText } from "lucide-react";
import type { APICommunityAttachment } from "@/data/community";
import { formatFileSize } from "@/lib/file-size";
import { FilePreviewModal } from "@/components/site/FilePreviewModal";
import { resolveStorageUrl } from "@/lib/api/file";

export function PostAttachments({ attachments }: { attachments: APICommunityAttachment[] }) {
  const [previewFile, setPreviewFile] = useState<{
    url: string;
    title: string;
    mimeType: string;
  } | null>(null);

  if (attachments.length === 0) return null;

  const images = attachments.filter((a) => a.mime.startsWith("image/"));
  const files = attachments.filter((a) => !a.mime.startsWith("image/"));

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Pièces jointes ({attachments.length})
      </p>

      {images.length > 0 ? (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {images.map((a) => (
            <li key={a.url}>
              <button
                type="button"
                onClick={() => {
                  const url = resolveStorageUrl(a.url);
                  if (url) setPreviewFile({ url, title: a.name, mimeType: a.mime });
                }}
                aria-label={`Aperçu de ${a.name}`}
                className="block w-full overflow-hidden rounded-lg border border-border/60"
              >
                <img
                  src={resolveStorageUrl(a.url) ?? undefined}
                  alt={a.name}
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {files.length > 0 ? (
        <ul className="space-y-2">
          {files.map((a) => (
            <li key={a.url}>
              <button
                type="button"
                onClick={() => {
                  const url = resolveStorageUrl(a.url);
                  if (url) setPreviewFile({ url, title: a.name, mimeType: a.mime });
                }}
                aria-label={`Aperçu de ${a.name}`}
                className="flex w-full items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{a.name}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                  {formatFileSize(a.size)} <Download className="size-3.5" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <FilePreviewModal
        url={previewFile?.url ?? null}
        title={previewFile?.title ?? ""}
        mimeType={previewFile?.mimeType}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
}