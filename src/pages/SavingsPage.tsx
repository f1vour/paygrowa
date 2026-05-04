import { PiggyBank, Shield, Settings } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { useApp } from "@/context/AppContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const GOAL = 10000;

export default function SavingsPage() {
  const { savingsBalance, savingsPercentage, setSavingsPreference } = useApp();
  const [showSettings, setShowSettings] = useState(false);

  const progressPct = Math.min((savingsBalance / GOAL) * 100, 100);

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <AppHeader />
      <main className="flex-1 px-4 pt-4 space-y-4">
        {/* Savings card */}
        <div className="rounded-2xl bg-tertiary p-5 text-center">
          <PiggyBank className="mx-auto mb-2 h-8 w-8 text-tertiary-foreground/80" />
          <p className="text-xs font-medium text-tertiary-foreground/70">Emergency Fund</p>
          <p className="mt-1 text-3xl font-extrabold text-tertiary-foreground">₦{savingsBalance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p>
          <p className="mt-1 text-xs text-tertiary-foreground/60">Goal: ₦{GOAL.toLocaleString()}</p>
        </div>

        {/* Progress */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{progressPct.toFixed(1)}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-tertiary transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>₦{savingsBalance.toLocaleString()}</span>
            <span>₦{GOAL.toLocaleString()}</span>
          </div>
        </div>

        {/* Savings preference */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Auto-Save</p>
              <p className="text-xs text-muted-foreground">
                {savingsPercentage ? `${savingsPercentage}% of each earning` : "Not active"}
              </p>
            </div>
            <button onClick={() => setShowSettings(true)} className="rounded-lg bg-muted p-2 tap-scale">
              <Settings className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Trust */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/60">
          <Shield className="h-3 w-3" />
          Your savings are protected by PayGrowa
        </div>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm sm:items-center" onClick={() => setShowSettings(false)}>
          <div className="w-full max-w-sm rounded-t-2xl bg-card p-6 space-y-4 animate-fade-in sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-foreground">Savings Settings</h2>
            <div className="space-y-2">
              {[5, 10, null].map((pct) => (
                <button
                  key={String(pct)}
                  onClick={() => {
                    setSavingsPreference(pct);
                    setShowSettings(false);
                    toast.success(pct ? `Auto-save set to ${pct}%` : "Auto-save turned off");
                  }}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 tap-scale ${
                    savingsPercentage === pct ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <span className="text-sm font-medium text-foreground">{pct ? `Save ${pct}%` : "Turn off savings"}</span>
                  {savingsPercentage === pct && <div className="h-3 w-3 rounded-full bg-primary" />}
                </button>
              ))}
            </div>
            <Button variant="outline" className="w-full" onClick={() => setShowSettings(false)}>Close</Button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
