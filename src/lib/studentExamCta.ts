import { toMillis } from "@/lib/date.ts";
import type { Exam } from "@/types/exam";
import type {
  MyExamSubmissionStatus,
  StudentExamCta,
} from "@/types/studentSubmission";

// Un examen cerrado bloquea siempre al alumno, haya entregado o no: el backend
// responde EXAM_CLOSED al pedirle el examen, así que "Ver resultado" no cargaría.
export function getStudentExamCta(
  status: MyExamSubmissionStatus | undefined,
  exam: Pick<Exam, "status" | "scheduledAt">,
  nowMillis: number = Date.now(),
): StudentExamCta {
  if (exam.status === "closed") {
    return { kind: "waiting", label: "Examen cerrado", statusLabel: "CERRADO" };
  }

  const cta = getSubmissionCta(status);
  if (cta.kind !== "take") return cta;

  const scheduledMillis = toMillis(exam.scheduledAt);
  if (scheduledMillis !== undefined && nowMillis < scheduledMillis) {
    return {
      kind: "waiting",
      label: "Aún no comenzó",
      statusLabel: "PROGRAMADO",
    };
  }

  return cta;
}

function getSubmissionCta(
  status: MyExamSubmissionStatus | undefined,
): StudentExamCta {
  if (status === undefined) {
    return {
      kind: "take",
      label: "Comenzar",
      statusLabel: "PUBLICADO",
    };
  }

  switch (status.status) {
    case "in_progress":
      return {
        kind: "take",
        label: "Continuar",
        statusLabel: "EN CURSO",
      };
    case "submitted":
    case "grading":
      return {
        kind: "waiting",
        label: "En revisión",
        statusLabel: "EN REVISIÓN",
      };
    case "awaiting_approval":
      return {
        kind: "waiting",
        label: "Pendiente de aprobación",
        statusLabel: "PENDIENTE DE APROBACIÓN",
      };
    case "reviewed":
      return {
        kind: "review",
        label: "Ver resultado",
        statusLabel: "CORREGIDO",
        submissionId: status.submissionId,
      };
    case "error":
      return {
        kind: "review",
        label: "Ver resultado",
        statusLabel: "IA NO DISPONIBLE",
        submissionId: status.submissionId,
      };
  }
}
