import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCreateModule } from "@/stores/useModulesStore";
import { ModuleFields } from "./Fields";
import { emptyModuleForm, type ModuleFormValues } from "./Form";

interface CreateModuleDialogProps {
  trainingId: string;
  modulesCount: number;
}

export function CreateModuleDialog({ trainingId, modulesCount }: CreateModuleDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ModuleFormValues>(() => emptyModuleForm(modulesCount));
  const createModule = useCreateModule(trainingId);

  const submit = () =>
    createModule.mutate(
      { title: form.title, description: form.description, sort_order: form.sort_order },
      {
        onSuccess: () => {
          setOpen(false);
          toast.success("Module créé en brouillon.");
        },
        onError: (e) => toast.error(e.message),
      }
    );

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) setForm(emptyModuleForm(modulesCount));
      }}
    >
      <DialogTrigger asChild>
        <Button variant="accent">
          <Plus className="size-4" /> Nouveau module
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">Créer un module</DialogTitle>
        </DialogHeader>

        <ModuleFields idPrefix="mc" values={form} onChange={setForm} />

        <DialogFooter>
          <Button variant="accent" disabled={!form.title || createModule.isPending} onClick={submit}>
            {createModule.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Créer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}