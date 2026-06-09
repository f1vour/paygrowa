import { Navigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { isAdminEmail } from "@/lib/adminAllowlist";

export default function AdminProtected({ children }: { children: React.ReactNode }) {
  const { authReady, isLoggedIn, user, role } = useApp();
  if (!authReady) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading…</div>;
  }
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (role !== "admin" && !isAdminEmail(user?.email)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
