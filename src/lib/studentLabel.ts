import type { SubmissionStudent } from "@/types/submission";

export function formatStudentLabel(student: SubmissionStudent | null): string {
  if (!student) return "Alumno sin datos";

  return `${student.firstName} ${student.lastName}`;
}
