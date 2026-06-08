import { useEffect, useState } from "react";
import { CheckCircle, Wallet, TrendingUp, Loader2, Clock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export default function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeTask, trustScore, savingsPercentage } = useApp();
  const stateIn = (location.state as { taskTitle?: string; title?: string; reward?: number; amount?: number }) || {};
  const taskTitle = stateIn.taskTitle || stateIn.title || "Survey";
  const reward = stateIn.reward || stateIn.amount || 1000;
  const [credited, setCredited] = useState(false);
  const [showSavingsModal, setShowSavingsModal] = useState(false);

  useEffect(() => {
    if (!credited) {
      completeTask(taskTitle, reward);
      setCredited(true);
      setTimeout(() => {
        toast.success("Task Submitted", { description: `₦${reward.toLocaleString()} is being verified (approx. 5 minutes)` });
      }, 500);
      if (savingsPercentage === null) {
        setTimeout(() => setShowSavingsModal(true), 1500);
      }
    }
  }, [credited, completeTask, taskTitle, reward, savingsPercentage]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <span className="font-bold text-primary">PayGrowa</span>
      </header>

      <main className="flex flex-1 flex-col items-center px-6 pt-12 pb-8 space-y-6">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-secondary/20 flex items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-secondary-foreground" />
            </div>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-foreground">You earned ₦{reward.toLocaleString()}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Processing (approx. 5 minutes) — your wallet will update once verified</p>
        </div>

        {/* Status tracker */}
        <div className="w-full max-w-xs space-y-0">
          {[
            { label: "Earned", status: "done" as const, sub: "Done" },
            { label: "Verifying (5 minutes)", status: "active" as const, sub: "In progress" },
            { label: "Paid", status: "pending" as const, sub: "Pending" },
          ].map(({ label, status, sub }, i) => (
            <div key={label} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  status === "done" ? "bg-success" : status === "active" ? "bg-primary" : "bg-muted"
                }`}>
                  {status === "done" ? <CheckCircle className="h-4 w-4 text-success-foreground" /> :
                   status === "active" ? <Loader2 className="h-4 w-4 text-primary-foreground animate-spin" /> :
                   <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />}
                </div>
                {i < 2 && <div className={`h-8 w-0.5 ${status === "done" ? "bg-success/30" : "bg-border"}`} />}
              </div>
              <div className="pt-1">
                <p className={`text-sm font-semibold ${status === "pending" ? "text-muted-foreground" : "text-foreground"}`}>{label}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid w-full max-w-sm grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <Clock className="mb-2 h-5 w-5 text-warning" />
            <p className="text-xs text-muted-foreground">Status</p>
            <p className="text-sm font-bold text-foreground">Verifying</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <TrendingUp className="mb-2 h-5 w-5 text-success" />
            <p className="text-xs text-muted-foreground">Trust Score</p>
            <p className="text-lg font-bold text-foreground">+{trustScore}</p>
          </div>
        </div>

        <Button size="lg" className="w-full max-w-sm" onClick={() => navigate("/dashboard")}>
          Go to Dashboard
        </Button>
      </main>

      {showSavingsModal && <SavingsNudgeModal onClose={() => setShowSavingsModal(false)} reward={reward} />}
    </div>
  );
}

function SavingsNudgeModal({ onClose, reward }: { onClose: () => void; reward: number }) {
  const { setSavingsPreference } = useApp();

  const handleSelect = (pct: number | null) => {
    setSavingsPreference(pct);
    onClose();
    if (pct) toast.success(`Savings set to ${pct}%`, { description: "You can change this anytime in Settings" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-sm rounded-t-2xl bg-card p-6 space-y-4 animate-fade-in sm:rounded-2xl">
        <div className="text-center">
          <p className="text-2xl">🎉</p>
          <h2 className="mt-2 text-lg font-bold text-foreground">You earned ₦{reward.toLocaleString()}!</h2>
          <p className="mt-1 text-sm text-muted-foreground">Start building an emergency fund with small savings.</p>
        </div>
        <div className="space-y-3">
          <button onClick={() => handleSelect(5)} className="flex w-full items-center justify-between rounded-xl border border-border bg-background p-4 tap-scale hover:border-primary/30">
            <span className="text-sm font-medium text-foreground">Save 5%</span>
            <span className="text-xs text-muted-foreground">₦{(reward * 0.05).toLocaleString()} per task</span>
          </button>
          <button onClick={() => handleSelect(10)} className="flex w-full items-center justify-between rounded-xl border border-border bg-background p-4 tap-scale hover:border-primary/30">
            <span className="text-sm font-medium text-foreground">Save 10%</span>
            <span className="text-xs text-muted-foreground">₦{(reward * 0.1).toLocaleString()} per task</span>
          </button>
          <button onClick={() => handleSelect(null)} className="w-full rounded-xl p-3 text-center text-sm text-muted-foreground tap-scale hover:text-foreground">
            Skip for now
          </button>
        </div>
        <p className="text-center text-[10px] text-muted-foreground">You can change this anytime</p>
      </div>
    </div>
  );
}
