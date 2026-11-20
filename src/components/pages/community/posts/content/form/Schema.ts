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
  type: z.enum(["discussion", "question", "resource", "announcement", "poll"]),
  tags: z.array(z.string()).max(COMMUNITY_LIMITS.maxTags, `${COMMUNITY_LIMITS.maxTags} tags maximum`),
  options: z.array(z.string()),
}).superRefine((values, ctx) => {
  if (values.type !== "poll") return;
  if (values.options.length < COMMUNITY_LIMITS.pollMinOptions || values.options.length > COMMUNITY_LIMITS.pollMaxOptions) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["options"],
      message: `Le sondage doit contenir entre ${COMMUNITY_LIMITS.pollMinOptions} et ${COMMUNITY_LIMITS.pollMaxOptions} options`,
    });
  }
  const labels = values.options.map((option) => option.trim().toLocaleLowerCase("fr-FR"));
  values.options.forEach((option, index) => {
    const label = option.trim();
    if (!label) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["options", index], message: "Chaque option est obligatoire" });
    } else if (label.length > COMMUNITY_LIMITS.pollOptionMax) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["options", index], message: `${COMMUNITY_LIMITS.pollOptionMax} caractères maximum par option` });
    } else if (labels.filter((item) => item === labels[index]).length > 1) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["options", index], message: "Les options doivent être distinctes" });
    }
  });
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
      options: post.type === "poll" ? (post.poll?.options ?? []).map((option) => option.label) : ["", ""],
    };
  }
  return { title: "", body: "", categoryId: "", audience: GENERAL_AUDIENCE, type: "discussion", tags: [], options: ["", ""] };
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