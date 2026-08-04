import { queryOptions } from "@tanstack/react-query";
import {
  communityApi,
  contentApi,
  dashboardApi,
  gradingApi,
  profileApi,
  sessionsApi,
  studentsApi,
  trainingsApi,
  authApi,
} from "@/lib/api";

export const qk = {
  stats: (id: string) => ["dashboard", "stats", id] as const,
  activity: (id: string) => ["dashboard", "activity", id] as const,
  overdue: (id: string) => ["dashboard", "overdue", id] as const,
  trainings: (id: string) => ["trainings", id] as const,
  trainingOverview: (id: string, t: string) => ["trainings", id, t, "overview"] as const,
  modules: (id: string, t: string) => ["content", "modules", id, t] as const,
  lessons: (id: string, t: string) => ["content", "lessons", id, t] as const,
  lesson: (id: string, l: string) => ["content", "lesson", id, l] as const,
  reviews: (id: string) => ["content", "reviews", id] as const,
  students: (id: string, t?: string) => ["students", id, t ?? "all"] as const,
  student: (id: string, s: string) => ["students", id, "detail", s] as const,
  queue: (id: string) => ["grading", "queue", id] as const,
  sessions: (id: string) => ["sessions", id] as const,
  roster: (t: string) => ["sessions", "roster", t] as const,
  posts: (id: string) => ["community", "posts", id] as const,
  threads: (id: string) => ["community", "threads", id] as const,
  notifications: () => ["community", "notifications"] as const,
  profile: (id: string) => ["profile", id] as const,
};

export const statsQuery = (id: string) =>
  queryOptions({ queryKey: qk.stats(id), queryFn: () => dashboardApi.stats(id) });

export const activityQuery = (id: string) =>
  queryOptions({ queryKey: qk.activity(id), queryFn: () => dashboardApi.activity(id) });

export const overdueQuery = (id: string) =>
  queryOptions({ queryKey: qk.overdue(id), queryFn: () => dashboardApi.overdueGradings(id) });

export const trainingsQuery = (id: string) =>
  queryOptions({ queryKey: qk.trainings(id), queryFn: () => trainingsApi.listAssigned(id) });

export const trainingOverviewQuery = (id: string, trainingId: string) =>
  queryOptions({
    queryKey: qk.trainingOverview(id, trainingId),
    queryFn: () => trainingsApi.overview(id, trainingId),
  });

export const modulesQuery = (id: string, trainingId: string) =>
  queryOptions({ queryKey: qk.modules(id, trainingId), queryFn: () => contentApi.modules(id, trainingId) });

export const lessonsQuery = (id: string, trainingId: string) =>
  queryOptions({ queryKey: qk.lessons(id, trainingId), queryFn: () => contentApi.lessons(id, trainingId) });

export const lessonQuery = (id: string, lessonId: string) =>
  queryOptions({ queryKey: qk.lesson(id, lessonId), queryFn: () => contentApi.lesson(id, lessonId) });

export const reviewsQuery = (id: string) =>
  queryOptions({ queryKey: qk.reviews(id), queryFn: () => contentApi.reviews(id) });

export const studentsQuery = (id: string, trainingId?: string) =>
  queryOptions({ queryKey: qk.students(id, trainingId), queryFn: () => studentsApi.list(id, trainingId) });

export const studentQuery = (id: string, studentId: string) =>
  queryOptions({ queryKey: qk.student(id, studentId), queryFn: () => studentsApi.detail(id, studentId) });

export const queueQuery = (id: string) =>
  queryOptions({ queryKey: qk.queue(id), queryFn: () => gradingApi.queue(id) });

export const sessionsQuery = (id: string) =>
  queryOptions({ queryKey: qk.sessions(id), queryFn: () => sessionsApi.list(id) });

export const rosterQuery = (trainingId: string) =>
  queryOptions({ queryKey: qk.roster(trainingId), queryFn: () => sessionsApi.roster(trainingId) });

export const postsQuery = (id: string) =>
  queryOptions({ queryKey: qk.posts(id), queryFn: () => communityApi.posts(id) });

export const threadsQuery = (id: string) =>
  queryOptions({ queryKey: qk.threads(id), queryFn: () => communityApi.threads(id) });

export const notificationsQuery = () =>
  queryOptions({ queryKey: qk.notifications(), queryFn: () => communityApi.notifications() });

export const profileQuery = (id: string) =>
  queryOptions({ queryKey: qk.profile(id), queryFn: () => authApi.me(id) });

export const profileApiRef = profileApi;
