import type { User } from "firebase/auth";
import type { Role } from "@/types/role.ts";
import { createContext } from "react";

export interface AuthContextValue {
  user: User | null;
  role: Role | undefined;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
