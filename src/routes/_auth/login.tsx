import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { useAuthShellContent } from "@/components/site/AuthShell";
import { LoginCredentialsForm } from "@/components/pages/login/LoginCredentialsForm";
import { MfaChallengeForm } from "@/components/pages/login/MfaChallengeForm";
import { useInstructorAuth } from "@/hooks/useInstructorAuth";
import type { APIInstructorMfaChallenge } from "@/data/auth";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_auth/login")({
  validateSearch: z.object({ redirectTo: z.string().optional() }),
  head: () => ({
    meta: [
      { title: `${SITE.tool} - Connexion | ${SITE.name}` },
      {
        name: "description",
        content: `Connectez-vous à votre ${SITE.tool} ${SITE.name} pour retrouver vos formations, suivre vos apprenants et corriger leurs travaux.`,
      },
      { property: "og:title", content: `${SITE.tool} - Connexion | ${SITE.name}` },
      { property: "og:description", content: `Connectez-vous à votre ${SITE.tool} ${SITE.name} pour retrouver vos formations et suivre vos apprenants.` },
    ],
  }),
  component: LoginPage,
});

function getInternalRedirect(redirectTo?: string) {
  if (!redirectTo || !redirectTo.startsWith("/")) return null;

  try {
    const url = new URL(redirectTo, window.location.origin);
    if (url.origin !== window.location.origin) return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

function LoginPage() {
  const { login, isAuthenticated, ready } = useInstructorAuth();
  const navigate = useNavigate();
  const router = useRouter();
  const { redirectTo } = Route.useSearch();
  const destination = getInternalRedirect(redirectTo);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [challenge, setChallenge] = useState<APIInstructorMfaChallenge | null>(null);

  useAuthShellContent(
    challenge
      ? {
        title: "Vérification en deux étapes",
        subtitle: "Confirmez votre identité pour terminer la connexion.",
      }
      : {
        title: "Connexion formateur",
        subtitle: "Accédez à vos formations assignées, corrections et sessions.",
        footer: (
          <span>
            Pas encore de compte ?{" "}
            <Link to="/register" className="font-medium text-foreground underline underline-offset-4">
              Demander un accès
            </Link>
          </span>
        ),
      },
  );

  // Seule source de redirection : dès que la session est établie (login direct ou après MFA)
  useEffect(() => {
    if (ready && isAuthenticated) {
      if (destination) router.history.push(destination);
      else navigate({ to: "/dashboard" });
    }
  }, [ready, isAuthenticated, destination, navigate, router]);

  const handleLogin = async (nextEmail: string, password: string) => {
    setEmail(nextEmail);
    setLoading(true);
    try {
      const outcome = await login(nextEmail, password);
      if (outcome.status === "mfa") {
        setChallenge(outcome.challenge);
        return;
      }
      toast.success("Bienvenue dans votre espace formateur.");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (challenge) {
    return (
      <MfaChallengeForm
        challenge={challenge}
        onBack={() => setChallenge(null)}
        onVerified={() => toast.success("Bienvenue dans votre espace formateur.")}
      />
    );
  }

  return <LoginCredentialsForm defaultEmail={email} loading={loading} onSubmit={handleLogin} />;
}