import { z, type ZodError } from "zod";
import type { APIInstructorSession } from "@/data/sessions";
import { toPortoNovoInputValue } from "@/lib/session-time";

export const sessionFormSchema = z
  .object({
    trainingId: z.string().min(1, "Choisissez une formation"),
    title: z.string().trim().min(2, "Le titre doit faire au moins 2 caractères").max(255, "255 caractères maximum"),
    description: z.string().trim().max(5000, "5000 caractères maximum"),
    startsAt: z.string().min(1, "Choisissez la date et l'heure"),
    durationMinutes: z.string().refine((v) => {
      const n = Number(v);
      return Number.isInteger(n) && n >= 15 && n <= 720;
    }, "La durée doit être comprise entre 15 et 720 minutes"),
    modality: z.enum(["in_person", "online"]),
    location: z.string().trim().max(255, "255 caractères maximum"),
    meetingUrl: z.string().trim().max(500, "500 caractères maximum"),
  })

  .superRefine((v, ctx) => {
    if (v.modality === "in_person" && !v.location) {
      ctx.addIssue({ code: "custom", path: ["location"], message: "Indiquez le lieu de la session" });
    }
    if (v.modality === "online") {
      if (!v.meetingUrl) {
        ctx.addIssue({ code: "custom", path: ["meetingUrl"], message: "Indiquez le lien de la réunion" });
      } else {
        try {
          new URL(v.meetingUrl);
        } catch {
          ctx.addIssue({ code: "custom", path: ["meetingUrl"], message: "Le lien doit être une URL valide (https://…)" });
        }
      }
    }
  });

export type SessionFormValues = z.infer<typeof sessionFormSchema>;

export type SetField = <K extends keyof SessionFormValues>(key: K, value: SessionFormValues[K]) => void;

/** Props communes aux blocs de champs du formulaire */
export interface SessionFieldsProps {
  values: SessionFormValues;
  errors: Record<string, string>;
  setField: SetField;
}

export function buildInitialValues(
  session?: APIInstructorSession | null,
  trainingId?: string
): SessionFormValues {
  if (session) {
    return {
      trainingId: session.trainingId,
      title: session.title,
      description: session.description ?? "",
      startsAt: toPortoNovoInputValue(session.startsAt),
      durationMinutes: String(Number(session.durationMinutes)),
      modality: session.modality,
      location: session.location ?? "",
      meetingUrl: session.meetingUrl ?? "",
    };
  }
  return {
    trainingId: trainingId ?? "",
    title: "",
    description: "",
    startsAt: "",
    durationMinutes: "60",
    modality: "in_person",
    location: "",
    meetingUrl: "",
  };
}

/** Première erreur par champ */
export function getFormErrors(error: ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  error.issues.forEach((issue) => {
    const key = String(issue.path[0]);
    if (!errors[key]) errors[key] = issue.message;
  });
  return errors;
}