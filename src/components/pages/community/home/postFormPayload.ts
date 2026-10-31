import type { APICommunityPostDetail, CommunityPostCreatePayload, CommunityPostUpdatePayload } from "@/data/community";
import { GENERAL_AUDIENCE, buildInitialPostValues, type PostFormValues } from "./postFormSchema";

export function buildCreatePayload(v: PostFormValues, attachments: File[]): CommunityPostCreatePayload {
  return {
    title: v.title,
    body: v.body,
    categoryId: v.categoryId,
    trainingId: v.audience === GENERAL_AUDIENCE ? undefined : v.audience,
    type: v.type,
    tags: v.tags.length > 0 ? v.tags : undefined,
    attachments: attachments.length > 0 ? attachments : undefined,
  };
}

/**
 * Modification : uniquement les champs modifiés (un champ vide = inchangé côté API).
 * La formation et les pièces jointes ne se modifient pas. Les tags ne peuvent pas être vidés :
 * un tableau vide serait ignoré par l'API. Renvoie null s'il n'y a rien à envoyer.
 */
export function buildUpdatePayload(v: PostFormValues, post: APICommunityPostDetail): CommunityPostUpdatePayload | null {
  const original = buildInitialPostValues(post);
  const payload: CommunityPostUpdatePayload = {};

  if (v.title !== original.title.trim()) payload.title = v.title;
  if (v.body !== original.body.trim()) payload.body = v.body;
  if (v.categoryId !== original.categoryId) payload.categoryId = v.categoryId;
  if (v.type !== original.type) payload.type = v.type;
  if (v.tags.length > 0 && v.tags.join("|") !== original.tags.join("|")) payload.tags = v.tags;

  return Object.keys(payload).length > 0 ? payload : null;
}