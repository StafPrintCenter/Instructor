import { useQuery } from "@tanstack/react-query";
import { instructorFetch } from "@/lib/api-url";
import type { APIInstructorUser, APIInstructorLoginResponse, InstructorInviteVerifyResponse, InstructorRegisterPayload } from "@/data/auth";

export class InstructorAuthApiError extends Error { }

export async function registerInstructor(
  payload: InstructorRegisterPayload
): Promise<APIInstructorUser> {
  const fd = new FormData();
  fd.append("first_name", payload.firstName);
  fd.append("last_name", payload.lastName);
  fd.append("email", payload.email);
  fd.append("password", payload.password);
  if (payload.bio) {
    fd.append("bio", payload.bio);
  }

  const response = await instructorFetch(`/api/instructor/auth/register`, {
    method: "POST",
    body: fd,
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new InstructorAuthApiError(
      body?.message || "Impossible de créer le compte. Vérifiez vos informations."
    );
  }

  return body.data as APIInstructorUser;
}

export async function loginInstructor(email: string, password: string): Promise<APIInstructorLoginResponse> {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  const response = await instructorFetch(`/api/instructor/auth/login`, { method: "POST", body: formData });
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
  const response = await instructorFetch(`/api/instructor/auth/me`);
  if (response.status === 401) return null;
  if (!response.ok) {
    throw new InstructorAuthApiError("Erreur lors de la vérification de la session.");
  }
  return response.json();
}

export async function logoutInstructor(): Promise<void> {
  await instructorFetch(`/api/instructor/auth/logout`, { method: "POST" });
}

function buildInviteQuery(params: { instructor: string; expires: string; signature: string }) {
  return new URLSearchParams({
    instructor: params.instructor,
    expires: params.expires,
    signature: params.signature,
  }).toString();
}

export async function verifyInstructorInvite(params: {
  instructor: string;
  expires: string;
  signature: string;
}): Promise<InstructorInviteVerifyResponse> {
  const response = await instructorFetch(
    `/api/instructor/auth/invite-accept?${buildInviteQuery(params)}`
  );
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new InstructorAuthApiError(
      body?.message || "Ce lien d'invitation est invalide ou a expiré."
    );
  }
  return body.data as InstructorInviteVerifyResponse;
}

export async function acceptInstructorInvite(params: {
  instructor: string;
  expires: string;
  signature: string;
  password: string;
}): Promise<{ message: string }> {
  const fd = new FormData();
  fd.append("password", params.password);

  const response = await instructorFetch(
    `/api/instructor/auth/invite-accept?${buildInviteQuery(params)}`,
    {
      method: "POST",
      body: fd,
    }
  );
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new InstructorAuthApiError(
      body?.message || "Ce lien d'invitation est invalide ou a expiré."
    );
  }
  return body as { message: string };
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
