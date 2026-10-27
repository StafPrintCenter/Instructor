import { Link } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TableCell, TableRow } from "@/components/ui/table";
import type { APIInstructorStudentListItem } from "@/data/students";
import { formatDateTime } from "@/lib/date-time";
import { StudentIdentity } from "./StudentIdentity";
import { StudentTrainingLinks } from "./StudentTrainingLinks";

export function StudentRow({ student: s }: { student: APIInstructorStudentListItem }) {
  return (
    <TableRow>
      <TableCell>
        <StudentIdentity student={s} />
      </TableCell>

      <TableCell className="min-w-72">
        <StudentTrainingLinks student={s} />
      </TableCell>

      <TableCell className="min-w-36">
        <div className="space-y-1.5">
          <span className="text-xs font-medium">{s.averageProgress}%</span>
          <Progress value={s.averageProgress} className="h-1.5" />
        </div>
      </TableCell>

      <TableCell className="text-xs text-muted-foreground">
        {s.lastActivityAt ? formatDateTime(s.lastActivityAt) : "Aucune activité"}
      </TableCell>

      <TableCell className="text-right">
        <Button asChild size="sm" variant="soft">
          <Link to="/students/$studentId" params={{ studentId: s.studentId }}>
            <Eye className="size-4" /> Voir le profil
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}