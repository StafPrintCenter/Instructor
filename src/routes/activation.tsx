import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AuthShell } from "@/components/instructor/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api";

export const Route = createFileRoute("/activation")({
  head: () => ({
    meta: [
      { title: "Activation du compte formateur — STAF PRINT CENTER" },
      { name: "description", content: "Activez votre compte formateur avec le code reçu par e-mail." },
      { property: "og:title", content: "Activation du compte formateur" },
      { property: "og:description", content: "Dernière étape avant l'accès à votre espace pédagogique." },
    ],
  }),
  component: ActivatePage,
});

function ActivatePage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.activateAccount(code);
      toast.success("Compte activé, vous pouvez vous connecter.");
      navigate({ to: "/" });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Activer mon compte"
      subtitle="Saisissez le code d'activation reçu après validation de votre demande."
      footer={<Link to="/" className="font-medium text-foreground underline underline-offset-4">Retour à la connexion</Link>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code">Code d'activation</Label>
          <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="XXXXXX" required />
        </div>
        <Button type="submit" variant="accent" className="w-full" disabled={loading}>
          {loading ? "Activation…" : "Activer mon compte"}
        </Button>
      </form>
    </AuthShell>
  );
}
