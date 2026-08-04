import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { postsQuery, threadsQuery, trainingsQuery } from "@/lib/queries";
import { getSessionInstructorId, useInstructorAuth } from "@/lib/instructor-auth";
import { communityApi, formatDateTime, initials, relativeTime } from "@/lib/api";

export const Route = createFileRoute("/_instructor/communaute")({
  head: () => ({
    meta: [
      { title: "Communauté & messagerie — STAF PRINT CENTER" },
      {
        name: "description",
        content: "Publiez des annonces à vos cohortes et répondez aux messages privés de vos apprenants.",
      },
      { property: "og:title", content: "Communauté & messagerie — STAF PRINT CENTER" },
      { property: "og:description", content: "Annonces épinglées et conversations avec les apprenants." },
    ],
  }),
  loader: ({ context }) => {
    const id = getSessionInstructorId();
    return Promise.all([
      context.queryClient.ensureQueryData(postsQuery(id)),
      context.queryClient.ensureQueryData(threadsQuery(id)),
      context.queryClient.ensureQueryData(trainingsQuery(id)),
    ]);
  },
  component: CommunityPage,
});

function CommunityPage() {
  const { instructorId } = useInstructorAuth();
  const queryClient = useQueryClient();
  const { data: posts } = useSuspenseQuery(postsQuery(instructorId));
  const { data: threads } = useSuspenseQuery(threadsQuery(instructorId));
  const { data: trainings } = useSuspenseQuery(trainingsQuery(instructorId));

  const [body, setBody] = useState("");
  const [pinned, setPinned] = useState(false);
  const [trainingId, setTrainingId] = useState(trainings[0]?.id ?? "");
  const [activeThread, setActiveThread] = useState(threads[0]?.id ?? "");
  const [reply, setReply] = useState("");

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

  const sendReply = useMutation({
    mutationFn: () => communityApi.reply(activeThread, reply),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community"] });
      setReply("");
      toast.success("Réponse envoyée.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const thread = threads.find((t) => t.id === activeThread) ?? threads[0];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Échanges"
        title="Communauté & messagerie"
        description="Animez vos cohortes et répondez individuellement aux apprenants."
      />

      <Tabs defaultValue="feed">
        <TabsList>
          <TabsTrigger value="feed">Fil de la communauté</TabsTrigger>
          <TabsTrigger value="messages">
            Messages {threads.filter((t) => t.unread).length > 0 ? `(${threads.filter((t) => t.unread).length})` : ""}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="mt-4 space-y-5">
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
        </TabsContent>

        <TabsContent value="messages" className="mt-4">
          {threads.length === 0 ? (
            <EmptyState icon={<MessagesSquare className="size-6" />} title="Aucune conversation" />
          ) : (
            <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
              <Card>
                <CardContent className="space-y-1 p-2">
                  {threads.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActiveThread(t.id)}
                      className={`w-full rounded-lg px-3 py-2.5 text-left transition-colors ${
                        thread?.id === t.id ? "bg-secondary" : "hover:bg-secondary/60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium">{t.student.full_name}</span>
                        {t.unread ? <span className="size-2 shrink-0 rounded-full bg-accent" /> : null}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{t.subject}</p>
                      <p className="text-[11px] text-muted-foreground">{relativeTime(t.updated_at)}</p>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {thread ? (
                <Card>
                  <CardContent className="flex flex-col gap-4 p-5">
                    <div>
                      <h2 className="font-display text-lg">{thread.subject}</h2>
                      <p className="text-xs text-muted-foreground">Avec {thread.student.full_name}</p>
                    </div>
                    <div className="space-y-3">
                      {thread.messages.map((m) => (
                        <div
                          key={m.id}
                          className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${
                            m.author === "instructor"
                              ? "ml-auto bg-primary text-primary-foreground"
                              : "bg-secondary"
                          }`}
                        >
                          <p>{m.body}</p>
                          <p
                            className={`mt-1 text-[11px] ${
                              m.author === "instructor" ? "text-primary-foreground/70" : "text-muted-foreground"
                            }`}
                          >
                            {formatDateTime(m.sent_at)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 border-t border-border/70 pt-4">
                      <Textarea
                        placeholder="Écrire une réponse…"
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        className="min-h-[42px]"
                      />
                      <Button
                        variant="accent"
                        disabled={sendReply.isPending || !reply.trim()}
                        onClick={() => sendReply.mutate()}
                      >
                        <Send className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
