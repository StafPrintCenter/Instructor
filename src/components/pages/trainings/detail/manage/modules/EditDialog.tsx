import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { APIInstructorModule } from "@/data/content";
import { useUpdateModule } from "@/stores/useModulesStore";
import { ModuleFields } from "./Fields";
import { emptyModuleForm, type ModuleFormValues } from "./Form";

interface EditModuleDialogProps {
  trainingId: string;
  /** null = dialog fermé */
  module: APIInstructorModule | null;
  onClose: () => void;
}

export function EditModuleDialog({ trainingId, module, onClose }: EditModuleDialogProps) {
  const updateModule = useUpdateModule(trainingId);
  const [form, setForm] = useState<ModuleFormValues>(emptyModuleForm());

  // Pré-remplit le formulaire à chaque ouverture
  useEffect(() => {
    if (module) {
      setForm({ title: module.title, description: module.description ?? "", sort_order: Number(module.sortOrder) });
    }
  }, [module?.id]);

  const submit = () => {
    if (!module) return;
    updateModule.mutate(
      { id: module.id, payload: form },
      {
        onSuccess: () => {
          toast.success("Module modifié.");
          onClose();
        },
        onError: (e) => toast.error(e.message),
      }
    );
  };

  return (
    <Dialog open={!!module} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">Modifier le module</DialogTitle>
        </DialogHeader>

        <ModuleFields idPrefix="me" values={form} onChange={setForm} />

        <DialogFooter>
          <Button variant="accent" disabled={!form.title || updateModule.isPending} onClick={submit}>
            {updateModule.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}