import { Shield, Clock, Zap, Banknote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-lg font-bold text-foreground">PayGrowa</span>
        </div>
        <button onClick={() => navigate("/login")} className="text-sm font-medium text-primary tap-scale">
          Log In
        </button>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center px-6 pt-12 pb-8">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Shield className="h-3 w-3 text-primary" />
          Secure & Verified
        </div>

        <h1 className="mb-3 text-center text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
          Earn money by completing simple tasks
        </h1>
        <p className="mb-8 max-w-sm text-center text-base text-muted-foreground">
          Complete quick surveys and get paid directly to your wallet. Start earning in minutes.
        </p>

        <div className="flex w-full max-w-sm flex-col gap-3">
          <Button size="xl" variant="hero" className="w-full" onClick={() => navigate("/signup")}>
            Get Started
          </Button>
          <Button size="lg" variant="hero-outline" className="w-full" onClick={() => navigate("/signup")}>
            Sign up with Email
          </Button>
        </div>

        {/* Feature hints */}
        <div className="mt-12 grid w-full max-w-sm grid-cols-3 gap-3">
          {[
            { icon: Banknote, label: "Daily Payouts" },
            { icon: Zap, label: "Quick Tasks" },
            { icon: Clock, label: "5-10 min" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center"
            >
              <Icon className="h-6 w-6 text-primary" />
              <span className="text-xs font-medium text-foreground">{label}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} PayGrowa. All rights reserved.
      </footer>
    </div>
  );
}
