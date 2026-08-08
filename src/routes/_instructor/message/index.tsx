import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessagesSquare, Send } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, EmptyState } from "@/components/instructor/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { threadsQuery } from "@/lib/queries";
import { useInstructorAuth } from "@/hooks/useInstructorAuth";
import { communityApi, formatDateTime, relativeTime } from "@/lib/api";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/message/")({
  head: () => ({
    meta: [
      { title: `Messagerie privée | ${SITE.name}` },
      {
        name: "description",
        content: "Répondez aux messages privés de vos apprenants.",
      },
      { property: "og:title", content: `Messagerie privée | ${SITE.name}` },
      { property: "og:description", content: "Conversations directes avec les apprenants." },
    ],
  }),
  component: MessagesPage,
});

function MessagesPage() {
  const { user } = useInstructorAuth();
  const instructorId = user?.id ?? "";
  const queryClient = useQueryClient();

  const { data: threads = [], isLoading: isThreadsLoading } = useQuery({
    ...threadsQuery(instructorId),
    enabled: !!instructorId,
  });

  const [activeThread, setActiveThread] = useState("");
  const [reply, setReply] = useState("");

  useEffect(() => {
    if (threads.length > 0 && !activeThread) {
      setActiveThread(threads[0].id);
    }
  }, [threads, activeThread]);

  const sendReply = useMutation({
    mutationFn: () => communityApi.reply(activeThread, reply),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community"] });
      setReply("");
      toast.success("Réponse envoyée.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isThreadsLoading) {
    return (
      <div className="space-y-6">
        <div className="h-16 animate-pulse rounded-lg bg-muted" />
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  const thread = threads.find((t) => t.id === activeThread) ?? threads[0];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Échanges"
        title="Messagerie privée"
        description="Répondez individuellement aux questions de vos apprenants."
      />

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
                  className={`w-full rounded-lg px-3 py-2.5 text-left transition-colors ${thread?.id === t.id ? "bg-secondary" : "hover:bg-secondary/60"
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
                      className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${m.author === "instructor"
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "bg-secondary"
                        }`}
                    >
                      <p>{m.body}</p>
                      <p
                        className={`mt-1 text-[11px] ${m.author === "instructor" ? "text-primary-foreground/70" : "text-muted-foreground"
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
                    className="min-h-10.5"
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
    </div>
  );
}
