import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import PayGrowaLogo from "@/components/PayGrowaLogo";
import { isAdminEmail } from "@/lib/adminAllowlist";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const valid = email.includes("@") && password.length >= 8;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    const trimmed = email.trim();
    login(trimmed);
    navigate(isAdminEmail(trimmed) ? "/admin/dashboard" : "/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-6 pt-16 pb-8">
      <div className="mb-8">
        <PayGrowaLogo size="lg" />
      </div>

      <h1 className="mb-1 text-2xl font-bold text-foreground">Welcome back</h1>
      <p className="mb-8 text-sm text-muted-foreground">Log in to continue earning</p>

      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="h-12 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">Password</label>
              <button type="button" className="text-xs text-primary">Forgot password?</button>
            </div>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={!valid}>
            Log In
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">OR</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button onClick={() => navigate("/signup")} className="font-medium text-primary tap-scale">Register now</button>
        </p>
      </div>

      {/* Trust badge */}
      <div className="mt-6 flex items-center gap-2 rounded-lg bg-muted px-4 py-2.5">
        <Lock className="h-4 w-4 text-primary" />
        <div>
          <p className="text-xs font-medium text-foreground">Institutional-grade security</p>
          <p className="text-[10px] text-muted-foreground">Your data is encrypted and protected</p>
        </div>
      </div>

      <footer className="mt-auto pt-8 flex gap-4 text-xs text-muted-foreground">
        <span>Privacy</span>
        <span>Terms</span>
        <span className="flex items-center gap-1"><Lock className="h-3 w-3" />SSL Secured</span>
      </footer>
    </div>
  );
}
