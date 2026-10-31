import { AlertTriangle, Loader2, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommentFocusNoticeProps {
  isSearching: boolean;
  isError: boolean;
  notFound: boolean;
  onRetry: () => void;
  /** Retire ?comment= de l'adresse */
  onClear: () => void;
}

/** Messages liés à la recherche du commentaire visé par le lien */
export function CommentFocusNotice({ isSearching, isError, notFound, onRetry, onClear }: CommentFocusNoticeProps) {
  if (isSearching) {
    return (
      <p className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 p-3 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Recherche du commentaire…
      </p>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-destructive" /> Impossible de localiser ce commentaire.
        </span>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onRetry}>Réessayer</Button>
          <Button size="sm" variant="ghost" onClick={onClear}>Ignorer</Button>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/30 p-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <SearchX className="size-4" /> Ce commentaire est introuvable : il a peut-être été supprimé ou masqué.
        </span>
        <Button size="sm" variant="ghost" onClick={onClear}>Fermer</Button>
      </div>
    );
  }

  return null;
}