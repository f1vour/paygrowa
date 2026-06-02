import { useNavigate } from "react-router-dom";
import { Plus, Inbox, Wallet, BarChart3, UserPlus, CheckCircle, XCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KpiCard, PageHeader } from "@/components/admin/AdminUi";
import { useAdmin } from "@/context/AdminContext";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const completionsData = [
  { day: "Mon", value: 120 }, { day: "Tue", value: 185 }, { day: "Wed", value: 240 },
  { day: "Thu", value: 200 }, { day: "Fri", value: 310 }, { day: "Sat", value: 280 }, { day: "Sun", value: 195 },
];
const userGrowthData = [
  { day: "W1", users: 8200 }, { day: "W2", users: 10500 }, { day: "W3", users: 14800 },
  { day: "W4", users: 19200 }, { day: "W5", users: 25600 }, { day: "W6", users: 32400 }, { day: "W7", users: 45000 },
];
const earningsData = [
  { day: "Mon", amount: 120000 }, { day: "Tue", amount: 185000 }, { day: "Wed", amount: 240000 },
  { day: "Thu", amount: 195000 }, { day: "Fri", amount: 310000 }, { day: "Sat", amount: 270000 }, { day: "Sun", amount: 180000 },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { tasks, submissions, payments, users, activity } = useAdmin();

  const liveTasks = tasks.filter((t) => t.status === "live").length;
  const pendingReviews = submissions.filter((s) => s.status === "flagged" || s.status === "failed").length;
  const pendingPayments = payments.filter((p) => p.status === "pending").length;
  const totalPayouts = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.net, 0);
  const activeUsers = users.filter((u) => u.status === "active").length;

  const iconForActivity = (t: string) => t === "registration" ? UserPlus : t === "submission" ? FileText : t === "approval" ? CheckCircle : XCircle;
  const colorForActivity = (t: string) => t === "registration" ? "text-primary" : t === "submission" ? "text-secondary" : t === "approval" ? "text-success" : "text-destructive";

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of platform activity and performance" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        <KpiCard label="Total Users" value={users.length.toLocaleString()} sub={`${activeUsers} active`} />
        <KpiCard label="Active Today" value="2,431" sub="+12.5% vs yesterday" accent="secondary" />
        <KpiCard label="Live Tasks" value={liveTasks} sub={`${tasks.length} total`} />
        <KpiCard label="Pending Reviews" value={pendingReviews} sub="Awaiting action" accent="warning" />
        <KpiCard label="Pending Payments" value={pendingPayments} sub="In queue" accent="warning" />
        <KpiCard label="Total Payouts" value={`₦${totalPayouts.toLocaleString()}`} sub="All time" accent="tertiary" />
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        <Button onClick={() => navigate("/admin/tasks?new=1")} className="justify-start gap-2"><Plus className="h-4 w-4" />Create New Task</Button>
        <Button variant="outline" onClick={() => navigate("/admin/submissions")} className="justify-start gap-2"><Inbox className="h-4 w-4" />Review Submissions</Button>
        <Button variant="outline" onClick={() => navigate("/admin/payments")} className="justify-start gap-2"><Wallet className="h-4 w-4" />Process Payments</Button>
        <Button variant="outline" onClick={() => navigate("/admin/analytics")} className="justify-start gap-2"><BarChart3 className="h-4 w-4" />View Analytics</Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <ChartCard title="Daily Task Completions">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={completionsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="grid gap-6 md:grid-cols-2">
            <ChartCard title="User Growth">
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="users" stroke="hsl(var(--secondary))" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Earnings Distributed (₦)">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="amount" fill="hsl(var(--tertiary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* Recent activity */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-bold text-foreground">Recent Activity</h3>
          <div className="mt-4 space-y-3">
            {activity.map((a) => {
              const Icon = iconForActivity(a.type);
              return (
                <div key={a.id} className="flex items-start gap-3 border-b border-border pb-3 last:border-b-0 last:pb-0">
                  <Icon className={`mt-0.5 h-4 w-4 ${colorForActivity(a.type)}`} />
                  <div className="flex-1">
                    <p className="text-xs text-foreground">{a.message}</p>
                    <p className="text-[10px] text-muted-foreground">{a.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 text-sm font-bold text-foreground">{title}</h3>
      {children}
    </div>
  );
}
