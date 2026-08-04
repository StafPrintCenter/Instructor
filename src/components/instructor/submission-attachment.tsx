import { useState } from "react";
import { Download, Eye, FileText, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function extensionOf(name: string) {
  const parts = name.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "FICHIER";
}

/**
 * Accès au fichier rendu par l'apprenant : aperçu dans une modale + téléchargement.
 * Les fichiers de démonstration sont générés localement depuis le contenu du rendu.
 */
export function SubmissionAttachment({
  fileName,
  description,
  studentName,
}: {
  fileName: string | null;
  description: string;
  studentName?: string;
}) {
  const [open, setOpen] = useState(false);

  if (!fileName) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Paperclip className="size-3.5" /> Aucun fichier joint
      </span>
    );
  }

  const download = () => {
    const blob = new Blob(
      [`Rendu ${studentName ? `de ${studentName}` : ""}\nFichier : ${fileName}\n\n${description}\n`],
      { type: "text/plain;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/70 bg-secondary/40 px-3 py-2">
        <span className="flex size-8 items-center justify-center rounded-md bg-accent/25 text-[10px] font-semibold text-accent-foreground">
          {extensionOf(fileName).slice(0, 4)}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm">{fileName}</span>
        <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
          <Eye className="size-4" /> Aperçu
        </Button>
        <Button variant="soft" size="sm" onClick={download}>
          <Download className="size-4" /> Télécharger
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="size-4" /> {fileName}
            </DialogTitle>
            <DialogDescription>
              {studentName ? `Rendu de ${studentName}` : "Fichier joint au rendu"} · {extensionOf(fileName)}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[55vh] overflow-auto rounded-lg border border-border/70 bg-secondary/40 p-4 text-sm">
            <p className="whitespace-pre-wrap">{description}</p>
            <p className="mt-4 text-xs text-muted-foreground">
              Aperçu textuel du rendu. Le fichier d'origine est disponible au téléchargement.
            </p>
          </div>
          <DialogFooter>
            <Button variant="accent" onClick={download}>
              <Download className="size-4" /> Télécharger le fichier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
