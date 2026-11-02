import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { BookOpen, ExternalLink } from "lucide-react";
import { SITE } from "@/data/site";
import logo from "@/assets/logos.json";
import { SocialLinks } from "@/components/site/SocialLinks";

interface AuthShellFormPanelProps {
  title: string;
  subtitle: string;
  footer?: ReactNode;
  docsUrl: string;
  children: ReactNode;
}

export function AuthShellFormPanel({
  title,
  subtitle,
  footer,
  docsUrl,
  children,
}: AuthShellFormPanelProps) {
  return (
    <div className="flex flex-col justify-between bg-grain p-8">
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center lg:hidden">
            <img src={logo.dc} alt="Logo SPC" className="h-10 w-auto md:h-12" />
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="font-display text-3xl font-bold">{title}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>

          <div className="mt-8">{children}</div>

          {footer ? (
            <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
          ) : null}
        </div>
      </div>

      <div className="mt-auto flex flex-col items-center gap-3 border-t border-border pt-8 lg:hidden">
        <div className="flex items-center gap-4">
          <a
            href={docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <BookOpen className="size-3.5" />
            <span>Documentation</span>
            <ExternalLink className="size-3 opacity-60" />
          </a>
          <Link
            to="/cgu"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            CGU
          </Link>
        </div>
        <SocialLinks />
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {SITE.name}
        </p>
      </div>
    </div>
  );
}
