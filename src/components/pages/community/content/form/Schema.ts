import { z, type ZodError } from "zod";
import { COMMUNITY_LIMITS, type APICommunityPostDetail } from "@/data/community";

/** Valeur de `audience` pour la communauté générale (pas de trainingId) */
export const GENERAL_AUDIENCE = "general";

export const postFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(COMMUNITY_LIMITS.titleMin, `Le titre doit faire au moins ${COMMUNITY_LIMITS.titleMin} caractères`)
    .max(COMMUNITY_LIMITS.titleMax, `${COMMUNITY_LIMITS.titleMax} caractères maximum`),
  body: z
    .string()
    .trim()
    .min(COMMUNITY_LIMITS.bodyMin, `Le contenu doit faire au moins ${COMMUNITY_LIMITS.bodyMin} caractères`)
    .max(COMMUNITY_LIMITS.bodyMax, `${COMMUNITY_LIMITS.bodyMax.toLocaleString("fr-FR")} caractères maximum`),
  categoryId: z.string().min(1, "Choisissez une catégorie"),
  audience: z.string().min(1),
  type: z.enum(["discussion", "question", "resource", "announcement"]),
  tags: z.array(z.string()).max(COMMUNITY_LIMITS.maxTags, `${COMMUNITY_LIMITS.maxTags} tags maximum`),
});

export type PostFormValues = z.infer<typeof postFormSchema>;

export type SetPostField = <K extends keyof PostFormValues>(key: K, value: PostFormValues[K]) => void;

/** Props communes aux blocs de champs */
export interface PostFieldsProps {
  values: PostFormValues;
  errors: Record<string, string>;
  setField: SetPostField;
}

export function buildInitialPostValues(post: APICommunityPostDetail | null): PostFormValues {
  if (post) {
    return {
      title: post.title,
      body: post.body,
      categoryId: post.category.id,
      audience: post.training?.id ?? GENERAL_AUDIENCE,
      type: post.type,
      tags: post.tags ?? [],
    };
  }
  return { title: "", body: "", categoryId: "", audience: GENERAL_AUDIENCE, type: "discussion", tags: [] };
}

/** Première erreur par champ */
export function getPostFormErrors(error: ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  error.issues.forEach((issue) => {
    const key = String(issue.path[0]);
    if (!errors[key]) errors[key] = issue.message;
  });
  return errors;
}