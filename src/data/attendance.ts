export type AttendanceStatus = "present" | "late" | "absent" | "excused";

export const ATTENDANCE_STATUSES: AttendanceStatus[] = ["present", "late", "absent", "excused"];

export const attendanceStatusLabels: Record<AttendanceStatus, string> = {
  present: "Présent",
  late: "En retard",
  absent: "Absent",
  excused: "Excusé",
};

export function getAttendanceStatusLabel(status: string | null | undefined): string {
  if (!status) return "-";
  return attendanceStatusLabels[status as AttendanceStatus] ?? status;
}

export function getAttendanceStatusBadgeClass(status: string | null | undefined): string {
  switch (status) {
    case "present":
      return "bg-success/15 text-success border-success/30";
    case "late":
      return "bg-accent/20 text-accent-foreground border-accent/40";
    case "absent":
      return "bg-destructive/12 text-destructive border-destructive/30";
    case "excused":
      return "bg-info/15 text-info border-info/30";
    default:
      return "bg-muted text-muted-foreground border-transparent";
  }
}

/** POST /instructor/enrollments/{enrollmentId}/attendance/mark */
export interface APIInstructorAttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
}

export interface InstructorAttendancePayload {
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
}