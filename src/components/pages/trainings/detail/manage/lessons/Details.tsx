import { BookOpen, ExternalLink, Sparkles } from "lucide-react";
import { getYoutubeEmbedUrl, type APIInstructorLesson } from "@/data/content";

export function hasLessonDetails(l: APIInstructorLesson): boolean {
  return Boolean(l.content || l.brief || l.videoUrl || (l.chapters && l.chapters.length > 0));
}

/** Détails déroulants d'une leçon : vidéo, contenu, résumé, chapitres */
export function LessonDetails({ lesson: l }: { lesson: APIInstructorLesson }) {
  const embedUrl = l.videoUrl ? getYoutubeEmbedUrl(l.videoUrl) : null;

  return (
    <div className="space-y-4 border-t border-border/40 bg-background/50 p-4 rounded-b-xl text-sm">
      {embedUrl ? (
        <div className="overflow-hidden rounded-lg border border-border/60 shadow-sm aspect-video w-full max-w-2xl mx-auto">
          <iframe src={embedUrl} title={l.title} className="h-full w-full" allowFullScreen />
        </div>
      ) : l.videoUrl ? (
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-muted-foreground">Lien vidéo :</span>
          <a
            href={l.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
          >
            Ouvrir la vidéo dans un nouvel onglet <ExternalLink className="size-3" />
          </a>
        </div>
      ) : null}

      {l.content ? (
        <div className="rounded-lg border border-border/40 bg-card p-3.5 space-y-1.5">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <BookOpen className="size-3.5" /> Contenu
          </p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{l.content}</p>
        </div>
      ) : null}

      {l.brief ? (
        <div className="rounded-lg border border-border/40 bg-card p-3.5 space-y-1.5">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="size-3.5" /> Résumé
          </p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{l.brief}</p>
        </div>
      ) : null}

      {l.chapters && l.chapters.length > 0 ? (
        <div className="rounded-lg border border-border/40 bg-card p-3.5 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Chapitres</p>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {l.chapters.map((c, i) => (
              <li key={i} className="flex items-center gap-2 rounded-md bg-muted/40 px-2.5 py-1.5 text-xs text-foreground/90">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                  {i + 1}
                </span>
                <span className="truncate">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}