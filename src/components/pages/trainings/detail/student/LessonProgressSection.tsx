import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { APIInstructorStudentLessonProgress } from "@/data/training-students";
import { FollowUpCard } from "./FollowUpCard";
import { LessonProgressRow } from "./LessonProgressRow";

export function LessonProgressSection({ lessons }: { lessons: APIInstructorStudentLessonProgress[] }) {
  return (
    <FollowUpCard title={`Progression par leçon (${lessons.length})`}>
      {lessons.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune activité enregistrée.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Leçon</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Avancement</TableHead>
                <TableHead>Meilleur score</TableHead>
                <TableHead>Dernière activité</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lessons.map((l) => (
                <LessonProgressRow key={l.lessonId} lesson={l} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </FollowUpCard>
  );
}