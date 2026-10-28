import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ChaptersEditorProps {
  chapters: string[];
  onChange: (chapters: string[]) => void;
}

export function ChaptersEditor({ chapters, onChange }: ChaptersEditorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Chapitres (optionnel)</Label>
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...chapters, ""])}>
          <Plus className="size-4 mr-1" /> Ajouter un chapitre
        </Button>
      </div>

      {chapters.map((c, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={c}
            placeholder={`Chapitre ${i + 1}`}
            onChange={(e) => {
              const next = [...chapters];
              next[i] = e.target.value;
              onChange(next);
            }}
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Retirer"
            onClick={() => onChange(chapters.filter((_, idx) => idx !== i))}
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
}