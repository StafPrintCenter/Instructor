import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { COMMUNITY_REPORT_NOTE_MAX, type APICommunityReportDetail } from "@/data/community-reports";
import { useEscalateCommunityReport } from "@/stores/useCommunityReportsStore";
import { cn } from "@/lib/utils";

interface EscalateReportDialogProps {
  report: APICommunityReportDetail;
  onClose: () => void;
  /** Appelé après la transmission : le signalement quitte la liste du formateur */
  onEscalated: () => void;
}

export function EscalateReportDialog({ report, onClose, onEscalated }: EscalateReportDialogProps) {
  const escalate = useEscalateCommunityReport();
  const [note, setNote] = useState("");

  const trimmed = note.trim();
  const tooLong = note.length > COMMUNITY_REPORT_NOTE_MAX;
  const canSubmit = trimmed !== "" && !tooLong && !escalate.isPending;

  const submit = () =>
    escalate.mutate(
      { id: report.id, note: trimmed },
      {
        onSuccess: () => {
          toast.success("Signalement transmis aux administrateurs.");
          onClose();
          onEscalated();
        },
        onError: (e) => toast.error(e.message),
      }
    );

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Transmettre aux administrateurs</DialogTitle>
          <DialogDescription>
            À utiliser quand le contenu doit être supprimé ou dépasse votre périmètre : la suppression est réservée aux
            administrateurs. Le signalement quittera votre liste.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="escalate-note">Note pour les administrateurs (obligatoire)</Label>
            <span className={cn("text-[11px]", tooLong ? "text-destructive" : "text-muted-foreground")}>
              {note.length}/{COMMUNITY_REPORT_NOTE_MAX}
            </span>
          </div>
          <Textarea id="escalate-note" rows={4} autoFocus value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button variant="accent" disabled={!canSubmit} onClick={submit}>
            {escalate.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Transmettre
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}