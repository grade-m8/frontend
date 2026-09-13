import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";
import type { Role } from "@/types/role";

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export async function getProfile(): Promise<UserProfile> {
  const callable = httpsCallable<void, UserProfile>(
    functions,
    "getProfileFunction",
  );
  const result = await callable();
  return result.data;
}
