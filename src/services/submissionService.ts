import { apiClient } from "@/services/apiClient.ts";
import type { SubmissionWithStudent } from "@/types/submission";

export async function listSubmissionsForExam(
  examId: string,
): Promise<SubmissionWithStudent[]> {
  return apiClient.get<SubmissionWithStudent[]>(
    `/submissions/by-exam/${examId}`,
  );
}

export async function approveAllForExam(
  examId: string,
): Promise<{ approved: number }> {
  return apiClient.post<{ approved: number }>(
    `/submissions/by-exam/${examId}/approve`,
  );
}

export async function retryFailedForExam(
  examId: string,
): Promise<{ retried: number; failed: number }> {
  return apiClient.post<{ retried: number; failed: number }>(
    `/submissions/by-exam/${examId}/retry-failed`,
  );
}
