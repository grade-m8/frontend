import { auth } from "./firebase";

const getBaseUrl = (): string => {
  const customBase = import.meta.env.VITE_API_BASE_URL;
  if (customBase) return customBase;

  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-grade-m8";
  // URL por defecto para emulador local de Firebase Functions (region us-central1)
  return `http://localhost:5001/${projectId}/us-central1`;
};

async function getAuthHeader(): Promise<Record<string, string>> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("Usuario no autenticado");
  }
  const token = await currentUser.getIdToken();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const headers = await getAuthHeader();
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${response.status}`);
    }

    return response.json();
  },

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    const headers = await getAuthHeader();
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${response.status}`);
    }

    return response.json();
  },
};
