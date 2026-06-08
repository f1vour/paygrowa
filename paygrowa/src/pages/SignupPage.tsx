import { useState, useMemo } from "react";
import { Lock, CheckCircle, Banknote, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import PayGrowaLogo from "@/components/PayGrowaLogo";
import signupHero from "@/assets/signup-hero.jpg";
import { lovable } from "@/integrations/lovable";
import { toast } from "@/hooks/use-toast";
import GoogleIcon from "@/components/GoogleIcon";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useApp();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [agreed, setAgreed] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);

  const pwChecks = useMemo(() => ({
    length: form.password.length >= 8,
    upper: /[A-Z]/.test(form.password),
    number: /[0-9]/.test(form.password),
    symbol: /[^A-Za-z0-9]/.test(form.password),
  }), [form.password]);

  const allPwValid = Object.values(pwChecks).every(Boolean);
  const passwordsMatch = form.password === form.confirmPassword && form.confirmPassword.length > 0;
  const formValid = form.firstName.trim() && form.lastName.trim() && form.email.includes("@") && allPwValid && passwordsMatch && agreed;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid) return;
    signup(form.firstName.trim(), form.lastName.trim(), form.email.trim());
    navigate("/dashboard");
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      {/* Left - Image (desktop only, mobile: small banner) */}
      <div className="relative hidden md:flex md:w-1/2 md:items-center md:justify-center">
        <img src={signupHero} alt="People using PayGrowa" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="relative z-10 px-12 text-center">
          <PayGrowaLogo size="lg" clickable={false} className="justify-center mb-4" />
          <p className="text-lg font-semibold text-white">Earn money completing simple tasks</p>
          <p className="mt-2 text-sm text-white/70">Join 45,000+ active taskers across Nigeria</p>
        </div>
      </div>

      {/* Mobile banner */}
      <div className="relative h-32 md:hidden">
        <img src={signupHero} alt="People using PayGrowa" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="relative z-10 flex h-full items-center justify-center">
          <PayGrowaLogo size="lg" clickable={true} />
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex flex-1 flex-col md:w-1/2">
        <header className="hidden md:flex items-center justify-end border-b border-border px-6 py-3">
          <button onClick={() => navigate("/login")} className="text-sm font-medium text-primary tap-scale">
            Sign In
          </button>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-6 py-8">
          <div className="w-full max-w-md">
            <h1 className="mb-1 text-2xl font-bold text-foreground">Create Account</h1>
            <p className="mb-6 text-sm text-muted-foreground">Join thousands earning with PayGrowa. It's free and secure.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <InputField label="First Name" value={form.firstName} onChange={set("firstName")} placeholder="Chidera" />
                <InputField label="Last Name" value={form.lastName} onChange={set("lastName")} placeholder="Okonkwo" />
              </div>
              <InputField label="Email Address" value={form.email} onChange={set("email")} type="email" placeholder="you@email.com" />
              <InputField
                label="Password"
                value={form.password}
                onChange={set("password")}
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                suffix={<button type="button" onClick={() => setShowPw(!showPw)} className="text-muted-foreground">{showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
              />

              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {[
                  { key: "length", label: "8+ characters" },
                  { key: "upper", label: "1 uppercase" },
                  { key: "number", label: "1 number" },
                  { key: "symbol", label: "1 symbol" },
                ].map(({ key, label }) => (
                  <div key={key} className={`flex items-center gap-1 ${pwChecks[key as keyof typeof pwChecks] ? "text-success" : "text-muted-foreground"}`}>
                    <CheckCircle className="h-3 w-3" />
                    {label}
                  </div>
                ))}
              </div>

              <InputField
                label="Confirm Password"
                value={form.confirmPassword}
                onChange={set("confirmPassword")}
                type={showCpw ? "text" : "password"}
                placeholder="••••••••"
                suffix={<button type="button" onClick={() => setShowCpw(!showCpw)} className="text-muted-foreground">{showCpw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
              />
              {form.confirmPassword && !passwordsMatch && (
                <p className="text-xs text-destructive">Passwords do not match</p>
              )}

              <label className="flex items-start gap-2 text-xs text-muted-foreground">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border accent-primary" />
                <span>I agree to the <span className="text-primary underline">Terms of Service</span> and <span className="text-primary underline">Privacy Policy</span></span>
              </label>

              <Button type="submit" size="lg" className="w-full" disabled={!formValid}>
                Create Account
              </Button>
            </form>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <button
              type="button"
              onClick={async () => {
                const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
                if (res.error) toast({ title: "Google sign-up failed", description: res.error.message, variant: "destructive" });
              }}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-input bg-background text-sm font-medium text-foreground hover:bg-muted tap-scale"
            >
              <GoogleIcon /> Continue with Google
            </button>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button onClick={() => navigate("/login")} className="font-medium text-primary tap-scale">Log In</button>
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { icon: Lock, title: "Secure Data", desc: "256-bit encryption" },
                { icon: CheckCircle, title: "Verified Tasks", desc: "Quality-checked" },
                { icon: Banknote, title: "Fast Payouts", desc: "Within 1 hour" },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card p-3 text-center">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-semibold text-foreground">{title}</span>
                  <span className="text-[10px] text-muted-foreground">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </main>

        <footer className="border-t border-border px-4 py-3 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} PayGrowa
        </footer>
      </div>
    </div>
  );
}

function InputField({ label, suffix, ...props }: { label: string; suffix?: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-foreground">{label}</label>
      <div className="relative">
        <input
          {...props}
          className="h-12 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {suffix && <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>}
      </div>
    </div>
  );
}
