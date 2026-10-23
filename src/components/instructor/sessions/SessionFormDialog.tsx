import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  SESSION_MODALITIES,
  sessionModalityLabels,
  type APIInstructorSession,
  type InstructorSessionUpdatePayload,
  type SessionModality,
} from "@/data/sessions";
import { useCreateInstructorSession, useUpdateInstructorSession } from "@/stores/useSessionsStore";
import { useInstructorTrainingsList } from "@/stores/useTrainingsStore";
import { minSessionStartInputValue, toPortoNovoInputValue, toStartsAtPayload } from "@/lib/session-time";

const schema = z
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

type FormValues = z.infer<typeof schema>;

function buildInitial(session: APIInstructorSession | null | undefined, trainingId?: string): FormValues {
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

interface SessionFormDialogProps {
  open: boolean;
  onClose: () => void;
  /** Session à modifier ; absente = création */
  session?: APIInstructorSession | null;
  /** Formation imposée (création depuis le détail d'une formation) */
  trainingId?: string;
}

export function SessionFormDialog({ open, onClose, session, trainingId }: SessionFormDialogProps) {
  const isEdit = !!session;
  const createMutation = useCreateInstructorSession();
  const updateMutation = useUpdateInstructorSession();
  const { items: trainings } = useInstructorTrainingsList({ perPage: 100 });

  const [form, setForm] = useState<FormValues>(() => buildInitial(session, trainingId));
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setForm(buildInitial(session, trainingId));
      setErrors({});
    }
  }, [open, session?.id, trainingId]);

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        const key = String(i.path[0]);
        if (!errs[key]) errs[key] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    const v = parsed.data;

    if (!session) {
      createMutation.mutate(
        {
          trainingId: v.trainingId,
          title: v.title,
          description: v.description || undefined,
          startsAt: toStartsAtPayload(v.startsAt),
          durationMinutes: Number(v.durationMinutes),
          modality: v.modality,
          location: v.modality === "in_person" ? v.location : undefined,
          meetingUrl: v.modality === "online" ? v.meetingUrl : undefined,
        },
        {
          onSuccess: () => {
            toast.success("Session créée : les apprenants de la formation sont invités.");
            onClose();
          },
          onError: (e) => toast.error(e.message),
        }
      );
      return;
    }

    // Modification : uniquement les champs réellement modifiés (un champ vide = inchangé côté API)
    const original = buildInitial(session);
    const payload: InstructorSessionUpdatePayload = {};
    const modalityChanged = v.modality !== original.modality;

    if (v.title !== original.title) payload.title = v.title;
    if (v.description && v.description !== original.description.trim()) payload.description = v.description;
    if (v.startsAt !== original.startsAt) payload.startsAt = toStartsAtPayload(v.startsAt);
    if (Number(v.durationMinutes) !== Number(original.durationMinutes)) payload.durationMinutes = Number(v.durationMinutes);
    if (modalityChanged) payload.modality = v.modality;
    if (v.modality === "in_person" && (modalityChanged || v.location !== original.location)) payload.location = v.location;
    if (v.modality === "online" && (modalityChanged || v.meetingUrl !== original.meetingUrl)) payload.meetingUrl = v.meetingUrl;

    if (Object.keys(payload).length === 0) {
      toast.info("Aucune modification à enregistrer.");
      onClose();
      return;
    }

    updateMutation.mutate(
      { id: session.id, payload },
      {
        onSuccess: () => {
          toast.success("Session modifiée.");
          onClose();
        },
        onError: (e) => toast.error(e.message),
      }
    );
  };

  const Err = ({ name }: { name: string }) =>
    errors[name] ? <p className="text-xs text-destructive">{errors[name]}</p> : null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display">{isEdit ? "Modifier la session" : "Nouvelle session"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Seuls les champs modifiés sont envoyés."
              : "La session est publiée immédiatement et les apprenants de la formation sont invités à confirmer leur présence."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!isEdit && !trainingId ? (
            <div className="space-y-2">
              <Label>Formation</Label>
              <Select value={form.trainingId} onValueChange={(v) => set("trainingId", v)}>
                <SelectTrigger><SelectValue placeholder="Choisir une formation" /></SelectTrigger>
                <SelectContent>
                  {trainings.map((t) => (
                    <SelectItem key={t.trainingId} value={t.trainingId}>{t.trainingTitle}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Err name="trainingId" />
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="sf-title">Titre</Label>
            <Input id="sf-title" value={form.title} onChange={(e) => set("title", e.target.value)} />
            <Err name="title" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sf-desc">Description (optionnel)</Label>
            <Textarea id="sf-desc" rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
            <Err name="description" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sf-start">Début</Label>
              <Input
                id="sf-start"
                type="datetime-local"
                min={isEdit ? undefined : minSessionStartInputValue()}
                value={form.startsAt}
                onChange={(e) => set("startsAt", e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                Heure de Porto-Novo (UTC+1){isEdit ? "" : " · au moins 3 jours à l'avance"}
              </p>
              <Err name="startsAt" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sf-duration">Durée (minutes)</Label>
              <Input
                id="sf-duration"
                type="number"
                min={15}
                max={720}
                step={5}
                value={form.durationMinutes}
                onChange={(e) => set("durationMinutes", e.target.value)}
              />
              <Err name="durationMinutes" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Modalité</Label>
            <Select value={form.modality} onValueChange={(v) => set("modality", v as SessionModality)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SESSION_MODALITIES.map((m) => (
                  <SelectItem key={m} value={m}>{sessionModalityLabels[m]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {form.modality === "in_person" ? (
            <div className="space-y-2">
              <Label htmlFor="sf-location">Lieu</Label>
              <Input id="sf-location" value={form.location} onChange={(e) => set("location", e.target.value)} />
              <Err name="location" />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="sf-url">Lien de la réunion</Label>
              <Input
                id="sf-url"
                type="url"
                placeholder="https://meet.google.com/…"
                value={form.meetingUrl}
                onChange={(e) => set("meetingUrl", e.target.value)}
              />
              <Err name="meetingUrl" />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button variant="accent" disabled={isPending} onClick={handleSubmit}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            {isEdit ? "Enregistrer" : "Créer la session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}