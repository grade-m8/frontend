export type Role = "Alumno" | "Admin" | "Profesor";

const ROLES: readonly Role[] = ["Alumno", "Admin", "Profesor"];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && ROLES.includes(value as Role);
}
