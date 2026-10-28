import type { APIQuizQuestion, QuizChoiceInput, QuizQuestionPayload, QuizQuestionType } from "@/data/content";

export interface QuestionFormValues {
  prompt: string;
  type: QuizQuestionType;
  points: number;
  explanation: string;
  choices: QuizChoiceInput[];
}

const emptyChoices = (): QuizChoiceInput[] => [
  { label: "", is_correct: false },
  { label: "", is_correct: false },
];

export function questionFormFromQuestion(question: APIQuizQuestion | null): QuestionFormValues {
  return {
    prompt: question?.prompt ?? "",
    type: question?.type ?? "single",
    points: Number(question?.points ?? 10),
    explanation: question?.explanation ?? "",
    choices: question?.choices.map((c) => ({ label: c.label, is_correct: c.isCorrect })) ?? emptyChoices(),
  };
}

/** En mode « choix unique », une seule réponse peut être correcte : on ne garde que la première cochée */
export function keepFirstCorrect(choices: QuizChoiceInput[]): QuizChoiceInput[] {
  const first = choices.findIndex((c) => c.is_correct);
  return choices.map((c, i) => ({ ...c, is_correct: i === first }));
}

/** Coche / décoche un choix selon le type de question */
export function toggleCorrectChoice(choices: QuizChoiceInput[], index: number, type: QuizQuestionType): QuizChoiceInput[] {
  if (type === "single") return choices.map((c, i) => ({ ...c, is_correct: i === index }));
  return choices.map((c, i) => (i === index ? { ...c, is_correct: !c.is_correct } : c));
}

export const hasCorrectChoice = (values: QuestionFormValues): boolean => values.choices.some((c) => c.is_correct);

export function isQuestionValid(values: QuestionFormValues): boolean {
  return (
    values.prompt.trim() !== "" &&
    values.choices.length >= 2 &&
    values.choices.every((c) => c.label.trim() !== "") &&
    hasCorrectChoice(values)
  );
}

export function toQuestionPayload(values: QuestionFormValues, sortOrder: number): QuizQuestionPayload {
  return {
    prompt: values.prompt,
    type: values.type,
    points: values.points,
    sort_order: sortOrder,
    explanation: values.explanation || undefined,
    choices: values.choices,
  };
}
