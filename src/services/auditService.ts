import type {
  AnalysisItemInput,
  AnswerDetail,
  AuditSubmissionDetail,
  Answer,
} from "@/types/audit.ts";
import { apiClient } from "@/services/apiClient.ts";

export function getSubmission(
  submissionId: string,
): Promise<AuditSubmissionDetail> {
  return apiClient.get<AuditSubmissionDetail>(`/submissions/${submissionId}`);
}

export function getAnswerDetail(
  submissionId: string,
  questionId: string,
): Promise<AnswerDetail> {
  return apiClient.get<AnswerDetail>(
    `/submissions/${submissionId}/answers/${questionId}`,
  );
}

export function updateAnalysis(
  submissionId: string,
  questionId: string,
  items: AnalysisItemInput[],
): Promise<AnswerDetail> {
  return apiClient.put<AnswerDetail>(
    `/submissions/${submissionId}/answers/${questionId}/analysis`,
    { items },
  );
}

export function retryGrading(
  submissionId: string,
  questionId: string,
): Promise<Answer> {
  return apiClient.post<Answer>(
    `/submissions/${submissionId}/answers/${questionId}/retry`,
  );
}
