import type { SubmissionStatus } from "./submission";

export interface MyExamSubmissionStatus {
  examId: string;
  submissionId: string;
  status: SubmissionStatus;
}

export type StudentExamCtaKind = "take" | "waiting" | "review";

export interface StudentExamCta {
  kind: StudentExamCtaKind;
  label: string;
  statusLabel: string;
  submissionId?: string;
}
