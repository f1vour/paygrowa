import { Navigate } from "react-router-dom";

// Legacy route — profile setup now lives inside the unified Profile page.
export default function ProfileSetupPage() {
  return <Navigate to="/profile#basic" replace />;
}
