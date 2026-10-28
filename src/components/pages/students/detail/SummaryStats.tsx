import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { APIInstructorStudentProfile } from "@/data/students";

interface StudentSummaryStatsProps {
  student: APIInstructorStudentProfile;
  toReview: number;
  averageAttendance: number | null;
}

export function StudentSummaryStats({ student, toReview, averageAttendance }: StudentSummaryStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border-border/70">
        <CardContent className="p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Formations</p>
          <p className="mt-1 font-display text-2xl font-semibold">{student.trainingsCount}</p>
          <p className="text-xs text-muted-foreground">suivies avec vous</p>
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardContent className="space-y-2 p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Progression moyenne</p>
          <p className="font-display text-2xl font-semibold">{student.averageProgress}%</p>
          <Progress value={student.averageProgress} />
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardContent className="space-y-2 p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Assiduité moyenne</p>
          {averageAttendance !== null ? (
            <>
              <p className="font-display text-2xl font-semibold">{averageAttendance}%</p>
              <Progress value={averageAttendance} />
            </>
          ) : (
            <p className="pt-1 text-sm text-muted-foreground">Aucune séance renseignée</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardContent className="p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Travaux à traiter</p>
          <p className="mt-1 font-display text-2xl font-semibold">{toReview}</p>
          <p className="text-xs text-muted-foreground">en attente de notation</p>
        </CardContent>
      </Card>
    </div>
  );
}