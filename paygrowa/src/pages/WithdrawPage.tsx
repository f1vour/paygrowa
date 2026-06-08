import { useState, useEffect } from "react";
import { ArrowLeft, Shield, Building2, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

const NIGERIAN_BANKS = [
  "Access Bank", "Citibank Nigeria", "Ecobank Nigeria", "Fidelity Bank",
  "First Bank of Nigeria", "First City Monument Bank (FCMB)", "Globus Bank",
  "Guaranty Trust Bank (GTBank)", "Heritage Bank", "Jaiz Bank", "Keystone Bank",
  "Kuda Bank", "OPay", "PalmPay", "Polaris Bank", "Providus Bank",
  "Stanbic IBTC Bank", "Standard Chartered", "Sterling Bank", "SunTrust Bank",
  "Titan Trust Bank", "Union Bank of Nigeria", "United Bank for Africa (UBA)",
  "Unity Bank", "VFD Microfinance Bank", "Wema Bank", "Zenith Bank",
];

export default function WithdrawPage() {
  const navigate = useNavigate();
  const { walletBalance, withdraw, bankDetails, setBankDetails } = useApp();

  const hasBankSaved = !!bankDetails;
  const [step, setStep] = useState(hasBankSaved ? "amount" : "bank");
  const [selectedBank, setSelectedBank] = useState(bankDetails?.bankName || "");
  const [accountNumber, setAccountNumber] = useState(bankDetails?.accountNumber || "");
  const [accountName, setAccountName] = useState(bankDetails?.accountName || "");
  const [verifying, setVerifying] = useState(false);
  const [amount, setAmount] = useState("");

  // Auto-fetch account name when account number is 10 digits
  useEffect(() => {
    if (accountNumber.length === 10 && selectedBank) {
      setVerifying(true);
      const timer = setTimeout(() => {
        // Simulate account name fetch
        const names = ["Chidera Okonkwo", "Aisha Mohammed", "Emeka Nwankwo", "Funke Adeyemi", "Tunde Balogun"];
        setAccountName(names[Math.floor(Math.random() * names.length)]);
        setVerifying(false);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setAccountName("");
    }
  }, [accountNumber, selectedBank]);

  const numAmount = parseFloat(amount) || 0;
  const validAmount = numAmount >= 500 && numAmount <= walletBalance;

  const handleSaveBank = () => {
    if (!selectedBank || !accountNumber || !accountName) return;
    setBankDetails({ bankName: selectedBank, accountNumber, accountName });
    setStep("amount");
    toast.success("Bank details saved");
  };

  const handleWithdraw = () => {
    if (!validAmount) return;
    withdraw(numAmount);
    toast.success("Withdrawal initiated", { description: `₦${numAmount.toLocaleString()} will be sent to ${bankDetails?.bankName || selectedBank}` });
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

        {step === "bank" && (
          <>
            {/* Step 1: Select Bank */}
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Select Bank</label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="h-12 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Choose your bank</option>
                {NIGERIAN_BANKS.map((bank) => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>

            {/* Step 2: Account Number */}
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Account Number</label>
              <input
                type="text"
                maxLength={10}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 10-digit account number"
                className="h-12 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Step 3: Account Name Verification */}
            {verifying && (
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="text-xs text-muted-foreground">Verifying account...</span>
              </div>
            )}

            {accountName && !verifying && (
              <div className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-3">
                <CheckCircle className="h-4 w-4 text-success" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Account Verified</p>
                  <p className="text-sm font-semibold text-foreground">{accountName}</p>
                </div>
              </div>
            )}

            <Button size="lg" className="w-full" disabled={!selectedBank || !accountNumber || !accountName || verifying} onClick={handleSaveBank}>
              Continue
            </Button>
          </>
        )}

        {step === "amount" && (
          <>
            {/* Show saved bank */}
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
              <div className="rounded-lg bg-muted p-2"><Building2 className="h-5 w-5 text-foreground" /></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{bankDetails?.bankName || selectedBank}</p>
                <p className="text-xs text-muted-foreground">{bankDetails?.accountName || accountName} · ****{(bankDetails?.accountNumber || accountNumber).slice(-4)}</p>
              </div>
              <button onClick={() => setStep("bank")} className="text-xs text-primary font-medium tap-scale">Change</button>
            </div>

            {/* Step 4: Amount */}
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
              {numAmount > walletBalance && (
                <p className="mt-1 text-xs text-destructive">Amount exceeds available balance</p>
              )}
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Verified payment destination</span>
            </div>

            {/* Step 5: Confirm */}
            <Button size="lg" className="w-full" disabled={!validAmount} onClick={handleWithdraw}>
              Withdraw ₦{numAmount > 0 ? numAmount.toLocaleString() : "0"}
            </Button>
          </>
        )}
      </main>
    </div>
  );
}
