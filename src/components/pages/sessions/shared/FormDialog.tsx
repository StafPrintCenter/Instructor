import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { APIInstructorSession } from "@/data/sessions";
import { SessionFormFields } from "../home/FormFields";
import { useSessionForm } from "../form/useSessionForm";

interface SessionFormDialogProps {
  open: boolean;
  onClose: () => void;
  session?: APIInstructorSession | null;
  trainingId?: string;
}

export function SessionFormDialog({ open, onClose, session, trainingId }: SessionFormDialogProps) {
  const { isEdit, values, errors, setField, submit, isPending } = useSessionForm({
    open,
    session,
    trainingId,
    onClose,
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle
            className="font-display">
            {isEdit
              ? "Modifier la session"
              : "Nouvelle session"
            }
          </DialogTitle>

          <DialogDescription>
            {isEdit
              ? "Les informations de cette sessions seront mises à jour."
              : "La session est publiée immédiatement et les apprenants de la formation sont invités à confirmer leur présence."}
          </DialogDescription>
        </DialogHeader>

        <SessionFormFields
          isEdit={isEdit}
          trainingId={trainingId}
          values={values}
          errors={errors}
          setField={setField}
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button variant="accent" disabled={isPending} onClick={submit}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            {isEdit ? "Enregistrer" : "Créer la session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}