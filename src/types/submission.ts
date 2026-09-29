export type SubmissionStatus =
  | "in_progress"
  | "submitted"
  | "grading"
  | "awaiting_approval"
  | "reviewed"
  | "error";

export type Submission = {
  submissionId: string;
  examId: string;
  subjectId: string;
  studentId: string;
  teacherId: string;
  status: SubmissionStatus;
  startedAt: string;
  submittedAt?: string;
  gradingStartedAt?: string;
  gradingCompletedAt?: string;
  totalScore?: number;
  totalPossible: number;
  answeredCount: number;
  gradedCount: number;
  questionCount: number;
  teacherReviewedAt?: string;
  teacherReviewedBy?: string;
};

export const SUBMISSION_STATUS_LABELS: Record<SubmissionStatus, string> = {
  in_progress: "En curso",
  submitted: "Entregado",
  grading: "Corrigiendo (IA)",
  awaiting_approval: "Pendiente de aprobación",
  reviewed: "Aprobado",
  error: "Error de corrección",
};
