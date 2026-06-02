import { PageHeader, KpiCard } from "@/components/admin/AdminUi";
import { useAdmin } from "@/context/AdminContext";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts";

const userGrowth = [
  { m: "Jan", users: 5200 }, { m: "Feb", users: 8400 }, { m: "Mar", users: 12100 },
  { m: "Apr", users: 17800 }, { m: "May", users: 25300 }, { m: "Jun", users: 35400 }, { m: "Jul", users: 45000 },
];
const dailyActive = [
  { d: "M", users: 2100 }, { d: "T", users: 2350 }, { d: "W", users: 2600 },
  { d: "T", users: 2800 }, { d: "F", users: 3200 }, { d: "S", users: 2900 }, { d: "S", users: 2431 },
];

export default function AdminAnalytics() {
  const { tasks, payments } = useAdmin();

  const liveTasks = tasks.filter((t) => t.status === "live").length;
  const totalEarningsPaid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.net, 0);
  const totalSavingsGen = payments.reduce((s, p) => s + p.savingsDeduction, 0);
  const totalWithdrawals = totalEarningsPaid; // mock
  const avgApproval = Math.round(tasks.filter((t) => t.approvalRate).reduce((s, t) => s + (t.approvalRate || 0), 0) / Math.max(tasks.filter((t) => t.approvalRate).length, 1));

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Monitor platform performance and key metrics" />

      {/* Task metrics */}
      <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Task Metrics</h2>
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <KpiCard label="Total Tasks" value={tasks.length} />
        <KpiCard label="Live Tasks" value={liveTasks} accent="secondary" />
        <KpiCard label="Completion Rate" value="76%" sub="Tasks finished vs started" />
        <KpiCard label="Approval Rate" value={`${avgApproval}%`} accent="secondary" />
      </div>

      {/* User metrics */}
      <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">User Metrics</h2>
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <h3 className="mb-4 text-sm font-bold text-foreground">User Growth</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={userGrowth}>
              <defs>
                <linearGradient id="ug" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#ug)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-4">
          <KpiCard label="Daily Active Users" value="2,431" sub="Last 24 hrs" />
          <KpiCard label="Monthly Active Users" value="35,402" sub="Last 30 days" accent="secondary" />
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-bold text-foreground">Daily Active Users (last 7 days)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={dailyActive}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="d" stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="users" stroke="hsl(var(--secondary))" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Financial metrics */}
      <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Financial Metrics</h2>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Earnings Paid" value={`₦${totalEarningsPaid.toLocaleString()}`} accent="secondary" />
        <KpiCard label="Savings Generated" value={`₦${totalSavingsGen.toLocaleString()}`} accent="tertiary" />
        <KpiCard label="Total Withdrawals" value={`₦${totalWithdrawals.toLocaleString()}`} />
      </div>

      {/* Task performance */}
      <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Task Performance</h2>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Task</th>
              <th className="px-4 py-3 text-right font-semibold">Slots Filled</th>
              <th className="px-4 py-3 text-right font-semibold">Slots Remaining</th>
              <th className="px-4 py-3 text-right font-semibold">Approval Rate</th>
              <th className="px-4 py-3 text-right font-semibold">Avg Completion</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => {
              const lowApproval = (t.approvalRate || 0) < 60 && t.approvalRate !== 0;
              return (
                <tr key={t.id} className={`border-b border-border last:border-b-0 ${lowApproval ? "bg-destructive/5" : "hover:bg-muted/30"}`}>
                  <td className="px-4 py-3 font-medium text-foreground">{t.title}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{t.slotsFilled}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{Math.max(0, t.slots - t.slotsFilled)}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${lowApproval ? "text-destructive" : "text-success"}`}>{t.approvalRate || 0}%</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{t.avgCompletionMin || 0}m</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="border-t border-border bg-muted/30 px-4 py-2 text-[10px] text-muted-foreground">
          Tasks below 60% approval rate are highlighted in red.
        </div>
      </div>
    </div>
  );
}
