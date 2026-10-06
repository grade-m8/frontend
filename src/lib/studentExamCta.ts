import type {
  MyExamSubmissionStatus,
  StudentExamCta,
} from "@/types/studentSubmission";

export function getStudentExamCta(
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
