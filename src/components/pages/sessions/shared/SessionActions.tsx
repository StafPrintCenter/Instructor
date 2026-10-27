import { useState } from "react";
import { toast } from "sonner";
import { LifeBuoy, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDelete } from "@/components/site/InstructorBits";
import { SessionFormDialog } from "@/components/pages/sessions/SessionFormDialog";
import { SessionReviewRequestDialog } from "@/components/pages/sessions/SessionReviewRequestDialog";
import type { APIInstructorSessionDetail } from "@/data/sessions";
import { useDeleteInstructorSession } from "@/stores/useSessionsStore";

interface SessionActionsProps {
  session: APIInstructorSessionDetail;
  onDeleted: () => void;
}

export function SessionActions({ session, onDeleted }: SessionActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteMutation = useDeleteInstructorSession();

  const canRequestReview = session.status === "suspended" && !session.pendingReviewRequest;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {canRequestReview ? (
          <Button size="sm" variant="accent" onClick={() => setReviewOpen(true)}>
            <LifeBuoy className="size-4" /> Demander un réexamen
          </Button>
        ) : null}
        <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>
          <Pencil className="size-4" /> Modifier
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-destructive hover:bg-destructive/10"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="size-4" /> Supprimer
        </Button>
      </div>

      <SessionFormDialog open={editOpen} onClose={() => setEditOpen(false)} session={session} />

      <SessionReviewRequestDialog
        sessionId={reviewOpen ? session.id : null}
        sessionTitle={session.title}
        onClose={() => setReviewOpen(false)}
      />

      <ConfirmDelete
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Supprimer "${session.title}" ?`}
        onConfirm={() =>
          deleteMutation.mutate(session.id, {
            onSuccess: () => {
              toast.success("Session supprimée.");
              onDeleted();
            },
            onError: (e) => toast.error(e.message),
          })
        }
      />
    </>
  );
}