import { SITE, SITE_LINK } from "@/data/site";
import { socialLinks } from "@/data/socials";

export function LegalDocFooter() {
  const landingBase = SITE_LINK.landingUrl.replace(/\/$/, "");

  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-4 sm:flex-row sm:py-3">
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

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <nav
            aria-label="Liens légaux"
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground"
          >
            <a
              href={`${SITE_LINK.docsUrl}/docs/instructor/index`}
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
  );
}
