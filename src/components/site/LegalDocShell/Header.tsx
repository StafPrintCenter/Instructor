import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/logos.json";
import { Button } from "@/components/ui/button";
import type { LegalMeta } from "./types";

export function LegalDocHeader({
  eyebrow,
  title,
  description,
  meta,
}: {
  eyebrow: string;
  title: string;
  description: string;
  meta: LegalMeta[];
}) {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur print:hidden">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <img src={logo.dc} alt="Logo SPC" className="h-12 w-auto object-contain" />

          <div className="ml-auto flex items-center gap-1">
            <Button asChild variant="soft" size="sm">
              <Link to="/dashboard">
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
            {meta.map((item) => (
              <div key={item.label}>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {item.label}
                </dt>
                <dd className="mt-1 text-sm font-medium">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
