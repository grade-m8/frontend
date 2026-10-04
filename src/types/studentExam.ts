import type { Exam, StudentQuestion } from "@/types/exam.ts";

export interface StudentExamDetail {
  exam: Exam;
  questions: StudentQuestion[];
}
