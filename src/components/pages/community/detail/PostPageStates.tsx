import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackToCommunityButton() {
  return (
    <Button asChild variant="outline" size="sm">
      <Link to="/community">
        <ArrowLeft className="size-4" /> Retour à la communauté
      </Link>
    </Button>
  );
}

export function PostPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-16 animate-pulse rounded-lg bg-muted" />
      <div className="h-64 animate-pulse rounded-lg bg-muted" />
      <div className="h-32 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}

export function PostPageError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-8 text-center">
      <AlertTriangle className="size-6 text-destructive" />
      <p className="text-sm text-muted-foreground">Impossible de charger cette publication.</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RefreshCw className="size-4" /> Réessayer
      </Button>
    </div>
  );
}

/** Cadre des états d'erreur / introuvable : bouton de retour + message */
export function PostPageFallback({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <BackToCommunityButton />
      {children}
    </div>
  );
}