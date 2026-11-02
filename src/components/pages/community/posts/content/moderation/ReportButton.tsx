import { useState } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CommunityTarget } from "@/data/community-moderation";
import { ReportDialog } from "./ReportDialog";

interface ReportButtonProps {
  target: CommunityTarget;
  /** « cette publication » ou « ce commentaire » */
  subject: string;
  /** "post" : bouton de la page de détail ; "comment" : bouton discret des commentaires */
  variant?: "post" | "comment";
}

/** Bouton « Signaler » avec son dialogue (à afficher seulement si permissions.canReport) */
export function ReportButton({ target, subject, variant = "post" }: ReportButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {variant === "post" ? (
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          <Flag className="size-4" /> Signaler
        </Button>
      ) : (
        <Button size="sm" variant="ghost" className="h-7 px-2 text-muted-foreground" onClick={() => setOpen(true)}>
          <Flag className="size-3.5" /> Signaler
        </Button>
      )}
      {open ? <ReportDialog target={target} subject={subject} onClose={() => setOpen(false)} /> : null}
    </>
  );
}