import type { ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackToTrainingButton } from "./BackToTrainingButton";

export function StudentFollowUpSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-16 animate-pulse rounded-lg bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="h-24 animate-pulse rounded-lg bg-muted" />
        <div className="h-24 animate-pulse rounded-lg bg-muted" />
        <div className="h-24 animate-pulse rounded-lg bg-muted" />
        <div className="h-24 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="h-64 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}

export function StudentFollowUpError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-8 text-center">
      <AlertTriangle className="size-6 text-destructive" />
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RefreshCw className="size-4" /> Réessayer
      </Button>
    </div>
  );
}

/** Cadre des états d'erreur / introuvable : bouton de retour + message */
export function StudentFollowUpFallback({ trainingId, children }: { trainingId: string; children: ReactNode }) {
  return (
    <div className="space-y-6">
      <BackToTrainingButton trainingId={trainingId} />
      {children}
    </div>
  );
}