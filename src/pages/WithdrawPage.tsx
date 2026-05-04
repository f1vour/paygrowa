import { useState } from "react";
import { ArrowLeft, Shield, Building2, Smartphone, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export default function WithdrawPage() {
  const navigate = useNavigate();
  const { walletBalance, withdraw } = useApp();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"bank" | "wallet">("bank");

  const numAmount = parseFloat(amount) || 0;
  const valid = numAmount >= 500 && numAmount <= walletBalance;

  const handleWithdraw = () => {
    if (!valid) return;
    withdraw(numAmount);
    toast.success("Withdrawal initiated", { description: `₦${numAmount.toLocaleString()} will be sent shortly` });
    navigate("/wallet");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="tap-scale"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <span className="font-bold text-foreground">Withdraw</span>
      </header>

      <main className="flex-1 px-4 pt-6 pb-8 space-y-5">
        {/* Available balance */}
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <p className="text-xs text-muted-foreground">Available Balance</p>
          <p className="text-2xl font-bold text-foreground">₦{walletBalance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p>
        </div>

        {/* Amount input */}
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground">Amount (₦)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="h-12 w-full rounded-lg border border-input bg-background px-3 text-lg font-bold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <p className="mt-1 text-xs text-muted-foreground">Minimum withdrawal: ₦500</p>
        </div>

        {/* Payment method */}
        <div>
          <label className="mb-2 block text-xs font-medium text-foreground">Payment Method</label>
          <div className="space-y-2">
            {[
              { id: "bank" as const, label: "Bank Transfer", desc: "GTBank ****4521", icon: Building2 },
              { id: "wallet" as const, label: "Mobile Wallet", desc: "OPay / PalmPay", icon: Smartphone },
            ].map(({ id, label, desc, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setMethod(id)}
                className={`flex w-full items-center gap-3 rounded-xl border p-4 tap-scale ${
                  method === id ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                <div className="rounded-lg bg-muted p-2"><Icon className="h-5 w-5 text-foreground" /></div>
                <div className="text-left flex-1">
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                {method === id && <CheckCircle className="h-5 w-5 text-primary" />}
              </button>
            ))}
          </div>
        </div>

        {/* Verified badge */}
        <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-xs text-muted-foreground">Verified payment destination</span>
        </div>

        <Button size="lg" className="w-full" disabled={!valid} onClick={handleWithdraw}>
          Withdraw ₦{numAmount > 0 ? numAmount.toLocaleString() : "0"}
        </Button>
      </main>
    </div>
  );
}
