import { useEffect } from "react";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { InstructorShell } from "@/components/instructor/instructor-shell";
import { useInstructorAuth } from "@/lib/instructor-auth";

export const Route = createFileRoute("/_instructor")({
  component: InstructorLayout,
});

function InstructorLayout() {
  const { isAuthenticated, isReady } = useInstructorAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isReady && !isAuthenticated) navigate({ to: "/" });
  }, [isReady, isAuthenticated, navigate]);

  if (!isReady || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Vérification de votre session formateur…</p>
      </div>
    );
  }

  return (
    <InstructorShell>
      <Outlet />
    </InstructorShell>
  );
}
