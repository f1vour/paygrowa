import { Navigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { isAdminEmail } from "@/lib/adminAllowlist";

export default function AdminProtected({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, user } = useApp();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!isAdminEmail(user?.email)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
