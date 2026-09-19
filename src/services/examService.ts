import { httpsCallable } from "firebase/functions";
import { functions } from "@/services/firebase.ts";
import type {
  CreateExamDto,
  ExamDetail,
  ReplaceCriteriaDto,
  ReplaceQuestionsDto,
  UpdateExamDto,
} from "@/types/examDto.ts";
import type { Exam, Question, RubricCriterion } from "@/types/exam.ts";

async function callFunction<TData, TResult>(
  name: string,
  data?: TData,
): Promise<TResult> {
  const callable = httpsCallable<TData, TResult>(functions, name);
  const result = await callable(data as TData);
  return result.data;
}

export async function createExam(dto: CreateExamDto) {
  return callFunction<CreateExamDto, Exam>("createExam", dto);
}

export async function updateExam(
  examId: string,
  patch: UpdateExamDto,
): Promise<Exam> {
  const data = {
    examId: examId,
    patch: patch,
  };
  return callFunction<{ examId: string; patch: UpdateExamDto }, Exam>(
    "updateExam",
    data,
  );
}

export async function replaceCriteria(
  examId: string,
  criteria: ReplaceCriteriaDto,
): Promise<RubricCriterion[]> {
  const data = {
    examId: examId,
    criteria: criteria,
  };
  return callFunction<
    { examId: string; criteria: ReplaceCriteriaDto },
    RubricCriterion[]
  >("replaceCriteria", data);
}

export async function replaceQuestion(
  examId: string,
  questions: ReplaceQuestionsDto,
): Promise<Question[]> {
  const data = {
    examId: examId,
    questions: questions,
  };
  return callFunction<
    { examId: string; questions: ReplaceQuestionsDto },
    Question[]
  >("replaceQuestions", data);
}

export async function getExam(examId: string): Promise<ExamDetail> {
  const data = {
    examId: examId,
  };
  return callFunction<{ examId: string }, ExamDetail>("getExam", data);
}
export async function listOwnedExams(subjectId?: string): Promise<Exam[]> {
  return callFunction<{ subjectId?: string }, Exam[]>("listOwnedExams", {
    subjectId,
  });
}
export async function listActiveExams(subjectId?: string): Promise<Exam[]> {
  return callFunction<{ subjectId?: string }, Exam[]>("listActiveExams", {
    subjectId,
  });
}
