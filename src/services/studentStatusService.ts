import { apiClient } from "@/services/apiClient.ts";
import type { MyExamSubmissionStatus } from "@/types/studentSubmission";

export function listMyStatusForSubject(
  subjectId: string,
): Promise<MyExamSubmissionStatus[]> {
  return apiClient.get<MyExamSubmissionStatus[]>(
    `/submissions/by-subject/${subjectId}`,
  );
}
