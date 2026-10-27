import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { APIInstructorStudentListItem } from "@/data/students";
import { StudentRow } from "./Row";

export function StudentsTable({ students }: { students: APIInstructorStudentListItem[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border/70 bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Apprenant</TableHead>
            <TableHead>Formations</TableHead>
            <TableHead>Progression moyenne</TableHead>
            <TableHead>Dernière activité</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((s) => (
            <StudentRow key={s.studentId} student={s} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}