import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SITE } from "@/data/site";

export function AcceptanceSection() {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8 print:hidden">
      <h2 className="font-display text-xl">Cette charte s'applique dès votre premier accès</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        La création d'un compte formateur sur {SITE.tool} vaut reconnaissance d'en avoir pris connaissance et
        acceptation. Toute nouvelle version est publiée sur cette page et signalée aux formateurs : la poursuite
        de l'accès après publication vaut acceptation de la version en vigueur, indiquée en haut de page.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Button asChild variant="accent">
          <Link to="/register">J'accepte, faire ma demande d'accès</Link>
        </Button>
        <Button asChild variant="soft">
          <Link to="/">Retour</Link>
        </Button>
      </div>
      <p className="mt-5 text-xs text-muted-foreground">
        Toute question relative à cette charte s'adresse à l'administration du centre, via le canal indiqué dans
        votre e-mail d'activation.
      </p>
    </section>
  );
}
