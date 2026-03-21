import { Navigate } from "react-router-dom";
import { useAuthStore, UserRole } from "@/lib/auth-store";

export function ProtectedRoute({ children, role }: { children: React.ReactNode; role: UserRole }) {
  const user = useAuthStore((s) => s.user);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={user.role === "admin" ? "/admin" : "/user"} replace />;

  return <>{children}</>;
}
