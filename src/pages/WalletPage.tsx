import { useEffect } from "react";
import { Wallet, ArrowDownLeft, TrendingUp, CheckCircle, Clock, PiggyBank } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { useApp } from "@/context/AppContext";

export default function WalletPage() {
  const navigate = useNavigate();
  const { walletBalance, transactions, processVerifications, savingsGoals } = useApp();

  // Process verifications on mount and periodically
  useEffect(() => {
    processVerifications();
    const interval = setInterval(processVerifications, 10000);
    return () => clearInterval(interval);
  }, [processVerifications]);

  const verifyingTxs = transactions.filter((t) => t.status === "verifying");
  const completedTxs = transactions.filter((t) => t.status === "paid" || t.status === "completed");

  const activeGoal = savingsGoals[0];

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <AppHeader />
      <main className="flex-1 px-4 pt-4 space-y-4">
        {/* Balance card */}
        <div className="rounded-2xl bg-primary p-5 text-center">
          <p className="text-xs font-medium text-primary-foreground/70">Total Balance</p>
          <p className="mt-1 text-3xl font-extrabold text-primary-foreground">₦{walletBalance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p>
          <Button variant="secondary" size="lg" className="mt-4" onClick={() => navigate("/withdraw")}>
            <ArrowDownLeft className="h-4 w-4" /> Withdraw
          </Button>
        </div>

        {/* Verifying notice */}
        {verifyingTxs.length > 0 && (
          <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-warning" />
              <span className="text-sm font-semibold text-foreground">Processing (approx. 20 minutes)</span>
            </div>
            <p className="text-xs text-muted-foreground">{verifyingTxs.length} task(s) verifying — balance will update once confirmed.</p>
          </div>
        )}

        {/* Savings goal summary */}
        {activeGoal && (
          <button onClick={() => navigate("/savings")} className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 tap-scale">
            <div className="rounded-lg bg-tertiary/10 p-2"><PiggyBank className="h-4 w-4 text-tertiary" /></div>
            <div className="text-left flex-1">
              <p className="text-sm font-semibold text-foreground">{activeGoal.name}</p>
              <p className="text-xs text-muted-foreground">₦{activeGoal.savedAmount.toLocaleString()} / ₦{activeGoal.targetAmount.toLocaleString()}</p>
            </div>
            <span className="text-xs font-medium text-tertiary">{Math.round((activeGoal.savedAmount / activeGoal.targetAmount) * 100)}%</span>
          </button>
        )}

        {/* Transaction history - only completed */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Transaction History</h3>
          {completedTxs.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <Wallet className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No completed transactions yet</p>
              <p className="text-xs text-muted-foreground">Complete a task to see your earnings</p>
            </div>
          ) : (
            <div className="space-y-2">
              {completedTxs.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${tx.type === "task" ? "bg-success/10" : tx.type === "savings" ? "bg-tertiary/10" : "bg-destructive/10"}`}>
                      {tx.type === "task" ? <TrendingUp className="h-4 w-4 text-success" /> : tx.type === "savings" ? <PiggyBank className="h-4 w-4 text-tertiary" /> : <ArrowDownLeft className="h-4 w-4 text-destructive" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{tx.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {tx.type === "task" ? "Task Completed" : tx.type === "savings" ? (tx.goalName ? `Moved to ${tx.goalName}` : "Moved to Savings") : tx.bankName ? `Withdrawal · ${tx.bankName}` : "Withdrawal"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${tx.amount > 0 ? "text-success" : "text-destructive"}`}>
                      {tx.amount > 0 ? "+" : ""}₦{Math.abs(tx.amount).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <CheckCircle className="h-2.5 w-2.5" />
                      {tx.status === "paid" ? "Paid" : "Completed"}
                    </div>
                    <p className="text-[10px] text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
