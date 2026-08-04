import { useQuery } from "@tanstack/react-query";
import { adminFetch } from "@/lib/api-url";
import type { APIInstructorUser, APIInstructorLoginResponse } from "@/data/instructor-auth";

export class InstructorAuthApiError extends Error { }

export async function loginInstructor(email: string, password: string): Promise<APIInstructorLoginResponse> {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  const response = await adminFetch(`/api/instructor/auth/login`, { method: "POST", body: formData });
  if (!response.ok) {
    throw new InstructorAuthApiError("Email ou mot de passe incorrect.");
  }

  return response.json();
}

/**
 * Revalide la session via le cookie httpOnly envoyé automatiquement.
 * Retourne null si aucune session valide n'est active (401).
 */
export async function fetchInstructorMe(): Promise<APIInstructorUser | null> {
  const response = await adminFetch(`/api/instructor/auth/me`);
  if (response.status === 401) return null;
  if (!response.ok) {
    throw new InstructorAuthApiError("Erreur lors de la vérification de la session.");
  }
  return response.json();
}

export async function logoutInstructor(): Promise<void> {
  await adminFetch(`/api/instructor/auth/logout`, { method: "POST" });
}

/**
 * Hook pour récupérer le formateur actuellement connecté
 */
export function useCurrentInstructor() {
  const { data: instructor, isLoading, error } = useQuery({
    queryKey: ["current-instructor"],
    queryFn: fetchInstructorMe,
    staleTime: 1000 * 60 * 5, // Met en cache les données pendant 5 minutes
    retry: false, // Ne pas réessayer indéfiniment en cas de 401
  });

  return {
    instructor: instructor ?? null,
    isLoading,
    isAuthenticated: !!instructor,
    error,
  };
}