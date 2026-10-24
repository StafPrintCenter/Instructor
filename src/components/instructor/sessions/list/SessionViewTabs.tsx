import { CalendarDays, List } from "lucide-react";
import { cn } from "@/lib/utils";

export type SessionView = "list" | "calendar";

const TABS: { id: SessionView; label: string; icon: typeof List }[] = [
  { id: "list", label: "Liste", icon: List },
  { id: "calendar", label: "Calendrier", icon: CalendarDays },
];

export function SessionViewTabs({ value, onChange }: { value: SessionView; onChange: (view: SessionView) => void }) {
  return (
    <div
      role="tablist"
      aria-label="Affichage des sessions"
      className="inline-flex rounded-lg border border-border/70 bg-muted/40 p-1"
    >
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={value === id}
          onClick={() => onChange(id)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            value === id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Icon className="size-4" /> {label}
        </button>
      ))}
    </div>
  );
}