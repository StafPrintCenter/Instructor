import type { ElementType } from "react";
import { BookOpen, Dumbbell, FileCheck, FolderKanban, HelpCircle, Video } from "lucide-react";
import type { InstructorLessonPayload, LessonKind } from "@/data/content";

/** Kinds pour lesquels le chapitrage est proposé - quiz/exercise/assignment/project n'en ont pas besoin. */
export const CHAPTERS_ALLOWED_KINDS: LessonKind[] = ["video", "reading"];
export const BRIEF_KINDS: LessonKind[] = ["exercise", "assignment", "project", "quiz"];
/** Kinds pour lesquels une évaluation (quiz/exercice avec questions) peut être configurée. */
export const QUIZ_ALLOWED_KINDS: LessonKind[] = ["quiz", "exercise"];

/** Icônes associées au type de leçon */
export const LESSON_KIND_ICONS: Record<LessonKind, ElementType> = {
  video: Video,
  reading: BookOpen,
  quiz: HelpCircle,
  exercise: Dumbbell,
  assignment: FileCheck,
  project: FolderKanban,
};

export interface LessonFormValues {
  title: string;
  duration_minutes: number;
  kind: LessonKind;
  video_url: string;
  content: string;
  brief: string;
  is_mandatory: boolean;
  chapters: string[];
}

export const emptyLesson: LessonFormValues = {
  title: "",
  duration_minutes: 15,
  kind: "video",
  video_url: "",
  content: "",
  brief: "",
  is_mandatory: true,
  chapters: [],
};

/** Valeurs du formulaire → payload API : seuls les champs pertinents pour le type de leçon sont envoyés */
export function toLessonPayload(values: LessonFormValues, sortOrder?: number): InstructorLessonPayload {
  const { kind } = values;

  return {
    title: values.title,
    ...(sortOrder !== undefined ? { sort_order: sortOrder } : {}),
    duration_minutes: values.duration_minutes,
    kind,
    is_mandatory: values.is_mandatory,
    video_url: kind === "video" ? values.video_url : undefined,
    content: kind === "reading" ? values.content : undefined,
    brief: BRIEF_KINDS.includes(kind) ? values.brief : undefined,
    chapters: CHAPTERS_ALLOWED_KINDS.includes(kind) && values.chapters.length > 0 ? values.chapters : undefined,
  };
}