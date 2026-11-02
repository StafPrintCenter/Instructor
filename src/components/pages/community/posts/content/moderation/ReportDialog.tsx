import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  COMMUNITY_REPORT_LIMITS,
  type CommunityReportReason,
  type CommunityTarget,
} from "@/data/community-moderation";
import { useReportCommunityContent } from "@/stores/useCommunityModerationStore";
import { cn } from "@/lib/utils";
import { ReportReasonOptions } from "./ReportReasonOptions";

interface ReportDialogProps {
  target: CommunityTarget;
  /** « cette publication » ou « ce commentaire » */
  subject: string;
  onClose: () => void;
}

export function ReportDialog({ target, subject, onClose }: ReportDialogProps) {
  const report = useReportCommunityContent();
  const [reason, setReason] = useState<CommunityReportReason | null>(null);
  const [details, setDetails] = useState("");

  const detailsRequired = reason === "other";
  const tooLong = details.length > COMMUNITY_REPORT_LIMITS.detailsMax;
  const canSubmit = !!reason && !(detailsRequired && !details.trim()) && !tooLong && !report.isPending;

  const submit = () => {
    if (!reason || !canSubmit) return;

    report.mutate(
      { target, reason, details: details.trim() || undefined },
      {
        // Le message dépend du niveau retenu par l'API (formateurs ou modération)
        onSuccess: (receipt) => {
          toast.success(receipt.message);
          onClose();
        },
        onError: (e) => toast.error(e.message),
      }
    );
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Signaler {subject}</DialogTitle>
          <DialogDescription>
            Choisissez le motif. Le signalement est examiné par la modération ; vous ne pouvez signaler un contenu qu'une
            seule fois.
          </DialogDescription>
        </DialogHeader>

        <ReportReasonOptions value={reason} onChange={setReason} />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="report-details">Précisions {detailsRequired ? "(obligatoire)" : "(optionnel)"}</Label>
            <span className={cn("text-[11px]", tooLong ? "text-destructive" : "text-muted-foreground")}>
              {details.length}/{COMMUNITY_REPORT_LIMITS.detailsMax}
            </span>
          </div>
          <Textarea id="report-details" rows={3} value={details} onChange={(e) => setDetails(e.target.value)} />
          {detailsRequired && !details.trim() ? (
            <p className="text-xs text-destructive">Les précisions sont obligatoires pour le motif « Autre ».</p>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button variant="accent" disabled={!canSubmit} onClick={submit}>
            {report.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Envoyer le signalement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}