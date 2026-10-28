import { Pencil, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModuleActionsProps {
  onEdit: () => void;
  onSubmit: () => void;
  onDelete: () => void;
}

export function ModuleActions({ onEdit, onSubmit, onDelete }: ModuleActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <Button size="icon" variant="ghost" aria-label="Modifier" onClick={onEdit}>
        <Pencil className="size-4" />
      </Button>
      <Button size="icon" variant="ghost" aria-label="Soumettre" onClick={onSubmit}>
        <Send className="size-4" />
      </Button>
      <Button size="icon" variant="ghost" aria-label="Supprimer" onClick={onDelete}>
        <Trash2 className="size-4 text-destructive" />
      </Button>
    </div>
  );
}