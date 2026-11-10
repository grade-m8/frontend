import type { Role } from "@/types/role.ts";
import { useAuth } from "@/hooks/useAuth.ts";
import { toast } from "@/components/handler/toastHandler.tsx";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { RouteLoadingSpinner } from "@/components/layout/RouteLoadingSpinner.tsx";

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
        toast.error("No tenés acceso a esta página");
      }
      return;
    }

    if (hadSession.current) return;

    toast.error("Iniciá sesión para acceder a esta página");
  }, [loading, user, role, allowedRoles]);

  if (loading)
    return <RouteLoadingSpinner message="Preparando tu espacio..." />;
  if (!user || !role)
    return <Navigate to={"/"} state={{ from: location }} replace />;
  if (role === "Admin") return <Outlet />;
  if (!allowedRoles.includes(role)) return <Navigate to={"/"} replace />;

  return <Outlet />;
}
