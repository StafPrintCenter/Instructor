import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import logo from "@/assets/logos.json";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="bg-grain grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <div className="flex items-center">
          <img src={logo.dc} alt="Logo SPC" className="h-10 md:h-12 w-auto" />
        </div>
        <div className="max-w-md space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Espace Formateur</p>
          <h2 className="font-display text-4xl leading-tight">
            Enseignez, corrigez et suivez vos apprenants au même endroit.
          </h2>
          <p className="text-sm text-primary-foreground/70">
            Studio créatif et centre de formation à Cotonou, Bénin. L'espace formateur vous donne le contrôle
            du contenu pédagogique, des corrections et des sessions.
          </p>
        </div>
        <p className="text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} STAF PRINT CENTER — Tous droits réservés.
        </p>
      </div>

      <div className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground lg:hidden">
              <GraduationCap className="size-3.5" /> STAF PRINT CENTER
            </span>
            <h1 className="font-display text-3xl">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
          {footer ? <div className="text-sm text-muted-foreground">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
