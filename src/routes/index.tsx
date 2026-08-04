import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { AuthShell } from "@/components/instructor/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInstructorAuth } from "@/lib/instructor-auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Connexion Formateur — STAF PRINT CENTER" },
      {
        name: "description",
        content:
          "Connectez-vous à l'espace formateur de STAF PRINT CENTER pour gérer vos formations, corrections et sessions.",
      },
      { property: "og:title", content: "Connexion Formateur — STAF PRINT CENTER" },
      { property: "og:description", content: "Accès sécurisé à l'espace formateur du centre de formation." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useInstructorAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("rachidath@stafprintcenter.bj");
  const [password, setPassword] = useState("formateur");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
    <AuthShell
      title="Connexion formateur"
      subtitle="Accédez à vos formations assignées, corrections et sessions."
      footer={
        <span>
          Pas encore de compte ?{" "}
          <Link to="/inscription" className="font-medium text-foreground underline underline-offset-4">
            Demander un accès formateur
          </Link>
        </span>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Adresse e-mail</Label>
          <Input id="email" type="email" className="bg-card" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        <Button type="submit" variant="accent" className="w-full" disabled={loading}>
          {loading ? "Connexion…" : "Se connecter"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Compte déjà validé ?{" "}
          <Link to="/activation" className="underline underline-offset-4">
            Activer mon compte
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
