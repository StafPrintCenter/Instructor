import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { APICommunityPostDetail } from "@/data/community";
import { COMMUNITY_LIMITS } from "@/data/community";
import { AttachmentsInput, PostMainFields, PostMetaFields, TagsInput, usePostForm } from ".";

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

      {values.type === "poll" ? (
        <div className="space-y-3">
          <div>
            <Label>Options du sondage</Label>
            <p className="text-[11px] text-muted-foreground">
              Entre {COMMUNITY_LIMITS.pollMinOptions} et {COMMUNITY_LIMITS.pollMaxOptions} options distinctes.
            </p>
          </div>
          {values.options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={option}
                maxLength={COMMUNITY_LIMITS.pollOptionMax}
                disabled={!!post?.poll && post.poll.totalVotes > 0}
                placeholder={`Option ${index + 1}`}
                onChange={(event) => {
                  const options = [...values.options];
                  options[index] = event.target.value;
                  setField("options", options);
                }}
              />
              {values.options.length > COMMUNITY_LIMITS.pollMinOptions ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!!post?.poll && post.poll.totalVotes > 0}
                  onClick={() => setField("options", values.options.filter((_, optionIndex) => optionIndex !== index))}
                >
                  Retirer
                </Button>
              ) : null}
            </div>
          ))}
          {values.options.length < COMMUNITY_LIMITS.pollMaxOptions ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!!post?.poll && post.poll.totalVotes > 0}
              onClick={() => setField("options", [...values.options, ""])}
            >
              Ajouter une option
            </Button>
          ) : null}
          {errors.options ? <p className="text-xs text-destructive">{errors.options}</p> : null}
          {!!post?.poll && post.poll.totalVotes > 0 ? (
            <p className="text-xs text-muted-foreground">Les options ne peuvent plus être modifiées après le premier vote.</p>
          ) : null}
        </div>
      ) : null}

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