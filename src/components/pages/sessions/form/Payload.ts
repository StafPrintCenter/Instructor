import type { APIInstructorSession, InstructorSessionPayload, InstructorSessionUpdatePayload } from "@/data/sessions";
import { toStartsAtPayload } from "@/lib/session-time";
import { buildInitialValues, type SessionFormValues } from "./Schema";

export function buildCreatePayload(v: SessionFormValues): InstructorSessionPayload {
  return {
    trainingId: v.trainingId,
    title: v.title,
    description: v.description || undefined,
    startsAt: toStartsAtPayload(v.startsAt),
    durationMinutes: Number(v.durationMinutes),
    modality: v.modality,
    location: v.modality === "in_person" ? v.location : undefined,
    meetingUrl: v.modality === "online" ? v.meetingUrl : undefined,
  };
}

/**
 * Modification : `durationMinutes` est toujours envoyé (le back le lit sans garde) ;
 * les autres champs seulement s'ils ont changé (un champ vide = inchangé côté API).
 * Renvoie null s'il n'y a aucune modification.
 */
export function buildUpdatePayload(
  v: SessionFormValues,
  session: APIInstructorSession
): InstructorSessionUpdatePayload | null {
  const original = buildInitialValues(session);
  const modalityChanged = v.modality !== original.modality;
  const durationMinutes = Number(v.durationMinutes);

  const changes: Omit<InstructorSessionUpdatePayload, "durationMinutes"> = {};

  if (v.title !== original.title) changes.title = v.title;
  if (v.description && v.description !== original.description.trim()) changes.description = v.description;
  if (v.startsAt !== original.startsAt) changes.startsAt = toStartsAtPayload(v.startsAt);
  if (modalityChanged) changes.modality = v.modality;
  if (v.modality === "in_person" && (modalityChanged || v.location !== original.location)) {
    changes.location = v.location;
  }
  if (v.modality === "online" && (modalityChanged || v.meetingUrl !== original.meetingUrl)) {
    changes.meetingUrl = v.meetingUrl;
  }

  const durationChanged = durationMinutes !== Number(original.durationMinutes);
  if (Object.keys(changes).length === 0 && !durationChanged) return null;

  return { ...changes, durationMinutes };
}