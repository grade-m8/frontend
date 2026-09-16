import type { Enrollment, Subject } from "@/types/subject.ts";
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

export async function listEnrolled(user: User): Promise<Subject[]> {
  if (!user) throw new Error("failed to fetch subjects");
  const callable = httpsCallable<void, Subject[]>(
    functions,
    "listEnrolledSubjects",
  );
  const response = await callable();
  return response.data;
}

export async function listAvailable(user: User | null): Promise<Subject[]> {
  if (!user) throw new Error("failed to fetch subjects");
  const callable = httpsCallable<void, Subject[]>(
    functions,
    "listAvailableSubjects",
  );
  const response = await callable();
  return response.data;
}

export async function enroll(
  user: User | null,
  subjectId: string,
): Promise<Enrollment> {
  if (!user) throw new Error("failed to enroll subjects");
  const callable = httpsCallable<{ subjectId: string }, Enrollment>(
    functions,
    "enrollSubject",
  );
  const response = await callable({ subjectId });
  return response.data;
}
