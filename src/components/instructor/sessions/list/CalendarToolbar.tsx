import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarToolbarProps {
  label: string;
  isLoading: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function CalendarToolbar({ label, isLoading, onPrev, onNext, onToday }: CalendarToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <h2 className="font-display text-xl">{label}</h2>
        {isLoading ? <span className="text-xs text-muted-foreground">Chargement…</span> : null}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onToday}>Aujourd'hui</Button>
        <Button variant="outline" size="icon" className="size-8" aria-label="Mois précédent" onClick={onPrev}>
          <ChevronLeft className="size-4" />
        </Button>
        <Button variant="outline" size="icon" className="size-8" aria-label="Mois suivant" onClick={onNext}>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}