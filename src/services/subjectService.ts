import type { Subject } from "@/types/subject.ts";
import type { User } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

export async function listOwned(user: User): Promise<Subject[]> {
  if (!user) throw new Error("failed to fetch subjects");
  const getOwnedSubjects = httpsCallable<void, Subject[]>(
    functions,
    "listOwnedSubjects",
  );
  const response = await getOwnedSubjects();
  return response.data;
}
