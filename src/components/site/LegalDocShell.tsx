import { useEffect, useState, type ReactNode } from "react";
import { LegalDocFooter } from "./LegalDoc/Footer";
import { LegalDocHeader } from "./LegalDoc/Header";
import { LegalDocSommaire } from "./LegalDoc/Sommaire";
import type { LegalMeta, LegalSection } from "./LegalDoc/types";

export { LegalArticle } from "./LegalDoc/Section";
export type { LegalClause, LegalMeta, LegalSection } from "./LegalDoc/types";

/** Contractual document page: sticky summary rail + numbered articles. */
export function LegalDocShell({
  eyebrow,
  title,
  description,
  meta,
  sections,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  meta: LegalMeta[];
  sections: LegalSection[];
  children: ReactNode;
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-110px 0px -65% 0px", threshold: 0 },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LegalDocHeader eyebrow={eyebrow} title={title} description={description} meta={meta} />

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[210px_1fr] lg:gap-14">
          <LegalDocSommaire sections={sections} active={active} onJump={jump} />

          <div className="mt-8 min-w-0 space-y-12 lg:mt-0 lg:space-y-14">{children}</div>
        </div>
      </div>

      <LegalDocFooter />
    </div>
  );
}

export function LegalKeyPoints({ items }: { items: { title: string; text: string }[] }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
      <h2 className="font-display text-xl">En bref</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Six engagements essentiels ; le détail figure dans les articles ci-dessous.
      </p>
      <ul className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {items.map((item, i) => (
          <li key={item.title} className="flex gap-3">
            <span className="mt-0.5 font-mono text-[11px] text-accent-foreground tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>
              <span className="block text-sm font-medium">{item.title}</span>
              <span className="mt-0.5 block text-[13px] leading-relaxed text-muted-foreground">{item.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
