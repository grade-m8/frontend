export function mapAuthErrorMessage(code: string): string {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email or password.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/too-many-requests":
      return "Too many failed login attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    default:
      return "An unexpected error occurred. Please try again.";
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
};

export function getApiErrorMessage(
  error: unknown,
  fallback = "Ocurrió un error inesperado. Intentá nuevamente.",
): string {
  const code = error instanceof Error ? error.message : "";
  return API_ERROR_MESSAGES[code] ?? fallback;
}
