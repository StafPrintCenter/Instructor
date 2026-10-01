import { useEffect, useRef } from "react";
import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { InstructorShell } from "@/components/site/InstructorShell";
import { useInstructorAuth } from "@/hooks/useInstructorAuth";

export const Route = createFileRoute("/_instructor")({
  component: InstructorLayout,
});

function InstructorLayout() {
  const { ready, isAuthenticated } = useInstructorAuth();
  const navigate = useNavigate();
  const currentHref = useLocation({ select: (location) => location.href });
  const requestedHref = useRef(currentHref);
  const redirectStarted = useRef(false);

  useEffect(() => {
    if (ready && !isAuthenticated && !redirectStarted.current) {
      redirectStarted.current = true;
      navigate({ to: "/login", search: { redirectTo: requestedHref.current } });
    }
  }, [ready, isAuthenticated, currentHref, navigate]);

  if (!ready || !isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background text-foreground">
        <Loader2 className="size-8 animate-spin text-accent" />
        <p className="text-sm text-muted-foreground">
          Vérification de votre session…
        </p>
      </div>
    );
  }

  return (
    <InstructorShell>
      <Outlet />
    </InstructorShell>
  );
}
