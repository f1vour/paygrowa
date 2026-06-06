import { Wallet, Clock, ArrowRight, UserCheck, ShieldCheck, MapPin, Lock, TrendingUp, Trophy, Medal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { useApp, trustLevel, nextLevelTarget } from "@/context/AppContext";
import { toast } from "sonner";

const surveyTasks = [
  { id: "1", title: "Student Spending Habits Survey", time: "10 mins", reward: 1000 },
  { id: "2", title: "Social Media Usage Survey", time: "5 mins", reward: 500 },
  { id: "3", title: "Daily Routine & Lifestyle Survey", time: "8 mins", reward: 800 },
];

const communityTasks = [
  { id: "c1", title: "Report a Road Condition", time: "5 mins", reward: 1500 },
  { id: "c2", title: "Capture Environmental Conditions", time: "5 mins", reward: 1200 },
];

const topThree = [
  { rank: 1, name: "Adeola O.", score: 98 },
  { rank: 2, name: "Tunde A.", score: 97 },
  { rank: 3, name: "Ngozi E.", score: 96 },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { walletBalance, user, profileCompleted, identityStatus, trustScore } = useApp();
  const level = trustLevel(trustScore);
  const next = nextLevelTarget(trustScore);
  const progressToNext = Math.min(100, Math.round((trustScore / next.threshold) * 100));

  // Eligibility — incomplete profile gates premium tasks
  const profileInfoPct = profileCompleted ? 100 : 70; // illustrative
  const fullyOnboarded = profileCompleted && identityStatus === "Verified";

  // Welcome toast once per session
  const [welcomed, setWelcomed] = useState(false);
  useEffect(() => {
    if (!welcomed && user) {
      toast.success(`Welcome back, ${user.firstName}! 🎯`);
      setWelcomed(true);
    }
  }, [welcomed, user]);

  const [lockMsg, setLockMsg] = useState<string | null>(null);

  const handleTaskClick = (route: string, locked: boolean) => {
    if (locked) {
      setLockMsg("Complete your profile and verify your identity to unlock this task.");
      return;
    }
    navigate(route);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-24">
      <AppHeader />

      <main className="flex-1 px-4 pt-4 space-y-4">
        {/* Hero */}
        <div className="rounded-2xl bg-primary p-5">
          <h2 className="text-lg font-bold text-primary-foreground">
            {walletBalance === 0 ? "Your first task is ready 🎯" : `Welcome back, ${user?.firstName}!`}
          </h2>
          <p className="mt-1 text-sm text-primary-foreground/80">
            {walletBalance === 0 ? "Start earning immediately" : "Keep completing tasks to earn more"}
          </p>
        </div>

        {/* Wallet */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wallet className="h-4 w-4" /><span className="text-xs font-medium">Wallet Balance</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">₦{walletBalance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p>
        </div>

        {/* Profile Completion Card */}
        {!fullyOnboarded && (
          <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-foreground">Complete your profile</p>
                <p className="text-xs text-muted-foreground">Unlock more earning opportunities and higher-paying tasks.</p>
              </div>
              <UserCheck className="h-5 w-5 text-primary flex-shrink-0" />
            </div>
            <div className="space-y-2">
              <div>
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Profile Information</span>
                  <span className="font-semibold text-foreground">{profileInfoPct}%</span>
                </div>
                <Progress value={profileInfoPct} className="h-1.5" />
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Identity Verification</span>
                <span className={`font-semibold ${identityStatus === "Verified" ? "text-success" : "text-warning"}`}>{identityStatus}</span>
              </div>
            </div>
            <div className="flex gap-2">
              {!profileCompleted && <Button size="sm" className="flex-1" onClick={() => navigate("/profile")}>Complete Profile</Button>}
              {profileCompleted && identityStatus !== "Verified" && identityStatus !== "Pending Review" && (
                <Button size="sm" className="flex-1" onClick={() => navigate("/profile#identity")}>Verify Identity</Button>
              )}
            </div>
          </div>
        )}

        {/* Trust Score Card */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /><span className="text-sm font-bold text-foreground">Contributor Trust Score</span></div>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{level}</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{trustScore}<span className="text-base text-muted-foreground">/100</span></p>
          <div>
            <div className="mb-1 flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">Next: {next.level}</span>
              <span className="font-semibold text-foreground">{trustScore}/{next.threshold}</span>
            </div>
            <Progress value={progressToNext} className="h-1.5" />
          </div>
          <details className="text-xs">
            <summary className="cursor-pointer font-medium text-primary">Score breakdown</summary>
            <div className="mt-2 space-y-1.5 text-muted-foreground">
              <div className="flex justify-between"><span>Task Completion Rate</span><span className="text-foreground">92%</span></div>
              <div className="flex justify-between"><span>Quality Approval Rate</span><span className="text-foreground">88%</span></div>
              <div className="flex justify-between"><span>Verification Status</span><span className="text-foreground">{identityStatus}</span></div>
              <div className="flex justify-between"><span>Consistency</span><span className="text-foreground">76%</span></div>
              <div className="flex justify-between"><span>On-Time Submission Rate</span><span className="text-foreground">95%</span></div>
            </div>
          </details>
        </div>

        {/* Leaderboard widget */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2"><Trophy className="h-4 w-4 text-warning" /><span className="text-sm font-bold text-foreground">Top Contributors</span></div>
            <button onClick={() => navigate("/leaderboard")} className="text-xs font-medium text-primary">View All →</button>
          </div>
          <div className="space-y-2">
            {topThree.map((row) => (
              <div key={row.rank} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Medal className={`h-4 w-4 ${row.rank === 1 ? "text-warning" : row.rank === 2 ? "text-muted-foreground" : "text-tertiary"}`} />
                  <span className="text-foreground">{row.name}</span>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">{row.score}/100</span>
              </div>
            ))}
            <div className="mt-2 border-t border-border pt-2 text-xs text-muted-foreground">Your rank: <span className="font-semibold text-foreground">#47 of 2,315</span></div>
          </div>
        </div>

        {/* Available Tasks preview */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Available Tasks</h3>
            <button onClick={() => navigate("/tasks")} className="text-xs font-medium text-primary">View All →</button>
          </div>
          <div className="space-y-3">
            {surveyTasks.slice(0, 2).map((task) => (
              <TaskRow key={task.id} task={task} locked={false} onClick={() => handleTaskClick(`/task/${task.id}`, false)} />
            ))}
            {surveyTasks.slice(2).map((task) => (
              <TaskRow key={task.id} task={task} locked={!fullyOnboarded} onClick={() => handleTaskClick(`/task/${task.id}`, !fullyOnboarded)} />
            ))}
          </div>
          {!fullyOnboarded && (
            <p className="mt-2 text-xs text-muted-foreground">🔒 More tasks unlock after profile completion</p>
          )}
        </div>

        {/* Community Reporting preview */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Local Community Reporting</h3>
          </div>
          <div className="space-y-3">
            {communityTasks.map((task) => (
              <TaskRow key={task.id} task={task} locked={!fullyOnboarded} onClick={() => handleTaskClick(`/community/${task.id}`, !fullyOnboarded)} />
            ))}
          </div>
        </div>
      </main>

      <BottomNav />

      {lockMsg && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm md:items-center" onClick={() => setLockMsg(null)}>
          <div className="w-full max-w-md rounded-t-2xl bg-card p-5 md:rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-2 text-base font-bold text-foreground">Task locked</h3>
            <p className="mb-3 text-sm text-muted-foreground">This task requires:</p>
            <ul className="mb-4 space-y-1 text-sm text-foreground">
              <li>• Age 18–35</li>
              <li>• Lagos State (or eligible region)</li>
              <li>• English Language</li>
              <li>• Verified Profile</li>
            </ul>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setLockMsg(null)}>Close</Button>
              <Button className="flex-1" onClick={() => { setLockMsg(null); navigate("/profile"); }}>Complete Profile</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskRow({ task, locked, onClick }: { task: { id: string; title: string; time: string; reward: number }; locked: boolean; onClick: () => void }) {
  return (
    <div className={`flex items-center justify-between rounded-xl border border-border bg-card p-4 ${locked ? "opacity-60" : ""}`}>
      <div className="flex-1">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          {locked && <Lock className="h-3 w-3 text-muted-foreground" />} {task.title}
        </p>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{task.time}</span>
          <span className="font-semibold text-success">₦{task.reward.toLocaleString()}</span>
        </div>
      </div>
      <Button size="sm" onClick={onClick} variant={locked ? "outline" : "default"} className="tap-scale">
        {locked ? "Locked" : "Start Task"}
      </Button>
    </div>
  );
}
