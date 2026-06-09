import { Navigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";

export default function ClientProtected({ children }: { children: React.ReactNode }) {
  const { authReady, isLoggedIn, role } = useApp();
  if (!authReady) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading…</div>;
  }
  if (!isLoggedIn) return <Navigate to="/organization/login" replace />;
  if (role !== "client" && role !== "admin") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
