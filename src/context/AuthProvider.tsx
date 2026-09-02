// contexts/auth/AuthProvider.tsx
import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { auth } from "@/services/firebase";
import { isRole } from "@/types/role";
import { AuthContext, type AuthContextValue } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthContextValue>({
    user: auth.currentUser,
    role: undefined,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const tokenResult = await getIdTokenResult(user);
        const claimRole = tokenResult.claims.role;
        setState({
          user,
          role: isRole(claimRole) ? claimRole : undefined,
          loading: false,
        });
      } else {
        setState({ user: null, role: undefined, loading: false });
      }
    });

    return () => unsubscribe();
  }, []);

  // evita que value sea un objeto nuevo en cada render si state no cambió
  const value = useMemo(() => state, [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
