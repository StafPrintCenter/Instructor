import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import type { APIInstructorStudentListItem } from "@/data/students";
import { getEnrollmentStatusBadgeClass, getEnrollmentStatusLabel } from "@/data/training-students";
import { getPaymentStatusBadgeClass, getPaymentStatusLabel } from "@/data/trainings";
import { cn } from "@/lib/utils";

export function StudentTrainingLinks({ student: s }: { student: APIInstructorStudentListItem }) {
  return (
    <div className="space-y-1.5">
      {s.trainings.map((t) => (
        <Link
          key={t.enrollmentId}
          to="/trainings/$trainingId/students/$studentId"
          params={{ trainingId: t.trainingId, studentId: s.studentId }}
          className="block space-y-1.5 rounded-md border border-border/60 px-2.5 py-2 text-xs transition-colors hover:bg-card/80 hover:border-primary"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="truncate font-medium">{t.trainingTitle}</span>
            <span className="shrink-0 font-semibold">{t.progress}%</span>
          </div>
          <div className="flex flex-wrap gap-1">
            <Badge
              variant="outline"
              className={cn("border px-1.5 py-0 text-[10px] font-medium", getEnrollmentStatusBadgeClass(t.status))}
            >
              {getEnrollmentStatusLabel(t.status)}
            </Badge>
            <Badge
              variant="outline"
              className={cn("border px-1.5 py-0 text-[10px] font-medium", getPaymentStatusBadgeClass(t.paymentStatus))}
            >
              {getPaymentStatusLabel(t.paymentStatus)}
            </Badge>
          </div>
        </Link>
      ))}
    </div>
  );
}