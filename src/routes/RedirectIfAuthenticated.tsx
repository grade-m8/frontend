import { useAuth } from "@/hooks/useAuth.ts";
import { Navigate, Outlet } from "react-router-dom";
import { RouteLoadingSpinner } from "@/components/layout/RouteLoadingSpinner.tsx";

export default function RedirectIfAuthenticated() {
  const { user, role, loading } = useAuth();

  if (loading)
    return <RouteLoadingSpinner message="Preparando tu espacio..." />;
  if (user && role) return <Navigate to="/materias" replace />;

  return <Outlet />;
}
