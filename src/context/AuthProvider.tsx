// contexts/auth/AuthProvider.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  getIdTokenResult,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/services/firebase";
import { getProfile } from "@/services/userService";
import { toast } from "@/components/handler/toastHandler";
import { isRole } from "@/types/role";
import { AuthContext, type AuthContextValue } from "./AuthContext";
type AuthState = Omit<AuthContextValue, "login">;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: auth.currentUser,
    role: undefined,
    profile: null,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const tokenResult = await getIdTokenResult(user);
        const claimRole = tokenResult.claims.role;
        let profile = null;
        try {
          profile = await getProfile();
        } catch {
          toast.error("No pudimos cargar tu perfil");
        }
        setState({
          user,
          role: isRole(claimRole) ? claimRole : undefined,
          profile,
          loading: false,
        });
      } else {
        setState({
          user: null,
          role: undefined,
          profile: null,
          loading: false,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const tokenResult = await getIdTokenResult(userCredential.user);
    const claimRole = tokenResult.claims.role;
    let profile = null;
    try {
      profile = await getProfile();
    } catch {
      toast.error("No pudimos cargar tu perfil");
    }

    setState({
      user: userCredential.user,
      role: isRole(claimRole) ? claimRole : undefined,
      profile,
      loading: false,
    });
  }, []);

  // evita que value sea un objeto nuevo en cada render si state no cambió
  const value = useMemo<AuthContextValue>(
    () => ({ ...state, login }),
    [state, login],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
