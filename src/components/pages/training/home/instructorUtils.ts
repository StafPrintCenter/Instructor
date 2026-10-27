import type { InstructorTrainingRole } from "@/data/trainings";

interface SortableInstructor {
  name: string;
  role: InstructorTrainingRole;
  isMe: boolean;
}

const ROLE_ORDER: Record<InstructorTrainingRole, number> = { lead: 0, assistant: 1 };

/** Vous d'abord, puis les formateurs principaux, puis les assistants, puis ordre alphabétique */
export function sortTrainingInstructors<T extends SortableInstructor>(instructors: T[]): T[] {
  return [...instructors].sort((a, b) => {
    if (a.isMe !== b.isMe) return a.isMe ? -1 : 1;
    if (a.role !== b.role) return (ROLE_ORDER[a.role] ?? 9) - (ROLE_ORDER[b.role] ?? 9);
    return a.name.localeCompare(b.name, "fr");
  });
}

export function getInitials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "FO"
  );
}