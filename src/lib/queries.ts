import { queryOptions } from "@tanstack/react-query";
import {
  communityApi,
  profileApi,
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

export const postsQuery = (id: string) =>
  queryOptions({ queryKey: qk.posts(id), queryFn: () => communityApi.posts(id) });

export const threadsQuery = (id: string) =>
  queryOptions({ queryKey: qk.threads(id), queryFn: () => communityApi.threads(id) });

export const notificationsQuery = () =>
  queryOptions({ queryKey: qk.notifications(), queryFn: () => communityApi.notifications() });

export const profileApiRef = profileApi;
