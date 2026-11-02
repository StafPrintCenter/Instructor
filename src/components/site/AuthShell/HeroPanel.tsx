import { BookOpen, ExternalLink } from "lucide-react";
import { SITE } from "@/data/site";
import logo from "@/assets/logos.json";
import { SocialLinks } from "@/components/site/SocialLinks";

export function AuthShellHeroPanel({ docsUrl }: { docsUrl: string }) {
  return (
    <div className="hidden flex-col justify-between bg-gradient-hero p-12 text-primary-foreground lg:flex">
      <div className="flex items-center">
        <img src={logo.dc} alt="Logo SPC" className="h-10 w-auto md:h-12" />
      </div>

      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em]">{SITE.tool}</p>
        <h1 className="mt-3 font-display text-balance text-5xl font-bold tracking-tight">
          Enseignez, corrigez et suivez vos apprenants au même endroit.
        </h1>
        <p className="mt-4 opacity-90">
          Vos formations assignées, vos apprenants et vos corrections, réunis au même endroit.
        </p>

        <div className="pt-2">
          <a
            href={docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/10 px-3.5 py-1.5 text-xs font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:border-primary-foreground/30 hover:bg-primary-foreground/20"
          >
            <BookOpen className="size-3.5" />
            <span>Guide & Documentation Enseigant</span>
            <ExternalLink className="size-3 opacity-60" />
          </a>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-primary-foreground/10 pt-6">
        <p className="text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} {SITE.name} - Tous droits réservés.
        </p>
        <SocialLinks linkClassName="hover:bg-primary-foreground/10 text-primary-foreground/70 hover:text-primary-foreground" />
      </div>
    </div>
  );
}
