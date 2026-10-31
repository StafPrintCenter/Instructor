import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditPostLoader, PostForm } from "../../home";

interface PostFormDialogProps {
  open: boolean;
  onClose: () => void;
  /** Identifiant de la publication à modifier ; absent = création */
  postId?: string | null;
}

export function PostFormDialog({ open, onClose, postId }: PostFormDialogProps) {
  const isEdit = !!postId;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEdit ? "Modifier la publication" : "Nouvelle publication"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Seuls les champs modifiés sont envoyés."
              : "Partagez une question, une ressource ou une annonce avec la communauté."}
          </DialogDescription>
        </DialogHeader>

        {isEdit ? <EditPostLoader postId={postId} onClose={onClose} /> : <PostForm post={null} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}