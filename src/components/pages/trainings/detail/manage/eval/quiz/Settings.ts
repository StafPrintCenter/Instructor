import type { APIQuiz, QuizMode, QuizPayload } from "@/data/content";

export interface QuizSettingsValues {
  mode: QuizMode;
  time_limit_sec: number;
  pass_score: number;
  max_attempts: number;
  auto_submit_on_timeout: boolean;
}

export const emptyQuizSettings: QuizSettingsValues = {
  mode: "quiz",
  time_limit_sec: 600,
  pass_score: 50,
  max_attempts: 3,
  auto_submit_on_timeout: true,
};

export const quizSettingsFromQuiz = (quiz: APIQuiz): QuizSettingsValues => ({
  mode: quiz.mode,
  time_limit_sec: Number(quiz.timeLimitSec ?? 0),
  pass_score: Number(quiz.passScore),
  max_attempts: Number(quiz.maxAttempts),
  auto_submit_on_timeout: quiz.autoSubmitOnTimeout,
});

/** La limite de temps est obligatoire en mode « quiz » (chronométré) */
export const isQuizTimeLimitMissing = (values: QuizSettingsValues): boolean =>
  values.mode === "quiz" && !values.time_limit_sec;

export const toQuizPayload = (values: QuizSettingsValues): QuizPayload => ({
  mode: values.mode,
  time_limit_sec: values.mode === "quiz" ? values.time_limit_sec : undefined,
  pass_score: values.pass_score,
  max_attempts: values.max_attempts,
  auto_submit_on_timeout: values.auto_submit_on_timeout,
});