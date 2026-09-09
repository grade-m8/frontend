import { useAuth } from "@/hooks/useAuth.ts";
import { Navigate, Outlet } from "react-router-dom";

export default function RedirectIfAuthenticated() {
  const { user, loading } = useAuth();

  if (loading) return <h1>Loading...</h1>;
  if (user) return <Navigate to="/materias" replace />;

  return <Outlet />;
}
