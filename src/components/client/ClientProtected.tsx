import { Navigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";

export default function ClientProtected({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, role } = useApp();
  if (!isLoggedIn) return <Navigate to="/organization/login" replace />;
  if (role !== "client") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
