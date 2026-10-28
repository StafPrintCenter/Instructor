import { BookOpen, ChevronDown, ChevronRight, Clock } from "lucide-react";
import { ContentStatusBadge } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { lessonKindLabels, type APIInstructorLesson } from "@/data/content";
import { LessonActions } from "./Actions";
import { LessonDetails, hasLessonDetails } from "./Details";
import { LESSON_KIND_ICONS } from "./Config";

interface LessonRowProps {
  lesson: APIInstructorLesson;
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onSubmit: () => void;
  onDelete: () => void;
  onManageQuiz?: () => void;
}

export function LessonRow({ lesson: l, isOpen, onToggle, onEdit, onSubmit, onDelete, onManageQuiz }: LessonRowProps) {
  const hasDetails = hasLessonDetails(l);
  const KindIcon = LESSON_KIND_ICONS[l.kind] || BookOpen;

  return (
    <div
      className={`group rounded-xl border transition-all duration-200 ${isOpen
        ? "border-primary/30 bg-muted/20 shadow-sm"
        : "border-border/60 bg-card hover:border-border hover:bg-muted/10"
        }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-3.5 py-3">
        <button
          type="button"
          onClick={onToggle}
          disabled={!hasDetails}
          className="flex flex-1 items-center gap-3 text-left disabled:cursor-default"
        >
          {/* Indicateur de développement */}
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted/60 text-muted-foreground transition-colors group-hover:bg-muted">
            {hasDetails ? (
              isOpen ? (
                <ChevronDown className="size-4 text-foreground" />
              ) : (
                <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground" />
              )
            ) : (
              <span className="size-1.5 rounded-full bg-muted-foreground/40" />
            )}
          </div>

          {/* Icône du type de leçon */}
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <KindIcon className="size-4" />
          </div>

          {/* Titre & Badges */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-semibold tracking-tight text-foreground">{l.title}</span>
              {l.isMandatory ? (
                <Badge
                  variant="outline"
                  className="h-4 shrink-0 rounded-sm border-amber-500/30 bg-amber-500/10 text-[9px] font-medium text-amber-600 dark:text-amber-400 px-1"
                >
                  Obligatoire
                </Badge>
              ) : null}
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
              <span>{lessonKindLabels[l.kind]}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="size-3" /> {l.durationMinutes ?? "-"} min
              </span>
            </div>
          </div>

          <ContentStatusBadge status={l.status} className="shrink-0" />
        </button>

        <LessonActions
          hasQuiz={!!l.quizId}
          onManageQuiz={onManageQuiz}
          onEdit={onEdit}
          onSubmit={onSubmit}
          onDelete={onDelete}
        />
      </div>

      {isOpen && hasDetails ? <LessonDetails lesson={l} /> : null}
    </div>
  );
}