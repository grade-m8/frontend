import type { Role } from "@/types/role.ts";
import { useAuth } from "@/hooks/useAuthUser.ts";
import { toast } from "@/components/handler/toastHandler.tsx";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

interface Props {
  allowedRoles: Array<Role>;
}

export default function ProtectedRoutes({ allowedRoles }: Props) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user && !role) {
      toast.error("Need to log in to access page");
    } else if (
      !loading &&
      user &&
      role &&
      role !== "Admin" &&
      !allowedRoles.includes(role)
    ) {
      toast.error("You don't have access to that page");
    }
  }, [loading, user, role, allowedRoles]);

  if (loading) return <h1>Loading...</h1>;
  if (!user || !role)
    return <Navigate to={"/"} state={{ from: location }} replace />;
  if (role === "Admin") return <Outlet />;
  if (!allowedRoles.includes(role)) return <Navigate to={"/403"} replace />;

  return <Outlet />;
}
