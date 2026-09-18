import type { Exam, Question, RubricCriterion } from "@/types/exam.ts";

export type CreateExamDto = Omit<
  Exam,
  "examId" | "status" | "createdAt" | "publishedAt" | "teacherId"
>;

export type UpdateExamDto = Partial<
  Omit<Exam, "examId" | "teacherId" | "createdAt" | "publishedAt">
>;

export type ReplaceCriteriaDto = Omit<RubricCriterion, "criterionId">[];

export type ReplaceQuestionsDto = Omit<Question, "questionId">[];

export interface ExamDetail {
  exam: Exam;
  criteria: RubricCriterion[];
  questions: Question[];
}
