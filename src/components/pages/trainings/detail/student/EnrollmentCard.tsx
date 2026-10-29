import { Card, CardContent } from "@/components/ui/card";
import { getEnrollmentStatusLabel, type EnrollmentStatus } from "@/data/training-students";
import { formatDate } from "@/lib/date-time";

interface StudentEnrollmentCardProps {
  status: EnrollmentStatus;
  enrolledAt: string;
  completedAt: string | null;
}

export function StudentEnrollmentCard({ status, enrolledAt, completedAt }: StudentEnrollmentCardProps) {
  return (
    <Card className="border-border/70">
      <CardContent className="space-y-1 p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Inscription</p>
        <p className="text-sm font-medium">{getEnrollmentStatusLabel(status)}</p>
        <p className="text-xs text-muted-foreground">Inscrit le {formatDate(enrolledAt)}</p>
        {completedAt ? <p className="text-xs text-muted-foreground">Terminée le {formatDate(completedAt)}</p> : null}
      </CardContent>
    </Card>
  );
}