import { apiClient } from "@/services/apiClient.ts";
import type { StudentExamDetail } from "@/types/studentExam.ts";
import type { Submission } from "@/types/submission.ts";
import type { Answer } from "@/types/audit.ts";

export async function getStudentExam(
  examId: string,
): Promise<StudentExamDetail> {
  return apiClient.get<StudentExamDetail>(`/exams/${examId}`);
}

export async function startOrResumeSubmission(
  examId: string,
): Promise<Submission> {
  return apiClient.post<Submission>("/submissions", { examId });
}

export async function getMySubmission(
  submissionId: string,
): Promise<{ submission: Submission; answers: Answer[] }> {
  return apiClient.get<{ submission: Submission; answers: Answer[] }>(
    `/submissions/${submissionId}`,
  );
}

export async function saveAnswer(
  submissionId: string,
  questionId: string,
  text: string,
): Promise<Answer> {
  return apiClient.put<Answer>(
    `/submissions/${submissionId}/answers/${questionId}`,
    { text },
  );
}

export async function submitExam(submissionId: string): Promise<Submission> {
  return apiClient.post<Submission>(`/submissions/${submissionId}/submit`);
}
