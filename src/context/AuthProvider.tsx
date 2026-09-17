// contexts/auth/AuthProvider.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  getIdTokenResult,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "@/services/firebase";
import { getProfile, type UserProfile } from "@/services/userService";
import { toast } from "@/components/handler/toastHandler";
import { isRole, type Role } from "@/types/role";
import { AuthContext, type AuthContextValue } from "./AuthContext";
type AuthState = Omit<AuthContextValue, "login" | "logout">;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: auth.currentUser,
    role: undefined,
    profile: null,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState({
          user: null,
          role: undefined,
          profile: null,
          loading: false,
        });
        return;
      }

      // única fuente de verdad de la sesión: login, refresh y logout pasan por acá
      let role: Role | undefined;
      let profile: UserProfile | null = null;
      try {
        const tokenResult = await getIdTokenResult(user);
        const claimRole = tokenResult.claims.role;
        role = isRole(claimRole) ? claimRole : undefined;
        profile = await getProfile();
      } catch (error) {
        console.error("Fallo al cargar la sesión:", error);
        toast.error("No pudimos cargar tu perfil");
      } finally {
        setState({ user, role, profile, loading: false });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged completa role/profile y apaga loading
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  // evita que value sea un objeto nuevo en cada render si state no cambió
  const value = useMemo<AuthContextValue>(
    () => ({ ...state, login, logout }),
    [state, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
