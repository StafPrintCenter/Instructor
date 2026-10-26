import { useEffect, useRef } from "react";
import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { LogoLoader } from "@/components/site/Logo/Loader";
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
  const wasAuthenticated = useRef(false);

  useEffect(() => {
    if (!ready) return;

    if (isAuthenticated) {
      wasAuthenticated.current = true;
      return;
    }

    if (!redirectStarted.current) {
      redirectStarted.current = true;
      navigate({
        to: "/login",
        search: {
          redirectTo: wasAuthenticated.current ? undefined : requestedHref.current,
        },
      });
    }
  }, [ready, isAuthenticated, navigate]);

  if (!ready || !isAuthenticated) {
    return (
      <LogoLoader
        fullScreen
        size={140}
        text="Vérification de votre session…"
      />
    );
  }

  return (
    <InstructorShell>
      <Outlet />
    </InstructorShell>
  );
}
