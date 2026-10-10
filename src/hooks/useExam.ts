import { useCallback, useEffect, useState } from "react";
import type { Exam, Question, RubricCriterion } from "@/types/exam.ts";
import type { ExamDetail } from "@/types/examDto.ts";
import { getExam } from "@/services/examService.ts";

export type ExamLoadError =
  "not-found" | "forbidden" | "unauthenticated" | "unknown";

// El apiClient tira `new Error(body.error)`, es decir el código máquina del
// backend, y descarta el status HTTP. El backend además usa dos convenciones
// para el mismo caso: SCREAMING_SNAKE vía `mapAndReturnDomainError` y
// kebab-case vía `HttpErrors`. Contemplamos ambas.
const ERROR_CODES: Record<string, ExamLoadError> = {
  EXAM_NOT_FOUND: "not-found",
  "exam-not-found": "not-found",
  "not-found": "not-found",
  NOT_PROFESSOR_EXAM: "forbidden",
  NO_VALID_ROLE: "forbidden",
  "permission-denied": "forbidden",
  "invalid-role": "forbidden",
  unauthenticated: "unauthenticated",
};

function toExamLoadError(error: unknown): ExamLoadError {
  if (!(error instanceof Error)) return "unknown";
  return ERROR_CODES[error.message] ?? "unknown";
}

export function useExam(examId: string | undefined) {
  const [exam, setExam] = useState<Exam>();
  const [criteria, setCriteria] = useState<RubricCriterion[]>();
  const [questions, setQuestions] = useState<Question[]>();
  // En modo creación no hay nada que traer: arrancar en false para que la
  // página no se quede con el spinner puesto para siempre.
  const [isLoading, setIsLoading] = useState<boolean>(examId !== undefined);
  const [error, setError] = useState<ExamLoadError>();

  const loadExam = useCallback(async () => {
    if (examId === undefined) {
      return;
    }

    try {
      setIsLoading(true);
      setError(undefined);
      const examData: ExamDetail = await getExam(examId);
      setExam(examData.exam);
      setCriteria(examData.criteria ?? []);
      setQuestions(examData.questions ?? []);
    } catch (err) {
      setExam(undefined);
      setCriteria(undefined);
      setQuestions(undefined);
      setError(toExamLoadError(err));
    } finally {
      setIsLoading(false);
    }
  }, [examId]);

  useEffect(() => {
    if (examId === undefined) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadExam();
  }, [examId, loadExam]);

  const reloadExam = useCallback(async () => {
    await loadExam();
  }, [loadExam]);

  return { exam, criteria, questions, isLoading, error, reloadExam };
}
