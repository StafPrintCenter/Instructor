import { Link } from "@tanstack/react-router";
import { GraduationCap, Home, ArrowLeft } from "lucide-react";
import { SITE } from "@/data/site";

export function NotFoundComponent() {
  return (
    <div className="surface-grain relative flex min-h-screen items-center justify-center bg-background px-6 py-12 overflow-hidden">
      <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center">
        <div className="relative mx-auto w-24 h-24 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-accent/15 rotate-6" />
          <div className="absolute inset-0 rounded-3xl bg-secondary -rotate-6" />
          <div className="relative rounded-3xl bg-card border border-border w-20 h-20 flex items-center justify-center shadow-soft">
            <GraduationCap className="h-10 w-10 text-accent-foreground" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-8xl font-bold tracking-tight text-foreground select-none">
          4<span className="text-accent">0</span>4
        </h1>

        <h2 className="mt-4 text-2xl font-semibold text-foreground">
          Session introuvable
        </h2>

        <p className="mt-3 text-muted-foreground max-w-md mx-auto text-sm sm:text-base leading-relaxed">
          Cette ressource formateur n'existe pas ou n'est plus disponible sur l'espace {SITE.name}.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-all duration-300 hover:shadow-lift hover:-translate-y-0.5 active:translate-y-0"
          >
            <Home className="h-4 w-4" />
            Tableau de bord
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-input bg-card px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-muted hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Page précédente
          </button>
        </div>
      </div>
    </div>
  );
}