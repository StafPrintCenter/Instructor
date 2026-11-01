import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { COMMUNITY_MODERATION_LIMITS } from "@/data/community-moderation";
import { cn } from "@/lib/utils";

interface ModerationReasonDialogProps {
  title: string;
  description: string;
  confirmLabel: string;
  isPending: boolean;
  /** Reçoit le motif nettoyé (obligatoire pour masquer) */
  onConfirm: (reason: string) => void;
  onClose: () => void;
}

/** Saisie du motif obligatoire d'un masquage (publication ou commentaire) */
export function ModerationReasonDialog({
  title,
  description,
  confirmLabel,
  isPending,
  onConfirm,
  onClose,
}: ModerationReasonDialogProps) {
  const [reason, setReason] = useState("");
  const trimmed = reason.trim();
  const tooLong = reason.length > COMMUNITY_MODERATION_LIMITS.reasonMax;
  const canSubmit = trimmed !== "" && !tooLong && !isPending;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="moderation-reason">Motif (obligatoire)</Label>
            <span className={cn("text-[11px]", tooLong ? "text-destructive" : "text-muted-foreground")}>
              {reason.length}/{COMMUNITY_MODERATION_LIMITS.reasonMax}
            </span>
          </div>
          <Textarea id="moderation-reason" rows={4} autoFocus value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button variant="destructive" disabled={!canSubmit} onClick={() => onConfirm(trimmed)}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}