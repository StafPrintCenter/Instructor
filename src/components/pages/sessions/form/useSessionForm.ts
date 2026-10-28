import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { APIInstructorSession } from "@/data/sessions";
import { useCreateInstructorSession, useUpdateInstructorSession } from "@/stores/useSessionsStore";
import { buildCreatePayload, buildUpdatePayload } from "./Payload";
import { buildInitialValues, getFormErrors, sessionFormSchema, type SessionFormValues, type SetField } from "./Schema";

interface UseSessionFormArgs {
  open: boolean;
  session?: APIInstructorSession | null;
  trainingId?: string;
  onClose: () => void;
}

export function useSessionForm({ open, session, trainingId, onClose }: UseSessionFormArgs) {
  const isEdit = !!session;
  const createMutation = useCreateInstructorSession();
  const updateMutation = useUpdateInstructorSession();

  const [values, setValues] = useState<SessionFormValues>(() => buildInitialValues(session, trainingId));
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Réinitialise le formulaire à chaque ouverture
  useEffect(() => {
    if (open) {
      setValues(buildInitialValues(session, trainingId));
      setErrors({});
    }
  }, [open, session?.id, trainingId]);

  const setField: SetField = (key, value) => setValues((v) => ({ ...v, [key]: value }));

  const submit = () => {
    const parsed = sessionFormSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(getFormErrors(parsed.error));
      return;
    }
    setErrors({});

    if (!session) {
      createMutation.mutate(buildCreatePayload(parsed.data), {
        onSuccess: () => {
          toast.success("Session créée : les apprenants de la formation sont invités.");
          onClose();
        },
        onError: (e) => toast.error(e.message),
      });
      return;
    }

    const payload = buildUpdatePayload(parsed.data, session);
    if (!payload) {
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

  return {
    isEdit,
    values,
    errors,
    setField,
    submit,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}