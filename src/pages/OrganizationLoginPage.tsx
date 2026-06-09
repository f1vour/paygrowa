import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PayGrowaLogo from "@/components/PayGrowaLogo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import GoogleIcon from "@/components/GoogleIcon";

export default function OrganizationLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const valid = email.includes("@") && password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setSubmitting(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      return;
    }
    navigate("/organization/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-6 pt-16 pb-8">
      <div className="mb-8"><PayGrowaLogo size="lg" /></div>
      <h1 className="mb-1 text-2xl font-bold text-foreground">Welcome back</h1>
      <p className="mb-8 text-sm text-muted-foreground">Sign in to your organization account</p>

      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Work Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@org.com"
              className="h-12 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                className="h-12 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={!valid}>Sign In</Button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" /><span className="text-xs text-muted-foreground">OR</span><div className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          onClick={async () => {
            const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/organization/dashboard" });
            if (res.error) toast({ title: "Google sign-in failed", description: res.error.message, variant: "destructive" });
          }}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-input bg-background text-sm font-medium text-foreground hover:bg-muted tap-scale"
        >
          <GoogleIcon /> Continue with Google
        </button>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          New organization?{" "}
          <button onClick={() => navigate("/organization/signup")} className="font-medium text-primary tap-scale">Create account</button>
        </p>
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-lg bg-muted px-4 py-2.5">
        <Lock className="h-4 w-4 text-primary" />
        <span className="text-xs text-muted-foreground">Institutional-grade security</span>
      </div>
    </div>
  );
}
