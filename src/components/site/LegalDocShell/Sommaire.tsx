import { cn } from "@/lib/utils";
import type { LegalSection } from "./types";

export function LegalDocSommaire({
  sections,
  active,
  onJump,
}: {
  sections: LegalSection[];
  active: string;
  onJump: (id: string) => void;
}) {
  return (
    <>
      <aside className="hidden lg:block print:hidden">
        <nav aria-label="Sommaire" className="sticky top-24 space-y-1">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Sommaire
          </p>
          {sections.map((section, index) => (
            <button
              key={section.id}
              type="button"
              onClick={() => onJump(section.id)}
              aria-current={active === section.id ? "true" : undefined}
              className={cn(
                "flex w-full items-baseline gap-2 rounded-lg px-2.5 py-1.5 text-left text-[13px] leading-snug transition-colors",
                active === section.id
                  ? "bg-accent/15 font-medium text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{section.title}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 lg:hidden print:hidden">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {sections.map((section, index) => (
            <button
              key={section.id}
              type="button"
              onClick={() => onJump(section.id)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors",
                active === section.id
                  ? "border-accent/50 bg-accent/15 font-medium text-foreground"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {String(index + 1).padStart(2, "0")} · {section.title}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
