import { Wallet, ArrowDownLeft, TrendingUp, CheckCircle, Loader2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { useApp } from "@/context/AppContext";

export default function WalletPage() {
  const navigate = useNavigate();
  const { walletBalance, transactions } = useApp();

  const earned = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const verifying = transactions.filter((t) => t.status === "verifying" && t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const paid = transactions.filter((t) => t.status === "paid").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <AppHeader />
      <main className="flex-1 px-4 pt-4 space-y-4">
        {/* Balance card */}
        <div className="rounded-2xl bg-primary p-5 text-center">
          <p className="text-xs font-medium text-primary-foreground/70">Total Balance</p>
          <p className="mt-1 text-3xl font-extrabold text-primary-foreground">₦{walletBalance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p>
          <p className="mt-1 text-xs text-primary-foreground/60">This week: ₦{earned.toLocaleString()}</p>
          <Button variant="secondary" size="lg" className="mt-4" onClick={() => navigate("/withdraw")}>
            <ArrowDownLeft className="h-4 w-4" /> Withdraw
          </Button>
        </div>

        {/* Status breakdown */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Earned", amount: earned, icon: TrendingUp, color: "text-success" },
            { label: "Verifying", amount: verifying, icon: Loader2, color: "text-warning" },
            { label: "Paid Out", amount: paid, icon: CheckCircle, color: "text-primary" },
          ].map(({ label, amount, icon: Icon, color }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-3 text-center">
              <Icon className={`mx-auto mb-1 h-4 w-4 ${color}`} />
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-sm font-bold text-foreground">₦{amount.toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Transaction history */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Transaction History</h3>
          {transactions.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <Wallet className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No transactions yet</p>
              <p className="text-xs text-muted-foreground">Complete a task to see your earnings</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${tx.amount > 0 ? "bg-success/10" : "bg-destructive/10"}`}>
                      {tx.amount > 0 ? <TrendingUp className="h-4 w-4 text-success" /> : <ArrowDownLeft className="h-4 w-4 text-destructive" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{tx.title}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${tx.amount > 0 ? "text-success" : "text-destructive"}`}>
                      {tx.amount > 0 ? "+" : ""}₦{Math.abs(tx.amount).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      {tx.status === "verifying" ? <Clock className="h-2.5 w-2.5" /> : <CheckCircle className="h-2.5 w-2.5" />}
                      {tx.status}
                    </div>
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
