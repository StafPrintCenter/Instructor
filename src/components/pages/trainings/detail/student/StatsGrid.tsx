import type { APIInstructorTrainingStudentDetail } from "@/data/training-students";
import { StudentAttendanceCard, StudentEnrollmentCard, StudentPaymentCard, StudentProgressCard } from "./";

interface StudentStatsGridProps {
  student: APIInstructorTrainingStudentDetail;
  attendanceRatio: number | null;
}

export function StudentStatsGrid({ student, attendanceRatio }: StudentStatsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StudentProgressCard progress={student.progress} />
      <StudentAttendanceCard ratio={attendanceRatio} />
      <StudentPaymentCard paymentStatus={student.paymentStatus} amountPaid={student.amountPaid} />
      <StudentEnrollmentCard status={student.status} enrolledAt={student.enrolledAt} completedAt={student.completedAt} />
    </div>
  );
}