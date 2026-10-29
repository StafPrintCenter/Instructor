import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { APIInstructorTrainingStudentDetail } from "@/data/training-students";
import { getEnrollmentStatusLabel } from "@/data/training-students";
import { getPaymentStatusBadgeClass, getPaymentStatusLabel } from "@/data/trainings";
import { formatDate } from "@/lib/date-time";
import { cn } from "@/lib/utils";

interface StudentStatsGridProps {
  student: APIInstructorTrainingStudentDetail;
  attendanceRatio: number | null;
}

export function StudentStatsGrid({ student, attendanceRatio }: StudentStatsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border-border/70">
        <CardContent className="space-y-2 p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Progression</p>
          <p className="font-display text-2xl font-semibold">{student.progress}%</p>
          <Progress value={student.progress} />
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardContent className="space-y-2 p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Assiduité</p>
          {attendanceRatio !== null ? (
            <>
              <p className="font-display text-2xl font-semibold">{attendanceRatio}%</p>
              <Progress value={attendanceRatio} />
            </>
          ) : (
            <p className="pt-1 text-sm text-muted-foreground">Aucune séance renseignée</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardContent className="space-y-2 p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Paiement</p>
          <Badge variant="outline" className={cn("border font-medium", getPaymentStatusBadgeClass(student.paymentStatus))}>
            {getPaymentStatusLabel(student.paymentStatus)}
          </Badge>
          <p className="text-sm font-medium">{student.amountPaid.toLocaleString("fr-FR")} FCFA versés</p>
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardContent className="space-y-1 p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Inscription</p>
          <p className="text-sm font-medium">{getEnrollmentStatusLabel(student.status)}</p>
          <p className="text-xs text-muted-foreground">Inscrit le {formatDate(student.enrolledAt)}</p>
          {student.completedAt ? <p className="text-xs text-muted-foreground">Terminée le {formatDate(student.completedAt)}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}