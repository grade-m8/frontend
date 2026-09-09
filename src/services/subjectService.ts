import type { Subject } from "@/types/subject.ts";
import type { User } from "firebase/auth";

export async function listOwned(user: User): Promise<Subject[]> {
  // TODO descomentar esto y poner la url que va
  //if (!user) throw throw new Error("failed to fetch subjects")
  // const response = await fetch("url/posta")
  // if (!response.ok) throw new Error("failed to fetch subjects")
  // return response.json()
  return mockSubjects(user);
}

async function mockSubjects(user: User): Promise<Subject[]> {
  return [
    {
      subjectId: "1",
      name: "Matemática",
      teacherId: "1",
      teacherEmail: user.email ?? "",
      active: true,
    },
    {
      subjectId: "2",
      name: "Física",
      teacherId: "2",
      active: false,
    },
  ];
}
