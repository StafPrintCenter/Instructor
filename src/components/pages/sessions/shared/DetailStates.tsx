import type { ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-xs text-destructive">{message}</p> : null;
}

/** `hero` : variante avec un grand bloc d'en-tête (page de session dans une formation) */
export function SessionDetailSkeleton({ hero }: { hero?: boolean }) {
  return (
    <div className="space-y-6">
      <div className={hero ? "h-48 animate-pulse rounded-2xl bg-muted" : "h-16 animate-pulse rounded-lg bg-muted"} />
      {hero ? (
        <>
          <div className="h-24 animate-pulse rounded-lg bg-muted" />
          <div className="h-48 animate-pulse rounded-lg bg-muted" />
        </>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-64 animate-pulse rounded-lg bg-muted lg:col-span-2" />
          <div className="h-64 animate-pulse rounded-lg bg-muted" />
        </div>
      )}
    </div>
  );
}

export function SessionDetailError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-8 text-center">
      <AlertTriangle className="size-6 text-destructive" />
      <p className="text-sm text-muted-foreground">Impossible de charger cette session.</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RefreshCw className="size-4" /> Réessayer
      </Button>
    </div>
  );
}

export function SessionNotFound({ children }: { children?: ReactNode }) {
  return <p className="text-muted-foreground">{children ?? "Session introuvable."}</p>;
}