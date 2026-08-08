import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessagesSquare, Pin, Send } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, EmptyState } from "@/components/instructor/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { postsQuery, trainingsQuery } from "@/lib/queries";
import { useInstructorAuth } from "@/hooks/useInstructorAuth";
import { communityApi, initials, relativeTime } from "@/lib/api";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/community/")({
  head: () => ({
    meta: [
      { title: `Communauté | ${SITE.name}` },
      {
        name: "description",
        content: "Publiez des annonces et échangez avec vos cohortes.",
      },
      { property: "og:title", content: `Communauté | ${SITE.name}` },
      { property: "og:description", content: "Fil d'actualité et annonces de formation." },
    ],
  }),
  component: CommunityPage,
});

function CommunityPage() {
  const { user } = useInstructorAuth();
  const instructorId = user?.id ?? "";
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading: isPostsLoading } = useQuery({
    ...postsQuery(instructorId),
    enabled: !!instructorId,
  });

  const { data: trainings = [], isLoading: isTrainingsLoading } = useQuery({
    ...trainingsQuery(instructorId),
    enabled: !!instructorId,
  });

  const [body, setBody] = useState("");
  const [pinned, setPinned] = useState(false);
  const [trainingId, setTrainingId] = useState("");

  useEffect(() => {
    if (trainings.length > 0 && !trainingId) {
      setTrainingId(trainings[0].id);
    }
  }, [trainings, trainingId]);

  const publish = useMutation({
    mutationFn: () => communityApi.publish({ instructorId, trainingId, body, pinned }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community"] });
      setBody("");
      setPinned(false);
      toast.success("Publication envoyée à la cohorte.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const togglePin = useMutation({
    mutationFn: (postId: string) => communityApi.togglePin(postId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["community"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  if (isPostsLoading || isTrainingsLoading) {
    return (
      <div className="space-y-6">
        <div className="h-16 animate-pulse rounded-lg bg-muted" />
        <div className="h-40 animate-pulse rounded-lg bg-muted" />
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Échanges"
        title="Communauté"
        description="Animez vos cohortes et partagez des actualités ou consignes."
      />

      <div className="space-y-5">
        <Card>
          <CardContent className="space-y-3 p-5">
            <Select value={trainingId} onValueChange={setTrainingId}>
              <SelectTrigger className="sm:w-72">
                <SelectValue placeholder="Cohorte destinataire" />
              </SelectTrigger>
              <SelectContent>
                {trainings.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Partagez une annonce, une ressource ou un rappel…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-24"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Switch id="pin" checked={pinned} onCheckedChange={setPinned} />
                <Label htmlFor="pin" className="text-sm text-muted-foreground">
                  Épingler en haut du fil
                </Label>
              </div>
              <Button
                variant="accent"
                disabled={publish.isPending || !body.trim() || !trainingId}
                onClick={() => publish.mutate()}
              >
                <Send className="size-4" /> Publier
              </Button>
            </div>
          </CardContent>
        </Card>

        {posts.length === 0 ? (
          <EmptyState icon={<MessagesSquare className="size-6" />} title="Le fil est vide" />
        ) : (
          posts.map((p) => (
            <Card key={p.id} className={p.pinned ? "border-accent/40" : undefined}>
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-secondary text-xs">
                        {initials(p.author_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{p.author_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.author_role === "instructor" ? "Formateur" : "Apprenant"} · {relativeTime(p.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.pinned ? (
                      <Badge variant="outline" className="border-accent/40 bg-accent/20 text-accent-foreground">
                        Épinglé
                      </Badge>
                    ) : null}
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Épingler"
                      onClick={() => togglePin.mutate(p.id)}
                    >
                      <Pin className="size-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm">{p.body}</p>
                <p className="text-xs text-muted-foreground">{p.replies_count} réponse(s)</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
