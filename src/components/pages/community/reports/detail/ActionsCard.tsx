import { useState } from "react";
import { EyeOff, Send, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { APICommunityReportDetail, CommunityReportResolveAction } from "@/data/community-reports";
import { EscalateReportDialog } from "./EscalateDialog";
import { ResolveReportDialog } from "./ResolveDialog";

interface ReportActionsCardProps {
  report: APICommunityReportDetail;
  onEscalated: () => void;
}

/** Actions possibles tant que le signalement est à traiter à votre niveau */
export function ReportActionsCard({ report, onEscalated }: ReportActionsCardProps) {
  const [resolveAction, setResolveAction] = useState<CommunityReportResolveAction | null>(null);
  const [escalateOpen, setEscalateOpen] = useState(false);

  if (report.status !== "pending" || report.level !== "instructor") return null;

  const { target } = report;
  // Masquer n'a de sens que sur un contenu existant et encore visible
  const canHide = target.exists && target.status !== "hidden";

  return (
    <Card className="border-border/70">
      <CardContent className="space-y-3 p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Traiter</p>

        <Button className="w-full justify-start" variant="outline" disabled={!canHide} onClick={() => setResolveAction("hide")}>
          <EyeOff className="size-4" /> Masquer le contenu
        </Button>
        {!canHide ? (
          <p className="-mt-1 text-[11px] text-muted-foreground">
            {target.exists ? "Ce contenu est déjà masqué." : "Ce contenu n'existe plus."}
          </p>
        ) : null}

        <Button className="w-full justify-start" variant="outline" onClick={() => setResolveAction("dismiss")}>
          <XCircle className="size-4" /> Rejeter le signalement
        </Button>

        <Button className="w-full justify-start" variant="soft" onClick={() => setEscalateOpen(true)}>
          <Send className="size-4" /> Transmettre aux administrateurs
        </Button>

        {resolveAction ? (
          <ResolveReportDialog report={report} action={resolveAction} onClose={() => setResolveAction(null)} />
        ) : null}
        {escalateOpen ? (
          <EscalateReportDialog report={report} onClose={() => setEscalateOpen(false)} onEscalated={onEscalated} />
        ) : null}
      </CardContent>
    </Card>
  );
}