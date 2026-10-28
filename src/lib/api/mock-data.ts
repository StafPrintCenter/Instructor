import type {
  Enrollment,
  Instructor,
  Lesson,
  Module,
  Student,
  Submission,
  Training,
  TrainingSession,
  CommunityPost,
  MessageThread,
  AppNotification,
  ContentReview,
  QuizAttempt,
  LessonCompletion,
} from "./types";

const iso = (d: string) => new Date(d).toISOString();

