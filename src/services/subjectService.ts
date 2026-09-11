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
export async function listEnrolled(): Promise<Subject[]> {}
export async function listAvailable(): Promise<Subject[]> {
  return mockSubjects;
}
export async function enroll(subjectId: string): Promise<Enrollment> {
  console.log(subjectId);
}

const mockSubjects: Subject[] = [
  {
    subjectId: "1",
    teacherId: "1",
    name: "Matemática Discreta",
    teacherEmail: "Dr. Carlos Méndez",
    room: "Aula 101",
    active: true,
  },
  {
    subjectId: "2",
    teacherId: "2",
    name: "Física II",
    teacherEmail: "Dra. Laura Gómez",
    room: "Aula 204",
    active: true,
  },
  {
    subjectId: "3",
    teacherId: "3",
    name: "Algoritmos y Estructuras de Datos",
    teacherEmail: "Ing. Martín Pérez",
    room: "Lab 3",
    active: true,
  },
  {
    subjectId: "4",
    teacherId: "4",
    name: "Sistemas Operativos",
    teacherEmail: "Dra. Sofía Torres",
    room: "Aula 305",
    active: true,
  },
  {
    subjectId: "5",
    teacherId: "5",
    name: "Bases de Datos",
    teacherEmail: "Lic. Roberto Díaz",
    room: "Lab Informática 1",
    active: true,
  },
  {
    subjectId: "6",
    teacherId: "6",
    name: "Arquitectura de Computadoras",
    teacherEmail: "Ing. Elena Rossi",
    room: "Aula 108",
    active: true,
  },
];
