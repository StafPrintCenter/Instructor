import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ContentStatusBadge } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { APIInstructorLesson, APIInstructorModule } from "@/data/content";
import { formatDate } from "@/lib/api";
import { DeleteModuleConfirm, SubmitModuleConfirm } from "./ConfirmDialogs";
import { EditModuleDialog } from "./EditDialog";
import { ModuleActions } from "./Actions";
import { ModuleLessons } from "./Lessons";

interface ModuleCardProps {
  trainingId: string;
  module: APIInstructorModule;
  /** Position dans la liste (affichée à partir de 1) */
  index: number;
  lessons: APIInstructorLesson[];
  isLessonsLoading: boolean;
}

export function ModuleCard({ trainingId, module: m, index, lessons, isLessonsLoading }: ModuleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <Card className="border-border/70 shadow-sm transition-all hover:border-border">
        <CardHeader className="flex flex-row items-start justify-between gap-3 py-4">
          <button
            type="button"
            onClick={() => setIsExpanded((v) => !v)}
            className="flex flex-1 items-start gap-2.5 text-left"
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <ChevronDown className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform" />
            ) : (
              <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform" />
            )}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="font-display text-lg">{index + 1}. {m.title}</CardTitle>
                <ContentStatusBadge status={m.status} />
              </div>
              <p className="text-xs text-muted-foreground">
                {m.lessonsCount} leçon{m.lessonsCount > 1 ? "s" : ""} · ordre {m.sortOrder} · créé le {formatDate(m.createdAt)}
              </p>
            </div>
          </button>

          <ModuleActions
            onEdit={() => setEditOpen(true)}
            onSubmit={() => setSubmitOpen(true)}
            onDelete={() => setDeleteOpen(true)}
          />
        </CardHeader>

        {isExpanded ? (
          <CardContent className="space-y-2.5 pt-0">
            <ModuleLessons moduleId={m.id} lessons={lessons} isLoading={isLessonsLoading} />
          </CardContent>
        ) : null}
      </Card>

      <EditModuleDialog trainingId={trainingId} module={editOpen ? m : null} onClose={() => setEditOpen(false)} />
      <SubmitModuleConfirm trainingId={trainingId} module={m} open={submitOpen} onOpenChange={setSubmitOpen} />
      <DeleteModuleConfirm trainingId={trainingId} module={m} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </>
  );
}