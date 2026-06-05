import { useState } from "react";
import { PiggyBank, Plus, Settings, Target, ArrowLeft } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const GOAL_CATEGORIES = [
  "Emergency Fund", "Education", "Business", "Family Support", "Personal Purchase", "Travel", "Other",
];

export default function SavingsPage() {
  const { savingsBalance, savingsGoals, walletBalance, addSavingsGoal, editSavingsGoal, addMoneyToGoal, savingsPercentage, setSavingsPreference } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState<string | null>(null);
  const [showEdit, setShowEdit] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <AppHeader />
      <main className="flex-1 px-4 pt-4 space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-foreground">Savings</h1>
          <p className="text-sm text-muted-foreground">Plan and track your savings goals</p>
        </div>

        {/* Total savings */}
        <div className="rounded-2xl bg-tertiary p-5 text-center">
          <PiggyBank className="mx-auto mb-2 h-8 w-8 text-tertiary-foreground/80" />
          <p className="text-xs font-medium text-tertiary-foreground/70">Total Savings</p>
          <p className="mt-1 text-3xl font-extrabold text-tertiary-foreground">₦{savingsBalance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p>
        </div>

        {/* Goals list */}
        {savingsGoals.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <Target className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm font-medium text-foreground">No savings goals yet</p>
            <p className="text-xs text-muted-foreground mb-4">Create a goal to start saving</p>
            <Button onClick={() => setShowCreate(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Create Goal
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {savingsGoals.map((goal) => {
                const pct = goal.targetAmount > 0 ? Math.min((goal.savedAmount / goal.targetAmount) * 100, 100) : 0;
                return (
                  <div key={goal.id} className="rounded-xl border border-border bg-card p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-foreground">{goal.name}</p>
                        <p className="text-xs text-muted-foreground">{goal.category}</p>
                      </div>
                      <span className="text-xs font-semibold text-tertiary">{pct.toFixed(0)}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-tertiary transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>₦{goal.savedAmount.toLocaleString()}</span>
                      <span>₦{goal.targetAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" onClick={() => setShowAddMoney(goal.id)}>Add Money</Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setShowEdit(goal.id)}>Edit Goal</Button>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button variant="outline" className="w-full gap-2" onClick={() => setShowCreate(true)}>
              <Plus className="h-4 w-4" /> Add Another Goal
            </Button>
          </>
        )}

        {/* Settings */}
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
      </main>

      {/* Create Goal Modal */}
      {showCreate && <CreateGoalModal onClose={() => setShowCreate(false)} onSave={(g) => { addSavingsGoal(g); setShowCreate(false); toast.success("Savings goal created!"); }} />}

      {/* Add Money Modal */}
      {showAddMoney && <AddMoneyModal goalId={showAddMoney} walletBalance={walletBalance} onClose={() => setShowAddMoney(null)} onAdd={(goalId, amt) => { addMoneyToGoal(goalId, amt); setShowAddMoney(null); toast.success(`₦${amt.toLocaleString()} added to savings`); }} />}

      {/* Edit Goal Modal */}
      {showEdit && <EditGoalModal goal={savingsGoals.find((g) => g.id === showEdit)!} onClose={() => setShowEdit(null)} onSave={(id, updates) => { editSavingsGoal(id, updates); setShowEdit(null); toast.success("Goal updated"); }} />}

      {/* Settings Modal */}
      {showSettings && (
        <ModalWrapper onClose={() => setShowSettings(false)}>
          <h2 className="text-lg font-bold text-foreground">Savings Settings</h2>
          <div className="space-y-2">
            {[5, 10, null].map((pct) => (
              <button
                key={String(pct)}
                onClick={() => { setSavingsPreference(pct); setShowSettings(false); toast.success(pct ? `Auto-save set to ${pct}%` : "Auto-save turned off"); }}
                className={`flex w-full items-center justify-between rounded-xl border p-4 tap-scale ${savingsPercentage === pct ? "border-primary bg-primary/5" : "border-border"}`}
              >
                <span className="text-sm font-medium text-foreground">{pct ? `Save ${pct}%` : "Turn off savings"}</span>
                {savingsPercentage === pct && <div className="h-3 w-3 rounded-full bg-primary" />}
              </button>
            ))}
          </div>
          <Button variant="outline" className="w-full" onClick={() => setShowSettings(false)}>Close</Button>
        </ModalWrapper>
      )}

      <BottomNav />
    </div>
  );
}

function ModalWrapper({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div className="w-full max-w-sm rounded-t-2xl bg-card p-6 space-y-4 animate-fade-in sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function CreateGoalModal({ onClose, onSave }: { onClose: () => void; onSave: (g: { name: string; category: string; targetAmount: number; timeframe: "weekly" | "monthly" | null }) => void }) {
  const [category, setCategory] = useState("");
  const [customName, setCustomName] = useState("");
  const [target, setTarget] = useState("");
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | null>(null);

  const name = category === "Other" ? customName : category;
  const valid = name && parseFloat(target) > 0;

  return (
    <ModalWrapper onClose={onClose}>
      <h2 className="text-lg font-bold text-foreground">Create Savings Goal</h2>
      <div>
        <label className="mb-2 block text-xs font-medium text-foreground">What are you saving for?</label>
        <div className="grid grid-cols-2 gap-2">
          {GOAL_CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} className={`rounded-lg border p-3 text-xs font-medium tap-scale ${category === cat ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground"}`}>
              {cat}
            </button>
          ))}
        </div>
        {category === "Other" && (
          <input value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="Enter goal name" className="mt-2 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
        )}
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-foreground">Set your target amount (₦)</label>
        <input type="number" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="e.g. 50000" className="h-12 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
      </div>
      <div>
        <label className="mb-2 block text-xs font-medium text-foreground">Set timeframe (optional)</label>
        <div className="flex gap-2">
          {(["weekly", "monthly"] as const).map((tf) => (
            <button key={tf} onClick={() => setTimeframe(timeframe === tf ? null : tf)} className={`flex-1 rounded-lg border p-3 text-xs font-medium capitalize tap-scale ${timeframe === tf ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground"}`}>
              {tf}
            </button>
          ))}
        </div>
      </div>
      <Button className="w-full" disabled={!valid} onClick={() => onSave({ name, category, targetAmount: parseFloat(target), timeframe })}>
        Create Savings Goal
      </Button>
    </ModalWrapper>
  );
}

function AddMoneyModal({ goalId, walletBalance, onClose, onAdd }: { goalId: string; walletBalance: number; onClose: () => void; onAdd: (goalId: string, amount: number) => void }) {
  const [amount, setAmount] = useState("");
  const num = parseFloat(amount) || 0;
  const valid = num > 0 && num <= walletBalance;

  return (
    <ModalWrapper onClose={onClose}>
      <h2 className="text-lg font-bold text-foreground">Add Money to Savings</h2>
      <p className="text-xs text-muted-foreground">Available: ₦{walletBalance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p>
      <div>
        <label className="mb-1 block text-xs font-medium text-foreground">Amount (₦)</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="h-12 w-full rounded-lg border border-input bg-background px-3 text-lg font-bold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
        {num > walletBalance && <p className="mt-1 text-xs text-destructive">Insufficient wallet balance</p>}
      </div>
      <Button className="w-full" disabled={!valid} onClick={() => onAdd(goalId, num)}>
        Move to Savings
      </Button>
    </ModalWrapper>
  );
}

function EditGoalModal({ goal, onClose, onSave }: { goal: { id: string; name: string; category: string; targetAmount: number; timeframe: "weekly" | "monthly" | null }; onClose: () => void; onSave: (id: string, updates: any) => void }) {
  const [category, setCategory] = useState(goal.category);
  const [customName, setCustomName] = useState(GOAL_CATEGORIES.includes(goal.category) ? "" : goal.name);
  const [target, setTarget] = useState(String(goal.targetAmount));
  const [timeframe, setTimeframe] = useState(goal.timeframe);

  const name = category === "Other" ? customName : category;
  const valid = name && parseFloat(target) > 0;

  return (
    <ModalWrapper onClose={onClose}>
      <h2 className="text-lg font-bold text-foreground">Edit Goal</h2>
      <div>
        <label className="mb-2 block text-xs font-medium text-foreground">Category</label>
        <div className="grid grid-cols-2 gap-2">
          {GOAL_CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} className={`rounded-lg border p-3 text-xs font-medium tap-scale ${category === cat ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground"}`}>
              {cat}
            </button>
          ))}
        </div>
        {category === "Other" && (
          <input value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="Enter goal name" className="mt-2 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
        )}
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-foreground">Target amount (₦)</label>
        <input type="number" value={target} onChange={(e) => setTarget(e.target.value)} className="h-12 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
      </div>
      <div>
        <label className="mb-2 block text-xs font-medium text-foreground">Timeframe</label>
        <div className="flex gap-2">
          {(["weekly", "monthly"] as const).map((tf) => (
            <button key={tf} onClick={() => setTimeframe(timeframe === tf ? null : tf)} className={`flex-1 rounded-lg border p-3 text-xs font-medium capitalize tap-scale ${timeframe === tf ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground"}`}>
              {tf}
            </button>
          ))}
        </div>
      </div>
      <Button className="w-full" disabled={!valid} onClick={() => onSave(goal.id, { name, category, targetAmount: parseFloat(target), timeframe })}>
        Save Changes
      </Button>
    </ModalWrapper>
  );
}
