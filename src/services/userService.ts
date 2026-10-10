import type { Role } from "@/types/role";
import { apiClient } from "@/services/apiClient.ts";

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export async function getProfile(): Promise<UserProfile> {
  return apiClient.get<UserProfile>("/users/profile");
}

export async function getProfileByUid(uid: string): Promise<UserProfile> {
  return apiClient.get<UserProfile>(`/users/${uid}`);
}
