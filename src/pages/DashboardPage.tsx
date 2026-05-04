import { Wallet, Clock, ArrowRight, UserCheck, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { useApp } from "@/context/AppContext";

const tasks = [
  { id: "1", title: "Student Spending Habits Survey", time: "10 mins", reward: 1000, verified: true },
  { id: "2", title: "Social Media Usage Survey", time: "5 mins", reward: 500, verified: true },
  { id: "3", title: "Daily Routine & Lifestyle Survey", time: "8 mins", reward: 800, verified: true },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { walletBalance, user, profileCompleted } = useApp();

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <AppHeader />

      <main className="flex-1 px-4 pt-4 space-y-4">
        {/* Hero banner */}
        <div className="rounded-2xl bg-primary p-5">
          <h2 className="text-lg font-bold text-primary-foreground">
            {walletBalance === 0 ? "Your first task is ready 🎯" : `Welcome back, ${user?.firstName}!`}
          </h2>
          <p className="mt-1 text-sm text-primary-foreground/80">
            {walletBalance === 0 ? "Start earning immediately" : "Keep completing tasks to earn more"}
          </p>
        </div>

        {/* Wallet card */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wallet className="h-4 w-4" />
            <span className="text-xs font-medium">Wallet Balance</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">₦{walletBalance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p>
        </div>

        {/* Action banners */}
        {!profileCompleted && (
          <button
            onClick={() => navigate("/profile-setup")}
            className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 tap-scale"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2"><UserCheck className="h-4 w-4 text-primary" /></div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">Complete your profile</p>
                <p className="text-xs text-muted-foreground">Unlock more tasks</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </button>
        )}

        <button className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 tap-scale">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success/10 p-2"><ShieldCheck className="h-4 w-4 text-success" /></div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Verify your identity</p>
              <p className="text-xs text-muted-foreground">Access ₦3,000 – ₦5,000 tasks</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* Task list */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Available Tasks</h3>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{task.title}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{task.time}</span>
                    <span className="font-semibold text-success">₦{task.reward.toLocaleString()}</span>
                  </div>
                </div>
                <Button size="sm" onClick={() => navigate(`/task/${task.id}`)} className="tap-scale">
                  Start Task
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
