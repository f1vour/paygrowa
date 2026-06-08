import { useState } from "react";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import PayGrowaLogo from "@/components/PayGrowaLogo";
import orgHero from "@/assets/org-hero.jpg";
import { lovable } from "@/integrations/lovable";
import { toast } from "@/hooks/use-toast";
import GoogleIcon from "@/components/GoogleIcon";

const ORG_TYPES = ["NGO", "Government Agency", "University", "Research Organization", "Company", "Development Partner", "Other"];
const COUNTRIES = ["Nigeria", "Ghana", "Kenya", "South Africa", "Other"];
const STATES = ["Lagos", "Abuja (FCT)", "Rivers", "Kano", "Oyo", "Anambra", "Kaduna", "Enugu", "Other"];

export default function OrganizationSignupPage() {
  const navigate = useNavigate();
  const { signupClient } = useApp();
  const [form, setForm] = useState({
    orgName: "", orgType: "", contactName: "", email: "", phone: "",
    country: "Nigeria", state: "", password: "", confirmPassword: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const valid =
    form.orgName && form.orgType && form.contactName && form.email.includes("@") &&
    form.phone && form.country && form.state && form.password.length >= 8 &&
    form.password === form.confirmPassword && agreed;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    signupClient(form.orgName.trim(), form.contactName.trim(), form.email.trim());
    navigate("/organization/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <div className="relative hidden md:flex md:w-1/2 md:items-center md:justify-center">
        <img src={orgHero} alt="Organizations using PayGrowa" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="relative z-10 px-12 text-center">
          <PayGrowaLogo size="lg" clickable={false} className="justify-center mb-4" />
          <p className="text-lg font-semibold text-white">Collect Reliable Community Data</p>
          <p className="mt-2 text-sm text-white/80">Launch surveys, field projects, and community reporting initiatives across Nigeria.</p>
        </div>
      </div>

      <div className="relative h-32 md:hidden">
        <img src={orgHero} alt="Organizations using PayGrowa" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="relative z-10 flex h-full items-center justify-center">
          <PayGrowaLogo size="lg" clickable={true} />
        </div>
      </div>

      <div className="flex flex-1 flex-col md:w-1/2">
        <header className="hidden md:flex items-center justify-end border-b border-border px-6 py-3">
          <button onClick={() => navigate("/organization/login")} className="text-sm font-medium text-primary tap-scale">Sign In</button>
        </header>

        <main className="flex flex-1 flex-col items-center px-6 py-8">
          <div className="w-full max-w-md">
            <h1 className="mb-1 text-2xl font-bold text-foreground">Create Organization Account</h1>
            <p className="mb-6 text-sm text-muted-foreground">Launch surveys, research studies, and community data projects through PayGrowa.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Organization Name" value={form.orgName} onChange={set("orgName")} placeholder="e.g. PayGrowa Research" />
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground">Organization Type</label>
                <select value={form.orgType} onChange={set("orgType")} className="h-12 w-full rounded-lg border border-input bg-background px-3 text-sm">
                  <option value="">Select type</option>
                  {ORG_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <Field label="Contact Person Name" value={form.contactName} onChange={set("contactName")} placeholder="Full name" />
              <Field label="Work Email" type="email" value={form.email} onChange={set("email")} placeholder="you@org.com" />
              <Field label="Phone Number" value={form.phone} onChange={set("phone")} placeholder="+234..." />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground">Country</label>
                  <select value={form.country} onChange={set("country")} className="h-12 w-full rounded-lg border border-input bg-background px-3 text-sm">
                    {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground">State</label>
                  <select value={form.state} onChange={set("state")} className="h-12 w-full rounded-lg border border-input bg-background px-3 text-sm">
                    <option value="">Select state</option>
                    {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <Field
                label="Password" type={showPw ? "text" : "password"} value={form.password} onChange={set("password")}
                placeholder="At least 8 characters"
                suffix={<button type="button" onClick={() => setShowPw(!showPw)} className="text-muted-foreground">{showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
              />
              <Field label="Confirm Password" type="password" value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="Repeat password" />

              <label className="flex items-start gap-2 text-xs text-muted-foreground">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border accent-primary" />
                <span>I agree to the <span className="text-primary underline">Terms of Service</span> and <span className="text-primary underline">Privacy Policy</span></span>
              </label>

              <Button type="submit" size="lg" className="w-full" disabled={!valid}>Create Organization Account</Button>
            </form>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <button
              type="button"
              onClick={async () => {
                const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/organization/dashboard" });
                if (res.error) toast({ title: "Google sign-up failed", description: res.error.message, variant: "destructive" });
              }}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-input bg-background text-sm font-medium text-foreground hover:bg-muted tap-scale"
            >
              <GoogleIcon /> Continue with Google
            </button>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an organization?{" "}
              <button onClick={() => navigate("/organization/login")} className="font-medium text-primary tap-scale">Sign In</button>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

function Field({ label, suffix, ...props }: { label: string; suffix?: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-foreground">{label}</label>
      <div className="relative">
        <input {...props} className="h-12 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
        {suffix && <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>}
      </div>
    </div>
  );
}
