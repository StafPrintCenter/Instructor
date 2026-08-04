import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
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
          <div className="bg-cardflex items-center justify-between">
            <Label htmlFor="password">Mot de passe</Label>
            <Link to="/mot-de-passe-oublie" className="text-xs text-muted-foreground hover:text-foreground">
              Mot de passe oublié ?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
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
