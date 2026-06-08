import { useState } from "react";
import { CheckCircle, XCircle, Flag, Search, Filter } from "lucide-react";
import { PageHeader, StatusBadge, EmptyState, KpiCard } from "@/components/admin/AdminUi";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";

export default function AdminPayments() {
  const { payments, reviewPayment } = useAdmin();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "paid" | "failed">("all");

  const filtered = payments.filter((p) =>
    (filter === "all" || p.status === filter) &&
    (p.userName.toLowerCase().includes(search.toLowerCase()) || p.taskName.toLowerCase().includes(search.toLowerCase())),
  );

  const pending = payments.filter((p) => p.status === "pending");
  const totalPending = pending.reduce((s, p) => s + p.net, 0);
  const totalPaid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.net, 0);

  return (
    <div>
      <PageHeader title="Payments" subtitle="Approve, reject, and monitor all platform payouts" />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Pending Payments" value={pending.length} sub={`₦${totalPending.toLocaleString()} queued`} accent="warning" />
        <KpiCard label="Total Paid" value={`₦${totalPaid.toLocaleString()}`} sub="Successfully disbursed" accent="secondary" />
        <KpiCard label="Approved" value={payments.filter((p) => p.status === "approved").length} sub="Awaiting payout" accent="primary" />
      </div>

      <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <p className="text-xs font-semibold text-foreground">Payment delay logic</p>
        <p className="mt-1 text-xs text-muted-foreground">After successful task completion: status is <strong>Verifying</strong>. After 1 minute, status changes to <strong>Paid</strong> and the user's wallet balance updates. Wallet balance does not update during verification.</p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by user or task…" className="h-9 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm focus:border-primary focus:outline-none" />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          <Filter className="ml-1 h-3 w-3 text-muted-foreground" />
          {(["all", "pending", "approved", "paid", "failed"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-md px-3 py-1 text-xs font-medium capitalize ${filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No payments found" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">User</th>
                <th className="px-4 py-3 text-left font-semibold">Task</th>
                <th className="px-4 py-3 text-right font-semibold">Reward</th>
                <th className="px-4 py-3 text-right font-semibold">Savings</th>
                <th className="px-4 py-3 text-right font-semibold">Net</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Created</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{p.userName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.taskName}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">₦{p.reward.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-tertiary">-₦{p.savingsDeduction.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-bold text-success">₦{p.net.toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{p.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { reviewPayment(p.id, "approve"); toast.success("Payment approved"); }} className="rounded-md p-1.5 text-success hover:bg-success/10" title="Approve"><CheckCircle className="h-4 w-4" /></button>
                      <button onClick={() => { reviewPayment(p.id, "reject"); toast.success("Payment rejected"); }} className="rounded-md p-1.5 text-destructive hover:bg-destructive/10" title="Reject"><XCircle className="h-4 w-4" /></button>
                      <button onClick={() => { reviewPayment(p.id, "flag"); toast.info("Flagged"); }} className="rounded-md p-1.5 text-warning hover:bg-warning/10" title="Flag"><Flag className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
