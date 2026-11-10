export function mapAuthErrorMessage(code: string): string {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Correo electrónico o contraseña incorrectos.";
    case "auth/invalid-email":
      return "Por favor, ingresá una dirección de correo válida.";
    case "auth/user-disabled":
      return "Esta cuenta ha sido deshabilitada. Por favor, contactate con soporte.";
    case "auth/too-many-requests":
      return "Demasiados intentos fallidos. Por favor, intentá nuevamente en unos minutos.";
    case "auth/network-request-failed":
      return "Error de red. Comprobá tu conexión a internet.";
    case "auth/email-already-in-use":
      return "Ya existe una cuenta registrada con este correo electrónico.";
    case "auth/weak-password":
      return "La contraseña debe contener al menos 6 caracteres.";
    default:
      return "Ocurrió un error inesperado al autenticar. Intentá nuevamente.";
  }
}

// El backend responde `{ error: <código>, message: <texto> }`, pero apiClient
// hace `throw new Error(body.error)`: el código máquina viaja en `message` y el
// status HTTP se descarta. Por eso mapeamos contra el código.
// El backend usa dos convenciones para el mismo caso: SCREAMING_SNAKE vía
// `mapAndReturnDomainError` y kebab-case vía `HttpErrors`.
const API_ERROR_MESSAGES: Record<string, string> = {
  EXAM_NOT_FOUND: "El examen ya no existe.",
  "exam-not-found": "El examen ya no existe.",
  NOT_PROFESSOR_EXAM: "No tenés permisos sobre este examen.",
  SUBJECT_NOT_FOUND: "La materia seleccionada ya no existe.",
  NOT_PROFESSOR_SUBJECT: "No tenés permisos sobre esta materia.",
  NO_VALID_ROLE: "Tu usuario no tiene un rol válido.",
  INVALID_DATA: "Hay datos inválidos en el formulario.",
  "permission-denied": "No tenés permisos para realizar esta acción.",
  "invalid-role": "Tu usuario no tiene un rol válido.",
  "missing-fields": "Faltan campos obligatorios.",
  "invalid-argument": "Hay datos inválidos en el formulario.",
  unauthenticated: "Tu sesión expiró. Iniciá sesión nuevamente.",
  SUBMISSION_NOT_FOUND: "La entrega no existe.",
  ANSWER_NOT_FOUND: "La respuesta no existe.",
  ANSWER_NOT_GRADED: "Esta respuesta todavía no fue corregida por la IA.",
  QUESTION_NOT_FOUND: "La pregunta no pertenece a este examen.",
  NOT_SUBMISSION_OWNER: "No tenés permisos sobre esta entrega.",
  GRADING_NOT_APPROVED:
    "Tu docente todavía no aprobó la corrección de este examen.",
  EXAM_NOT_PUBLISHED: "El examen todavía no está disponible.",
  EXAM_NOT_CLOSEABLE: "Solo se puede cerrar un examen publicado.",
  EXAM_CLOSED: "El examen ya está cerrado.",
  EXAM_NOT_EDITABLE:
    "No se puede editar un examen que ya fue publicado o cerrado.",
  EXAM_NOT_STARTED: "El examen todavía no comenzó.",
  SUBMISSION_ALREADY_SUBMITTED: "Este examen ya fue entregado.",
  QUESTIONS_UNANSWERED:
    "Tenés que responder todas las preguntas antes de entregar.",
  ANSWER_NOT_RETRYABLE: "La corrección de esta respuesta ya no está en error.",
  GRADING_RETRY_FAILED:
    "No se pudo reenviar la respuesta a corregir. Intentá de nuevo.",
};

export function getApiErrorMessage(
  error: unknown,
  fallback = "Ocurrió un error inesperado. Intentá nuevamente.",
): string {
  const code = error instanceof Error ? error.message : "";
  return API_ERROR_MESSAGES[code] ?? fallback;
}
