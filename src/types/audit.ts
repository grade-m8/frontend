import type { Question, StudentQuestion } from "@/types/exam.ts";

export type AnswerGradingStatus =
  "pending" | "queued" | "grading" | "graded" | "failed";

export type Answer = {
  questionId: string;
  text: string;
  submittedAt: string;
  gradingStatus: AnswerGradingStatus;
  gradingAttempts: number;
  lastGradingError?: string;
  aiScore?: number;
  finalScore?: number;
  aiFeedback?: string;
  teacherEdited: boolean;
  gradedAt?: string;
};

export type AnalysisItemSource = "ai" | "teacher";

export type AnalysisItem = {
  itemId: string;
  criterionId: string;
  title: string;
  description: string;
  points: number;
  source: AnalysisItemSource;
  supersedes?: string;
  order: number;
  createdAt: string;
};

export type AnalysisItemInput = {
  criterionId: string;
  title: string;
  description: string;
  points: number;
};

export type AnswerDetail = {
  question: Question | StudentQuestion;
  answer: Answer;
  analysisItems: AnalysisItem[];
};

export type AuditSubmissionDetail = {
  submission: {
    submissionId: string;
    examId: string;
    studentId: string;
  };
  answers: Answer[];
};
