import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  COMMUNITY_REPORT_NOTE_MAX,
  type APICommunityReportDetail,
  type CommunityReportResolveAction,
} from "@/data/community-reports";
import { useResolveCommunityReport } from "@/stores/useCommunityReportsStore";
import { cn } from "@/lib/utils";

const CONFIG: Record<
  CommunityReportResolveAction,
  { title: string; description: string; confirm: string; success: string; destructive: boolean }
> = {
  hide: {
    title: "Masquer le contenu",
    description:
      "Le contenu est masqué, son auteur est notifié et les signalements en attente sur ce contenu sont clôturés.",
    confirm: "Masquer le contenu",
    success: "Contenu masqué : signalement traité.",
    destructive: true,
  },
  dismiss: {
    title: "Rejeter le signalement",
    description: "Le signalement est clos sans action : le contenu reste visible.",
    confirm: "Rejeter le signalement",
    success: "Signalement rejeté.",
    destructive: false,
  },
};

interface ResolveReportDialogProps {
  report: APICommunityReportDetail;
  action: CommunityReportResolveAction;
  onClose: () => void;
}

export function ResolveReportDialog({ report, action, onClose }: ResolveReportDialogProps) {
  const resolve = useResolveCommunityReport();
  const [note, setNote] = useState("");
  const config = CONFIG[action];
  const tooLong = note.length > COMMUNITY_REPORT_NOTE_MAX;

  const submit = () =>
    resolve.mutate(
      { id: report.id, action, note: note.trim() || undefined },
      {
        onSuccess: () => {
          toast.success(config.success);
          onClose();
        },
        onError: (e) => toast.error(e.message),
      }
    );

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="resolve-note">Note (optionnel)</Label>
            <span className={cn("text-[11px]", tooLong ? "text-destructive" : "text-muted-foreground")}>
              {note.length}/{COMMUNITY_REPORT_NOTE_MAX}
            </span>
          </div>
          <Textarea id="resolve-note" rows={4} value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button
            variant={config.destructive ? "destructive" : "accent"}
            disabled={tooLong || resolve.isPending}
            onClick={submit}
          >
            {resolve.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            {config.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}