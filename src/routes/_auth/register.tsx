import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { useInstructorAuth } from "@/hooks/useInstructorAuth";
import { useAuthShellContent } from "@/components/site/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_auth/register")({
  head: () => ({
    meta: [
      { title: `Demander un accès formateur | ${SITE.name}` },
      {
        name: "description",
        content: `Créez votre compte formateur sur ${SITE.name} et accédez à l'espace formateur après validation par un administrateur.`,
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { register } = useInstructorAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  // Contenu shell calculé AVANT tout return conditionnel (règles des Hooks).
  const shellContent = done
    ? {
      title: "Demande envoyée",
      subtitle: "Votre compte a été créé et est en attente de validation par un administrateur.",
    }
    : {
      title: "Demander un accès formateur",
      subtitle: "Renseignez vos informations. Votre compte sera activé après validation.",
      footer: (
        <span>
          Déjà un compte ?{" "}
          <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
            Se connecter
          </Link>
        </span>
      ),
    };

  useAuthShellContent(shellContent);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      await register({ firstName, lastName, email, password, bio: bio || undefined });
      toast.success("Votre demande d'accès a bien été envoyée.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création du compte.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="py-6 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
        <p className="mt-4 text-sm text-muted-foreground">
          Un administrateur va examiner votre demande. Vous recevrez un e-mail dès que votre compte sera activé.
        </p>
        <Button className="mt-6 w-full" onClick={() => navigate({ to: "/login" })}>
          Aller à la connexion
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            className="bg-card"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
            disabled={loading}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            className="bg-card"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
            disabled={loading}
            required
          />
        </div>
      </div>

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
        <Label htmlFor="bio">Bio (facultatif)</Label>
        <Textarea
          id="bio"
          className="bg-card"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Quelques mots sur votre expérience de formateur..."
          disabled={loading}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            className="bg-card pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
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
            {showPassword ? <EyeOff className="h-4 w-4 cursor-pointer" /> : <Eye className="h-4 w-4 cursor-pointer" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
        <Input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          className="bg-card"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          disabled={loading}
          required
        />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <Button type="submit" variant="accent" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          "Créer mon compte"
        )}
      </Button>
    </form>
  );
}