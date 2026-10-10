import type { Question, QuestionType } from "@/types/exam.ts";

export const DEFAULT_QUESTION_TYPE: QuestionType = "essay";

export interface QuestionTypeOption {
  value: QuestionType;
  label: string;
  badge: string;
}

// `type` es opcional en Question. Sumar entradas acá alcanza para extender
// tanto el select del formulario como el badge de la vista de lectura.
export const QUESTION_TYPE_OPTIONS: QuestionTypeOption[] = [
  { value: "essay", label: "Desarrollo (Ensayo)", badge: "DESARROLLO" },
];

export function getQuestionTypeOption(question: Question): QuestionTypeOption {
  const type = question.type ?? DEFAULT_QUESTION_TYPE;
  return (
    QUESTION_TYPE_OPTIONS.find((option) => option.value === type) ??
    QUESTION_TYPE_OPTIONS[0]
  );
}
