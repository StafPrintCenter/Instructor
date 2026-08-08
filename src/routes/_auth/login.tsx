import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuthShellContent } from "@/components/site/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInstructorAuth } from "@/hooks/useInstructorAuth";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_auth/login")({
  head: () => ({
    meta: [
      { title: `Connexion | ${SITE.name}` },
      {
        name: "description",
        content:
          "Connectez-vous à l'espace formateur de STAF PRINT CENTER pour gérer vos formations, corrections et sessions.",
      },
      { property: "og:title", content: `Connexion | ${SITE.name}` },
      { property: "og:description", content: "Accès sécurisé à l'espace formateur du centre de formation." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, isAuthenticated, ready } = useInstructorAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useAuthShellContent({
    title: "Connexion formateur",
    subtitle: "Accédez à vos formations assignées, corrections et sessions.",
    footer: (
      <span>
        Pas encore de compte ?{" "}
        <Link to="/inscription" className="font-medium text-foreground underline underline-offset-4">
          Demander un accès formateur
        </Link>
      </span>
    ),
  });

  // Redirection automatique si le formateur est déjà connecté
  useEffect(() => {
    if (ready && isAuthenticated) navigate({ to: "/dashboard" });
  }, [ready, isAuthenticated, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Bienvenue dans votre espace formateur.");
      navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Adresse e-mail</Label>
        <Input
          id="email"
          type="email"
          className="bg-card"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          disabled={loading}
          required
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Mot de passe</Label>
          <Link to="/mot-de-passe-oublie" className="text-xs text-muted-foreground hover:text-foreground">
            Mot de passe oublié ?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            className="bg-card pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={loading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            disabled={loading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 cursor-pointer" />
            ) : (
              <Eye className="h-4 w-4 cursor-pointer" />
            )}
          </button>
        </div>
      </div>
      <Button type="submit" variant="accent" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connexion...
          </>
        ) : (
          "Se connecter"
        )}
      </Button>
    </form>
  );
}