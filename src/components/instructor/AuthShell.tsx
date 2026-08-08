import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { SITE } from "@/data/site";
import logo from "@/assets/logos.json";

interface AuthShellContent {
  title: string;
  subtitle: string;
  footer?: ReactNode;
}

interface AuthShellContextValue {
  content: AuthShellContent;
  setContent: (c: AuthShellContent) => void;
}

const AuthShellContext = createContext<AuthShellContextValue | null>(null);

/**
 * À placer dans _auth.tsx, autour du <AuthShell>. Fournit le contexte que chaque page _auth/* alimente via useAuthShellContent().
 */
export function AuthShellProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<AuthShellContent>({ title: "", subtitle: "" });
  return (
    <AuthShellContext.Provider value={{ content, setContent }}>
      {children}
    </AuthShellContext.Provider>
  );
}

/**
 * À appeler en haut de chaque page _auth/* (login, invite, etc.) pour définir le titre/sous-titre/footer affichés par le AuthShell englobant. Se met à jour automatiquement à chaque changement d'état de la page.
 */
export function useAuthShellContent(content: AuthShellContent) {
  const ctx = useContext(AuthShellContext);
  if (!ctx) {
    throw new Error("useAuthShellContent doit être utilisé sous une route _auth (AuthShellProvider manquant).");
  }

  useEffect(() => {
    ctx.setContent(content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content.title, content.subtitle, content.footer]);
}

/**
 * Le shell visuel formateur : colonne hero à gauche (thème "espace formateur"), formulaire à droite. title/subtitle/footer sont lus depuis le contexte ; children = <Outlet/>.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  const ctx = useContext(AuthShellContext);
  if (!ctx) {
    throw new Error("AuthShell doit être utilisé sous AuthShellProvider (_auth.tsx).");
  }
  const { title, subtitle, footer } = ctx.content;

  return (
    <div className="bg-grain grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <div className="flex items-center">
          <img src={logo.dw} alt="Logo SPC" className="h-10 md:h-12 w-auto" />
        </div>
        <div className="max-w-md space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Espace Formateur</p>
          <h2 className="font-display text-4xl leading-tight">
            Enseignez, corrigez et suivez vos apprenants au même endroit.
          </h2>
          <p className="text-sm text-primary-foreground/70">
            Espace formateur : vos formations assignées, vos apprenants et vos corrections, réunis au même endroit.
          </p>
        </div>
        <p className="text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} {SITE.name} - Tous droits réservés.
        </p>
      </div>

      {/* Colonne droite / Formulaire */}
      <div className="flex items-center justify-center p-8 bg-grain">
        <div className="w-full max-w-md">
          {/* Logo affiché en haut sur mobile & petits écrans */}
          <div className="lg:hidden mb-8 flex justify-center">
            <img src={logo.dc} alt="Logo SPC" className="h-10 md:h-12 w-auto" />
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="font-display text-3xl font-bold">{title}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
          {footer ? <div className="text-sm text-muted-foreground">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
