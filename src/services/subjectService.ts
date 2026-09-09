import type { Enrollment, Subject } from "@/types/subject.ts";
import type { User } from "firebase/auth";

export async function listOwned(user: User): Promise<Subject[]> {
  // TODO descomentar esto y poner la url que va
  //if (!user) throw throw new Error("failed to fetch subjects")
  // const response = await fetch("url/posta")
  // if (!response.ok) throw new Error("failed to fetch subjects")
  // return response.json()
  console.log(user);
  return mockSubjects;
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
