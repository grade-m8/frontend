import { FirebaseError } from "firebase/app";

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

export function getFirebaseErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "functions/unauthenticated":
        return "Tu sesión expiró. Por favor, iniciá sesión nuevamente.";
      case "functions/permission-denied":
        return "No tenés permisos para realizar esta acción.";
      case "functions/not-found":
        return "El examen o recurso solicitado no existe.";
      case "functions/invalid-argument":
        return error.message; // mensaje de validación que manda el backend
      default:
        return (
          error.message || "Ocurrió un error inesperado. Intentá nuevamente."
        );
    }
  }

  // No es un FirebaseError: podría ser un Error genérico, un string, etc.
  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrió un error inesperado. Intentá nuevamente.";
}
