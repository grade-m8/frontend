import { apiClient } from "@/services/apiClient.ts";
import type {
  CreateExamDto,
  ExamDetail,
  ReplaceCriteriaDto,
  ReplaceQuestionsDto,
  UpdateExamDto,
} from "@/types/examDto.ts";
import type { Exam, Question, RubricCriterion } from "@/types/exam.ts";

export async function createExam(dto: CreateExamDto): Promise<Exam> {
  return apiClient.post<Exam>("/exams", dto);
}

export async function updateExam(
  examId: string,
  patch: UpdateExamDto,
): Promise<Exam> {
  return apiClient.patch<Exam>(`/exams/${examId}`, patch);
}

export async function replaceCriteria(
  examId: string,
  criteria: ReplaceCriteriaDto,
): Promise<RubricCriterion[]> {
  return apiClient.put<RubricCriterion[]>(`/exams/${examId}/criteria`, {
    criteria,
  });
}

export async function replaceQuestions(
  examId: string,
  questions: ReplaceQuestionsDto,
): Promise<Question[]> {
  return apiClient.put<Question[]>(`/exams/${examId}/questions`, {
    questions,
  });
}
export const replaceQuestionsAndPublish = (
  examId: string,
  questions: ReplaceQuestionsDto,
) => replaceQuestions(examId, questions);

export async function getExam(examId: string): Promise<ExamDetail> {
  return apiClient.get<ExamDetail>(`/exams/${examId}`);
}

export async function listOwnedExams(subjectId?: string): Promise<Exam[]> {
  const endpoint = subjectId ? `/exams/owned/${subjectId}` : "/exams/owned";
  return apiClient.get<Exam[]>(endpoint);
}

export async function listActiveExams(subjectId: string): Promise<Exam[]> {
  if (!subjectId)
    throw new Error("subjectId es obligatorio para listar exámenes activos");
  return apiClient.get<Exam[]>(`/exams/active/${subjectId}`);
}
