export interface Subject {
  subjectId: string;
  name: string;
  teacherId: string;
  teacherEmail?: string;
  room?: string;
  createdAt?: unknown;
  active: boolean;
}
