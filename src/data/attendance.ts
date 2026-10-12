export type AttendanceStatus = "present" | "late" | "absent" | "excused";

export const ATTENDANCE_STATUSES: AttendanceStatus[] = ["present", "late", "absent", "excused"];

export const attendanceStatusLabels: Record<AttendanceStatus, string> = {
  present: "Présent",
  late: "En retard",
  absent: "Absent",
  excused: "Excusé",
};

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