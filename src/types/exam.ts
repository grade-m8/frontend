// TODO: Sincronizar con interfaces de backend (src/types/exam/) cuando
// los servicios Callable Functions estén integrados

export type CriterionWeight = "high" | "medium" | "low";

export interface RubricCriterion {
  criterionId: string;
  title: string;
  weight: CriterionWeight;
  weightPercentage: number;
  guidance: string;
  order: number;
}

export type ExamStatus = "draft" | "published" | "closed";

export interface ExamGeneralInfo {
  title: string;
  subjectId: string;
  subjectName?: string;
  durationMinutes: number;
  passingPercentage: number;
  scheduledAt?: string;
}

export interface Exam {
  examId: string;
  subjectId: string;
  teacherId: string;
  title: string;
  durationMinutes: number;
  passingPercentage: number;
  status: ExamStatus;
  createdAt: string;
  publishedAt?: string;
  scheduledAt?: string;
}

export interface ExamConfigFormState {
  generalInfo: ExamGeneralInfo;
  rubricCriteria: RubricCriterion[];
  isValid: boolean;
  isDirty: boolean;
}

export type Question = {
  questionId: string;
  order: number;
  title: string;
  prompt: string;
  points: number;
  idealAnswer: string;
  createdAt?: string;
  type?: QuestionType;
};

export type QuestionType = "essay"; //TODO en ningun lado estan especificados los tipos

export type StudentQuestion = Omit<Question, "idealAnswer">;

export interface ExamSummaryMetadata {
  title: string;
  subjectName: string;
  totalQuestions: number;
  totalPoints: number;
}

// TODO: Vincular con ReplaceQuestionsDto y getExam({ examId }) del backend al integrar Firebase Callable Functions.

export interface QuestionEditorState {
  questions: Question[];
  editingQuestionId: string | null;
  isCreating: boolean;
  error: Record<string, Record<string, string>>;
}
