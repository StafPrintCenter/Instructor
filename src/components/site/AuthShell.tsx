import type { ReactNode } from "react";
import { SITE_LINK } from "@/data/site";
import { useAuthShellState } from "./AuthShell/Context";
import { AuthShellFormPanel } from "./AuthShell/FormPanel";
import { AuthShellHeroPanel } from "./AuthShell/HeroPanel";

export { AuthShellProvider, useAuthShellContent } from "./AuthShell/Context";

/**
 * Le shell visuel formateur : colonne hero à gauche (thème "espace formateur"), formulaire à droite. title/subtitle/footer sont lus depuis le contexte ; children = <Outlet/>.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  const { title, subtitle, footer } = useAuthShellState();
  const docsUrl = `${SITE_LINK.docsUrl}/docs/instructor/index`;

  return (
    <div className="bg-grain grid min-h-screen lg:grid-cols-2">
      <AuthShellHeroPanel docsUrl={docsUrl} />
      <AuthShellFormPanel title={title} subtitle={subtitle} footer={footer} docsUrl={docsUrl}>
        {children}
      </AuthShellFormPanel>
    </div>
  );
}
