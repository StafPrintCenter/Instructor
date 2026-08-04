/**
 * Domain types for the STAF PRINT CENTER instructor workspace.
 * Mirrors the future Laravel REST API payloads (snake_case fields kept as-is).
 */

export type ID = string;

/* ---------------------------------- auth --------------------------------- */

export type InstructorAccountStatus = "pending_review" | "approved" | "rejected";

export interface Instructor {
  id: ID;
  full_name: string;
  email: string;
  title: string;
  bio: string;
  specialties: string[];
  avatar_url: string | null;
  phone: string;
  status: InstructorAccountStatus;
  rejection_reason: string | null;
  availability: Availability[];
  notification_prefs: NotificationPrefs;
  created_at: string;
}

export interface Availability {
  day: "lun" | "mar" | "mer" | "jeu" | "ven" | "sam" | "dim";
  from: string;
  to: string;
  enabled: boolean;
}

export interface NotificationPrefs {
  submissions_email: boolean;
  session_reminders: boolean;
  community_mentions: boolean;
  admin_reviews: boolean;
}

export interface InstructorSession {
  token: string;
  instructor_id: ID;
  expires_at: string;
}

/* -------------------------------- trainings ------------------------------- */

export interface Training {
  id: ID;
  title: string;
  slug: string;
  category: string;
  cover_color: string;
  summary: string;
  cohort: string;
  level: "Débutant" | "Intermédiaire" | "Avancé";
  starts_at: string;
  ends_at: string;
  location: string;
  enrolled_count: number;
  /** ids of instructors assigned via training_instructors */
  instructor_ids: ID[];
}

export type LessonType = "video" | "reading" | "quiz" | "exercise" | "assignment" | "project";
export type ContentStatus = "draft" | "submitted" | "approved" | "rejected";

export interface Module {
  id: ID;
  training_id: ID;
  title: string;
  description: string;
  position: number;
  is_active: boolean;
  status: ContentStatus;
}

export interface VideoChapter {
  id: ID;
  label: string;
  timecode: string;
}

export interface Lesson {
  id: ID;
  module_id: ID;
  training_id: ID;
  title: string;
  type: LessonType;
  position: number;
  duration_minutes: number;
  status: ContentStatus;
  is_active: boolean;
  /** video */
  video_url?: string;
  chapters?: VideoChapter[];
  /** reading */
  content?: string;
  /** exercise / assignment / project */
  brief?: string;
  /** quiz + exercise */
  quiz?: QuizConfig;
  updated_at: string;
}

export interface QuizConfig {
  time_limit_minutes: number | null;
  pass_threshold: number;
  max_attempts: number;
  manual_grading: boolean;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: ID;
  prompt: string;
  kind: "single" | "multiple";
  points: number;
  position: number;
  options: QuizOption[];
}

export interface QuizOption {
  id: ID;
  label: string;
  is_correct: boolean;
}

export interface ContentReview {
  id: ID;
  entity_type: "module" | "lesson";
  entity_id: ID;
  entity_title: string;
  status: ContentStatus;
  admin_comment: string | null;
  submitted_at: string;
  reviewed_at: string | null;
}

/* --------------------------------- students ------------------------------- */

export type PaymentStatus = "paid" | "partial" | "pending" | "late";

export interface Student {
  id: ID;
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string | null;
  city: string;
}

export interface Enrollment {
  id: ID;
  student_id: ID;
  training_id: ID;
  progress: number;
  attendance_rate: number;
  payment_status: PaymentStatus;
  last_activity_at: string;
  enrolled_at: string;
}

export interface LessonCompletion {
  id: ID;
  student_id: ID;
  lesson_id: ID;
  lesson_title: string;
  lesson_type: LessonType;
  completed_at: string;
}

export interface QuizAttempt {
  id: ID;
  student_id: ID;
  lesson_id: ID;
  lesson_title: string;
  score: number;
  attempt_number: number;
  passed: boolean;
  taken_at: string;
}

/* ------------------------------- submissions ------------------------------ */

export type SubmissionStatus = "pending" | "graded" | "returned";

export interface Submission {
  id: ID;
  student_id: ID;
  training_id: ID;
  lesson_id: ID;
  lesson_title: string;
  type: Extract<LessonType, "exercise" | "assignment" | "project">;
  content: string;
  attachment_name: string | null;
  submitted_at: string;
  status: SubmissionStatus;
  grade: number | null;
  feedback: string | null;
  graded_at: string | null;
}

export interface InstructorFeedback {
  id: ID;
  submission_id: ID;
  student_id: ID;
  instructor_id: ID;
  grade: number;
  comment: string;
  decision: "validated" | "returned";
  created_at: string;
}

/* --------------------------------- sessions ------------------------------- */

export type SessionMode = "live" | "onsite";

export interface TrainingSession {
  id: ID;
  training_id: ID;
  title: string;
  mode: SessionMode;
  starts_at: string;
  duration_minutes: number;
  location: string;
  notes: string;
  attendance: AttendanceRecord[];
}

export interface AttendanceRecord {
  student_id: ID;
  present: boolean;
}

/* -------------------------------- community ------------------------------- */

export interface CommunityPost {
  id: ID;
  training_id: ID | null;
  author_id: ID;
  author_name: string;
  author_role: "instructor" | "student";
  body: string;
  pinned: boolean;
  created_at: string;
  replies_count: number;
}

export interface MessageThread {
  id: ID;
  student_id: ID;
  training_id: ID;
  subject: string;
  updated_at: string;
  unread: boolean;
  messages: ThreadMessage[];
}

export interface ThreadMessage {
  id: ID;
  author: "instructor" | "student";
  body: string;
  sent_at: string;
}

export interface AppNotification {
  id: ID;
  kind: "review" | "submission" | "session" | "message";
  title: string;
  body: string;
  created_at: string;
  read: boolean;
}

/* -------------------------------- dashboard ------------------------------- */

export interface DashboardStats {
  assigned_trainings: number;
  active_students: number;
  pending_submissions: number;
  average_completion: number;
  upcoming_sessions: number;
  overdue_gradings: number;
}

export interface ActivityItem {
  id: ID;
  kind: "submission" | "quiz" | "message" | "review" | "session";
  label: string;
  meta: string;
  created_at: string;
}
