import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, StatusBadge, EmptyState } from "@/components/admin/AdminUi";
import { Drawer } from "@/pages/admin/AdminTasks";
import { useAdmin, AdminUser } from "@/context/AdminContext";
import { toast } from "sonner";

export default function AdminUsers() {
  const { users, setUserStatus } = useAdmin();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "suspended">("all");
  const [openUser, setOpenUser] = useState<AdminUser | null>(null);

  const filtered = users.filter((u) =>
    (filter === "all" || u.status === filter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div>
      <PageHeader title="Users" subtitle="Manage platform users and accounts" />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email…" className="h-9 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm focus:border-primary focus:outline-none" />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          <Filter className="ml-1 h-3 w-3 text-muted-foreground" />
          {(["all", "active", "suspended"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-md px-3 py-1 text-xs font-medium capitalize ${filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">State</th>
                <th className="px-4 py-3 text-left font-semibold">Registered</th>
                <th className="px-4 py-3 text-right font-semibold">Tasks</th>
                <th className="px-4 py-3 text-right font-semibold">Wallet</th>
                <th className="px-4 py-3 text-right font-semibold">Savings</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 cursor-pointer" onClick={() => setOpenUser(u)}>
                  <td className="px-4 py-3 font-medium text-foreground">{u.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.state}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{u.registrationDate}</td>
                  <td className="px-4 py-3 text-right text-foreground">{u.tasksCompleted}</td>
                  <td className="px-4 py-3 text-right text-foreground">₦{u.walletBalance.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-tertiary">₦{u.savingsBalance.toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    {u.status === "active" ? (
                      <button onClick={() => { setUserStatus(u.id, "suspended"); toast.success(`${u.name} suspended`); }} className="text-xs font-medium text-destructive hover:underline">Suspend</button>
                    ) : (
                      <button onClick={() => { setUserStatus(u.id, "active"); toast.success(`${u.name} reactivated`); }} className="text-xs font-medium text-success hover:underline">Reactivate</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {openUser && (
        <Drawer title="User Profile" onClose={() => setOpenUser(null)}>
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {openUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">{openUser.name}</p>
                <p className="text-xs text-muted-foreground">{openUser.email}</p>
              </div>
              <StatusBadge status={openUser.status} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Stat label="Tasks Completed" value={openUser.tasksCompleted.toString()} />
              <Stat label="State" value={openUser.state} />
              <Stat label="Wallet Balance" value={`₦${openUser.walletBalance.toLocaleString()}`} />
              <Stat label="Savings Balance" value={`₦${openUser.savingsBalance.toLocaleString()}`} />
              <Stat label="Registered" value={openUser.registrationDate} />
              <Stat label="User ID" value={openUser.id} />
            </div>

            <div>
              <h3 className="mb-2 text-sm font-bold text-foreground">Earnings History</h3>
              <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
                Total earned: ₦{(openUser.walletBalance + openUser.savingsBalance).toLocaleString()} across {openUser.tasksCompleted} tasks
              </div>
            </div>

            <div className="flex gap-2">
              {openUser.status === "active" ? (
                <Button variant="destructive" className="flex-1" onClick={() => { setUserStatus(openUser.id, "suspended"); toast.success("User suspended"); setOpenUser(null); }}>Suspend User</Button>
              ) : (
                <Button className="flex-1" onClick={() => { setUserStatus(openUser.id, "active"); toast.success("User reactivated"); setOpenUser(null); }}>Reactivate User</Button>
              )}
              <Button variant="outline" className="flex-1" onClick={() => setOpenUser(null)}>Close</Button>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <p className="text-[10px] uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
