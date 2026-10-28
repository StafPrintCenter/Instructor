import { toast } from "sonner";
import { ConfirmAction, ConfirmDelete } from "@/components/site/InstructorBits";
import type { APIInstructorModule } from "@/data/content";
import { useDeleteModule, useSubmitModuleForReview } from "@/stores/useModulesStore";

interface ModuleConfirmProps {
  trainingId: string;
  module: APIInstructorModule;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteModuleConfirm({ trainingId, module, open, onOpenChange }: ModuleConfirmProps) {
  const deleteModule = useDeleteModule(trainingId);

  return (
    <ConfirmDelete
      open={open}
      onOpenChange={onOpenChange}
      title={`Supprimer "${module.title}" ?`}
      onConfirm={async () => {
        onOpenChange(false);
        // mutateAsync : la carte du module disparaît quand la liste est rechargée, avant la fin des callbacks de mutate()
        try {
          await deleteModule.mutateAsync(module.id);
          toast.success("Module supprimé.");
        } catch (e) {
          toast.error((e as Error).message);
        }
      }}
    />
  );
}

export function SubmitModuleConfirm({ trainingId, module, open, onOpenChange }: ModuleConfirmProps) {
  const submitModule = useSubmitModuleForReview(trainingId);

  return (
    <ConfirmAction
      open={open}
      onOpenChange={onOpenChange}
      title={`Soumettre "${module.title}" à validation ?`}
      description="Le module passera en attente de validation par l'administrateur."
      confirmLabel="Soumettre"
      onConfirm={async () => {
        onOpenChange(false);
        try {
          await submitModule.mutateAsync(module.id);
          toast.success("Module soumis à validation.");
        } catch (e) {
          toast.error((e as Error).message);
        }
      }}
    />
  );
}