import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import type { APICommunityPostDetail } from "@/data/community";
import { AttachmentsInput, PostMainFields, PostMetaFields, TagsInput, usePostForm } from "./";

interface PostFormProps {
  /** Publication à modifier (détail complet) ; null = création */
  post: APICommunityPostDetail | null;
  onClose: () => void;
}

export function PostForm({ post, onClose }: PostFormProps) {
  const { isEdit, values, errors, setField, attachments, setAttachments, submit, isPending } = usePostForm({
    post,
    onClose,
  });
  const fields = { values, errors, setField };

  return (
    <div className="space-y-5">
      <PostMainFields {...fields} />
      <PostMetaFields post={post} {...fields} />

      <TagsInput
        tags={values.tags}
        onChange={(tags) => setField("tags", tags)}
        error={errors.tags}
        note={isEdit ? "Les tags d'une publication existante peuvent être remplacés, mais pas tous retirés." : undefined}
      />

      {!isEdit ? <AttachmentsInput files={attachments} onChange={setAttachments} /> : null}

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Annuler</Button>
        <Button variant="accent" disabled={isPending} onClick={submit}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          {isEdit ? "Enregistrer" : "Publier"}
        </Button>
      </DialogFooter>
    </div>
  );
}