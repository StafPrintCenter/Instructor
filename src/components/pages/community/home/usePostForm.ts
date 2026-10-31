import { useState } from "react";
import { toast } from "sonner";
import type { APICommunityPostDetail } from "@/data/community";
import { useCreateCommunityPost, useUpdateCommunityPost } from "@/stores/useCommunityStore";
import { buildCreatePayload, buildUpdatePayload } from "./postFormPayload";
import {
  buildInitialPostValues,
  getPostFormErrors,
  postFormSchema,
  type PostFormValues,
  type SetPostField,
} from "./postFormSchema";

interface UsePostFormArgs {
  /** Publication à modifier (détail complet) ; null = création */
  post: APICommunityPostDetail | null;
  onClose: () => void;
}

export function usePostForm({ post, onClose }: UsePostFormArgs) {
  const isEdit = !!post;
  const createMutation = useCreateCommunityPost();
  const updateMutation = useUpdateCommunityPost();

  const [values, setValues] = useState<PostFormValues>(() => buildInitialPostValues(post));
  const [attachments, setAttachments] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField: SetPostField = (key, value) => setValues((v) => ({ ...v, [key]: value }));

  const submit = () => {
    const parsed = postFormSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(getPostFormErrors(parsed.error));
      return;
    }
    setErrors({});

    if (!post) {
      createMutation.mutate(buildCreatePayload(parsed.data, attachments), {
        onSuccess: () => {
          toast.success("Publication créée.");
          onClose();
        },
        onError: (e) => toast.error(e.message),
      });
      return;
    }

    const payload = buildUpdatePayload(parsed.data, post);
    if (!payload) {
      toast.info("Aucune modification à enregistrer.");
      onClose();
      return;
    }

    updateMutation.mutate(
      { id: post.id, payload },
      {
        onSuccess: () => {
          toast.success("Publication modifiée.");
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
    attachments,
    setAttachments,
    submit,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}