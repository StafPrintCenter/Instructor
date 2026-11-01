import type { LegalSection } from "./types";

export function LegalArticle({ section, index }: { section: LegalSection; index: number }) {
  return (
    <section id={section.id} className="scroll-mt-24">
      <div className="flex items-start gap-4">
        <span className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-xl border border-accent/40 bg-accent/12 font-display text-sm text-accent-foreground tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-2xl leading-snug">{section.title}</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">{section.summary}</p>
          {section.intro ? (
            <p className="mt-5 text-sm leading-relaxed text-foreground/85">{section.intro}</p>
          ) : null}
          <div className="mt-6 space-y-3">
            {section.clauses.map((clause) => (
              <div
                key={clause.label}
                className="rounded-xl border border-border bg-card p-4 shadow-soft transition-colors hover:border-accent/50"
              >
                <p className="text-sm font-semibold">{clause.label}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{clause.text}</p>
              </div>
            ))}
          </div>
          {section.note ? (
            <p className="mt-4 rounded-xl border border-dashed border-border bg-secondary/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
              {section.note}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
