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
