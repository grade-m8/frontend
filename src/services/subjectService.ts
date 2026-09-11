import type { Enrollment, Subject } from "@/types/subject.ts";
import type { User } from "firebase/auth";

const baseUrl: string = import.meta.env.VITE_BASE_URL;

export async function listOwned(user: User): Promise<Subject[]> {
  if (!user) throw new Error("failed to fetch subjects");
  const token = await user.getIdToken();
  const payload = { data: {} };

  const response = await fetch(baseUrl + "/listOwnedSubjects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Inform the server about the data format
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("failed to fetch subjects");
  const responseData = await response.json();
  return responseData.result;
}

export async function listEnrolled(user: User): Promise<Subject[]> {
  if (!user) throw new Error("failed to fetch subjects");
  const token = await user.getIdToken();
  console.log(token);
  const payload = { data: {} };

  const response = await fetch(baseUrl + "/listEnrolledSubjects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Inform the server about the data format
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("failed to fetch subjects");
  const responseData = await response.json();
  return responseData.result;
}

export async function listAvailable(user: User | null): Promise<Subject[]> {
  if (!user) throw new Error("failed to fetch subjects");
  const token = await user.getIdToken();
  const payload = { data: {} };

  const response = await fetch(baseUrl + "/listAvailableSubjects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Inform the server about the data format
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("failed to fetch subjects");
  const responseData = await response.json();
  return responseData.result;
}

export async function enroll(
  user: User | null,
  subjectId: string,
): Promise<Enrollment> {
  if (!user) throw new Error("failed to fetch subjects");
  const token = await user.getIdToken();
  const payload = {
    data: {
      subjectId: subjectId,
    },
  };

  const response = await fetch(baseUrl + "/enrollSubject", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Inform the server about the data format
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("failed to fetch subjects");
  const responseData = await response.json();
  return responseData.result;
}
