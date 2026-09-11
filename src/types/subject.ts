export interface Subject {
  subjectId: string;
  name: string;
  teacherId: string;
  teacherEmail?: string;
  room?: string;
  createdAt?: unknown;
  active: boolean;
}

export type EnrollmentStatus = "active" | "dropped";

export interface Enrollment {
  enrollmentId: string;
  subjectId: string;
  studentId: string;
  enrolledAt?: unknown;
  status: EnrollmentStatus;
}
