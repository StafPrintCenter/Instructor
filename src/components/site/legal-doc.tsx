import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/logos.json";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FacebookIcon, InstagramIcon, LinkedinIcon, XIcon, WhatsAppIcon, TiktokIcon } from "@/components/site/icons";
import { SITE, SITE_LINK } from "@/data/site";

export type LegalClause = { label: string; text: string };

export type LegalSection = {
  id: string;
  title: string;
  summary: string;
  intro?: string;
  clauses: LegalClause[];
  note?: string;
};

export type LegalMeta = { label: string; value: string };

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
  const landingBase = SITE_LINK.landingUrl.replace(/\/$/, "");

  const socialLinks = [
    { label: "LinkedIn", href: SITE.socials.linkedin, Icon: LinkedinIcon },
    { label: "Facebook", href: SITE.socials.facebook, Icon: FacebookIcon },
    { label: "Instagram", href: SITE.socials.instagram, Icon: InstagramIcon },
    { label: "X", href: SITE.socials.x, Icon: XIcon },
    { label: "WhatsApp", href: SITE.whatsappLink, Icon: WhatsAppIcon },
    { label: "TikTok", href: SITE.socials.tiktok, Icon: TiktokIcon },
  ];

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
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur print:hidden">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center">
            <img src={logo.dc} alt="Logo SPC" className="h-12 w-auto object-contain" />
          </Link>
          <div className="ml-auto flex items-center gap-1">
            <Button asChild variant="soft" size="sm">
              <Link to="/">
                <ArrowLeft className="size-4" />
                <span>Retour</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="surface-grain border-b border-border bg-secondary/70">
        <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-foreground">{eyebrow}</p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {m.label}
                </dt>
                <dd className="mt-1 text-sm font-medium">{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[210px_1fr] lg:gap-14">
          <aside className="hidden lg:block print:hidden">
            <nav aria-label="Sommaire" className="sticky top-24 space-y-1">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Sommaire
              </p>
              {sections.map((section, i) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => jump(section.id)}
                  aria-current={active === section.id ? "true" : undefined}
                  className={cn(
                    "flex w-full items-baseline gap-2 rounded-lg px-2.5 py-1.5 text-left text-[13px] leading-snug transition-colors",
                    active === section.id
                      ? "bg-accent/15 font-medium text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{section.title}</span>
                </button>
              ))}
            </nav>
          </aside>

          <div className="min-w-0 lg:hidden print:hidden">
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
              {sections.map((section, i) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => jump(section.id)}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors",
                    active === section.id
                      ? "border-accent/50 bg-accent/15 font-medium text-foreground"
                      : "border-border bg-card text-muted-foreground",
                  )}
                >
                  {String(i + 1).padStart(2, "0")} · {section.title}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 min-w-0 space-y-12 lg:mt-0 lg:space-y-14">{children}</div>
        </div>
      </div>


      {/* Pied de page */}
      <footer className="border-t border-border/70">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-4 sm:flex-row sm:py-3">
          {/* Copyright */}
          <p className="text-center text-xs text-muted-foreground sm:text-left">
            © {new Date().getFullYear()} {SITE.tool} · Tous droits réservés.
            <span className="mx-1.5 hidden text-muted-foreground/50 sm:inline">|</span>

            <a
              href={SITE_LINK.landingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block font-medium underline underline-offset-4 transition-colors hover:text-primary sm:mt-0 sm:inline"
            >
              {SITE.name}
            </a>
          </p>

          {/* Liens de navigation & Réseaux sociaux */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            {/* Liens légaux */}
            <nav
              aria-label="Liens légaux"
              className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground"
            >
              <a
                href={`${SITE_LINK.docsUrl}/docs/ai/index`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 transition-colors hover:text-primary"
              >
                Lire la Documentation
              </a>

              <span className="text-muted-foreground/50">·</span>

              <a
                href={`${landingBase}/legal/privacy`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 transition-colors hover:text-primary"
              >
                Confidentialité
              </a>
            </nav>

            <span className="hidden text-muted-foreground/30 sm:inline">|</span>

            {/* Réseaux sociaux */}
            <div className="flex items-center gap-2">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
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
