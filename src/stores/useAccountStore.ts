import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instructorFetch } from "@/lib/api/resolve-url";
import { parseApiError } from "@/lib/api/error";
import type { APIInstructorUser } from "@/data/auth";
import type {
  InstructorProfilePayload,
  InstructorEmailChangeRequestPayload,
  InstructorEmailChangeConfirmPayload,
  InstructorPasswordChangePayload,
  APIInstructorPasswordChangeResponse,
  APIInstructorEmailChangeRequestResponse,
} from "@/data/account";

export class InstructorAccountApiError extends Error { }

async function accountRequest<T>(
  path: string,
  method: "POST" | "PUT",
  body: FormData,
  fallbackMessage: string
): Promise<T> {
  const response = await instructorFetch(`/api/instructor/account/${path}`, { method, body });
  if (!response.ok) {
    const error = await parseApiError(response, fallbackMessage);
    throw new InstructorAccountApiError(error.message);
  }
  return response.json();
}

export async function updateInstructorProfile(
  payload: InstructorProfilePayload
): Promise<APIInstructorUser> {
  const fd = new FormData();
  fd.append("firstName", payload.firstName);
  fd.append("lastName", payload.lastName);
  fd.append("bio", payload.bio ?? "");
  fd.append("removePhoto", payload.removePhoto ? "1" : "0");
  if (payload.photo) fd.append("photo", payload.photo);

  const json = await accountRequest<{ data: APIInstructorUser }>(
    "profile", "PUT", fd, "Impossible de modifier le profil."
  );
  return json.data;
}

export async function requestInstructorEmailChange(
  payload: InstructorEmailChangeRequestPayload
): Promise<APIInstructorEmailChangeRequestResponse> {
  const fd = new FormData();
  fd.append("newEmail", payload.newEmail);
  fd.append("password", payload.password);

  return accountRequest<APIInstructorEmailChangeRequestResponse>(
    "email/request", "POST", fd, "Impossible d'envoyer le code de confirmation."
  );
}

export async function confirmInstructorEmailChange(
  payload: InstructorEmailChangeConfirmPayload
): Promise<APIInstructorUser> {
  const fd = new FormData();
  fd.append("code", payload.code);

  const json = await accountRequest<{ data: APIInstructorUser }>(
    "email/confirm", "POST", fd, "Code invalide ou expiré."
  );
  return json.data;
}

export async function changeInstructorPassword(
  payload: InstructorPasswordChangePayload,
): Promise<APIInstructorPasswordChangeResponse> {
  const fd = new FormData();
  fd.append("currentPassword", payload.currentPassword);
  fd.append("password", payload.password);
  fd.append("password_confirmation", payload.passwordConfirmation);
  fd.append("revokeOtherSessions", String(payload.revokeOtherSessions));

  return accountRequest<APIInstructorPasswordChangeResponse>(
    "password",
    "PUT",
    fd,
    "Impossible de modifier le mot de passe.",
  );
}

export function useUpdateInstructorProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: InstructorProfilePayload) => updateInstructorProfile(payload),
    onSuccess: (user) => qc.setQueryData(["current-instructor"], user),
  });
}

export function useRequestInstructorEmailChange() {
  return useMutation({
    mutationFn: (payload: InstructorEmailChangeRequestPayload) => requestInstructorEmailChange(payload),
  });
}

export function useConfirmInstructorEmailChange() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: InstructorEmailChangeConfirmPayload) => confirmInstructorEmailChange(payload),
    onSuccess: (user) => qc.setQueryData(["current-instructor"], user),
  });
}

export function useChangeInstructorPassword() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: InstructorPasswordChangePayload) => changeInstructorPassword(payload),
    onSuccess: (_response, payload) => {
      if (payload.revokeOtherSessions) {
        return qc.invalidateQueries({ queryKey: ["instructor-sessions"] });
      }
    },
  });
}
