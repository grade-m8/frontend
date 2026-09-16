import type { Role } from "@/types/role.ts";
import { useAuth } from "@/hooks/useAuth.ts";
import { toast } from "@/components/handler/toastHandler.tsx";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

interface Props {
  allowedRoles: Array<Role>;
}

export default function ProtectedRoutes({ allowedRoles }: Props) {
  const { user, role, loading } = useAuth();
  const location = useLocation();
  // si la sesión estuvo activa en esta ruta, perderla es un logout, no un acceso denegado
  const hadSession = useRef(false);

  useEffect(() => {
    if (loading) return;

    if (user && role) {
      hadSession.current = true;
      if (role !== "Admin" && !allowedRoles.includes(role)) {
        toast.error("You don't have access to that page");
      }
      return;
    }

    if (hadSession.current) return;

    toast.error("Need to log in to access page");
  }, [loading, user, role, allowedRoles]);

  if (loading) return <h1>Loading...</h1>;
  if (!user || !role)
    return <Navigate to={"/"} state={{ from: location }} replace />;
  if (role === "Admin") return <Outlet />;
  if (!allowedRoles.includes(role)) return <Navigate to={"/"} replace />;

  return <Outlet />;
}
