export type InstructorHealthLevel = "excellent" | "good" | "fair" | "low";
export type InstructorHealthCategory = "security" | "profile";

export interface APIInstructorHealthBreakdownEntry {
  percent: number;
  earned: number;
  total: number;
}

export interface APIInstructorHealthItem {
  id: string;
  category: InstructorHealthCategory;
  label: string;
  done: boolean;
  points: number;
}

export interface APIInstructorHealthRecommendation {
  id: string;
  priority: number;
  type: InstructorHealthCategory;
  level: "warning" | "info";
  urgent: boolean;
  title: string;
  message: string;
  action: { label: string; target: string };
  points: number;
  dismissed: boolean;
  ageDays?: number;
  sessions?: number;
  staleSessions?: number;
  missing?: string[];
}

export interface APIInstructorHealth {
  score: number;
  level: InstructorHealthLevel;
  label: string;
  breakdown: Record<InstructorHealthCategory, APIInstructorHealthBreakdownEntry>;
  items: APIInstructorHealthItem[];
  recommendations: APIInstructorHealthRecommendation[];
  dismissedCount: number;
  snoozeDays: number;
}

export interface InstructorHealthDismissPayload {
  id: string;
  restore?: boolean;
}

export interface APIInstructorHealthDismissResponse {
  id: string;
  dismissed: boolean;
  snoozeDays: number;
}