import { COMMUNITY_ATTACHMENT_EXTENSIONS, COMMUNITY_LIMITS } from "@/data/community";

/** Valeur de l'attribut `accept` d'un <input type="file"> */
export const ATTACHMENTS_ACCEPT = COMMUNITY_ATTACHMENT_EXTENSIONS.map((ext) => `.${ext}`).join(",");

/** Filtre les fichiers choisis selon les règles de l'API (format, 5 Mo, 4 fichiers maximum) */
export function validateAttachments(current: File[], incoming: File[]) {
  const accepted: File[] = [];
  const errors: string[] = [];

  for (const file of incoming) {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

    if (!COMMUNITY_ATTACHMENT_EXTENSIONS.includes(extension)) {
      errors.push(`« ${file.name} » : format non accepté.`);
      continue;
    }
    if (file.size > COMMUNITY_LIMITS.maxAttachmentBytes) {
      errors.push(`« ${file.name} » dépasse 5 Mo.`);
      continue;
    }
    const all = [...current, ...accepted];
    if (all.some((f) => f.name === file.name && f.size === file.size)) continue; // doublon ignoré
    if (all.length >= COMMUNITY_LIMITS.maxAttachments) {
      errors.push(`${COMMUNITY_LIMITS.maxAttachments} fichiers maximum : « ${file.name} » ignoré.`);
      continue;
    }
    accepted.push(file);
  }

  return { accepted, errors };
}