import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COMMUNITY_POST_TYPES, communityPostTypeLabels, type APICommunityPostDetail, type CommunityPostType } from "@/data/community";
import { useCommunityCategories } from "@/stores/useCommunityStore";
import { useInstructorTrainingsList } from "@/stores/useTrainingsStore";
import { FieldError, GENERAL_AUDIENCE, type PostFieldsProps } from "../../home";

interface PostMetaFieldsProps extends PostFieldsProps {
  /** Publication en cours de modification ; null = création */
  post: APICommunityPostDetail | null;
}

export function PostMetaFields({ post, values, errors, setField }: PostMetaFieldsProps) {
  const isEdit = !!post;
  const { categories } = useCommunityCategories();
  const { items: trainings } = useInstructorTrainingsList({ perPage: 100 });

  // La catégorie actuelle d'une publication peut ne plus être active : on la garde sélectionnable
  const hasCurrentCategory = !post || categories.some((c) => c.id === post.category.id);
  const isTrainingAnnouncement = values.type === "announcement" && values.audience !== GENERAL_AUDIENCE;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Catégorie</Label>
          <Select value={values.categoryId} onValueChange={(v) => setField("categoryId", v)}>
            <SelectTrigger><SelectValue placeholder="Choisir une catégorie" /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  <span className="inline-flex items-center gap-2">
                    <span className="size-2 rounded-full" style={{ backgroundColor: c.color }} />
                    {c.name}
                  </span>
                </SelectItem>
              ))}
              {!hasCurrentCategory && post ? (
                <SelectItem value={post.category.id}>{post.category.name}</SelectItem>
              ) : null}
            </SelectContent>
          </Select>
          <FieldError message={errors.categoryId} />
        </div>

        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={values.type} onValueChange={(v) => setField("type", v as CommunityPostType)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {COMMUNITY_POST_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{communityPostTypeLabels[t]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isTrainingAnnouncement ? (
            <p className="text-[11px] text-muted-foreground">Les membres de la formation seront notifiés.</p>
          ) : null}
        </div>
      </div>

      {isEdit ? (
        <p className="rounded-lg border border-dashed p-3 text-xs text-muted-foreground">
          Publiée dans : <span className="font-medium text-foreground">{post.training?.title ?? "Communauté générale"}</span>.
          La formation et les pièces jointes ne peuvent plus être modifiées après la publication.
        </p>
      ) : (
        <div className="space-y-2">
          <Label>Publier dans</Label>
          <Select value={values.audience} onValueChange={(v) => setField("audience", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={GENERAL_AUDIENCE}>Communauté générale</SelectItem>
              {trainings.map((t) => (
                <SelectItem key={t.trainingId} value={t.trainingId}>{t.trainingTitle}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[11px] text-muted-foreground">
            Vous pouvez publier dans la communauté générale ou dans les formations où vous êtes assigné·e.
          </p>
        </div>
      )}
    </div>
  );
}