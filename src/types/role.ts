export type Role = "Student" | "Admin" | "Professor";

const ROLES: readonly Role[] = ["Student", "Admin", "Professor"];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && ROLES.includes(value as Role);
}
