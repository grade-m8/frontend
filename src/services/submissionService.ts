import { apiClient } from "@/services/apiClient.ts";
import type { Submission } from "@/types/submission";

export async function listSubmissionsForExam(
  examId: string,
): Promise<Submission[]> {
  return apiClient.get<Submission[]>(`/submissions/by-exam/${examId}`);
}
