import { auth } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { isRole, type Role } from "@/types/role.ts";

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<Role>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const tokenResult = await user.getIdTokenResult();
        const claimRole = tokenResult.claims.role;

        setUser(user);
        setRole(isRole(claimRole) ? claimRole : undefined);
        setLoading(false);
      } else {
        setUser(null);
        setRole(undefined);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, role, loading };
}
