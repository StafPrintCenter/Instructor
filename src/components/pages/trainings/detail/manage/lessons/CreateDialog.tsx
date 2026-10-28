import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCreateLesson } from "@/stores/useLessonsStore";
import { LessonFields } from "./Fields";
import { emptyLesson, toLessonPayload, type LessonFormValues } from "./Config";

interface CreateLessonDialogProps {
  moduleId: string;
  /** Position de la nouvelle leçon (nombre de leçons déjà présentes) */
  nextSortOrder: number;
}

export function CreateLessonDialog({ moduleId, nextSortOrder }: CreateLessonDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<LessonFormValues>({ ...emptyLesson });
  const createLesson = useCreateLesson();

  const submit = () =>
    createLesson.mutate(
      { moduleId, payload: toLessonPayload(form, nextSortOrder) },
      {
        onSuccess: () => {
          toast.success("Leçon créée en brouillon.");
          setOpen(false);
        },
        onError: (e) => toast.error(e.message),
      }
    );

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) setForm({ ...emptyLesson });
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mt-2 w-full border-dashed hover:border-solid hover:bg-accent/5">
          <Plus className="mr-1.5 size-4" /> Ajouter une leçon
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display">Nouvelle leçon</DialogTitle>
        </DialogHeader>

        <LessonFields mode="create" idPrefix="lc" values={form} onChange={setForm} />

        <DialogFooter>
          <Button variant="accent" disabled={!form.title || createLesson.isPending} onClick={submit}>
            {createLesson.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Créer en brouillon
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}