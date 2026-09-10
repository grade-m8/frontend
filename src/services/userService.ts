import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export async function getProfile(): Promise<UserProfile> {
  const callable = httpsCallable<void, UserProfile>(
    functions,
    "getProfileFunction",
  );
  const result = await callable();
  return result.data;
}
