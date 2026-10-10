import type { Enrollment, Subject } from "@/types/subject.ts";
import { apiClient } from "@/services/apiClient.ts";

export async function listOwned(): Promise<Subject[]> {
  return apiClient.get<Subject[]>("/subjects/owned");
}

export async function listEnrolled(): Promise<Subject[]> {
  return apiClient.get<Subject[]>("/subjects/enrolled");
}

export async function listAvailable(): Promise<Subject[]> {
  return apiClient.get<Subject[]>("/subjects/available");
}

export async function enroll(subjectId: string): Promise<Enrollment> {
  if (!subjectId)
    throw new Error("subjectId es obligatorio para la inscripción");
  return apiClient.post<Enrollment>(`/subjects/${subjectId}/enroll`);
}

export async function getSubject(subjectId: string): Promise<Subject> {
  return apiClient.get<Subject>(`/subjects/${subjectId}`);
}

export async function createSubject(name: string): Promise<Subject> {
  return apiClient.post<Subject>("/subjects", { name });
}
