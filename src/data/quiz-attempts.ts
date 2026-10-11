// src/data/quiz-attempts.ts

/** POST /instructor/quiz-attempts/{attemptId}/feedback */
export interface APIInstructorQuizAttemptFeedback {
  id: string;
  comment: string;
  validated: boolean;
}

export interface InstructorQuizAttemptFeedbackPayload {
  comment: string;
  validated: boolean;
}