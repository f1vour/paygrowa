import { Shield, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AppHeader() {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/95 px-4 py-3 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <span className="text-lg font-bold text-foreground">PayGrowa</span>
      </div>
      <button onClick={() => navigate("/profile")} className="rounded-full bg-muted p-2 tap-scale">
        <User className="h-5 w-5 text-muted-foreground" />
      </button>
    </header>
  );
}
