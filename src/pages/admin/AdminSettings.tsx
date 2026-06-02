import { useState } from "react";
import { PageHeader } from "@/components/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Shield } from "lucide-react";
import { toast } from "sonner";

type AdminRole = "Super Admin" | "Operations Admin" | "Reviewer";
interface AdminAccount { id: string; email: string; role: AdminRole; }

const PERMISSIONS: Record<AdminRole, string[]> = {
  "Super Admin": ["Full access", "Manage admins", "Edit settings", "Approve payments", "Manage tasks"],
  "Operations Admin": ["Manage tasks", "Approve payments", "View analytics"],
  "Reviewer": ["Review submissions", "Flag for review"],
};

export default function AdminSettings() {
  const [section, setSection] = useState<"platform" | "tasks" | "quality" | "payment" | "savings" | "admins" | "notifications">("platform");

  const tabs = [
    { id: "platform", label: "Platform" },
    { id: "tasks", label: "Task Rules" },
    { id: "quality", label: "Quality Control" },
    { id: "payment", label: "Payment" },
    { id: "savings", label: "Savings" },
    { id: "admins", label: "Admin Accounts" },
    { id: "notifications", label: "Notifications" },
  ] as const;

  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure platform rules, accounts and notifications" />

      <div className="flex gap-1 rounded-lg border border-border bg-card p-1 mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setSection(t.id)} className={`rounded-md px-4 py-2 text-xs font-medium whitespace-nowrap ${section === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {section === "platform" && <PlatformSettings />}
      {section === "tasks" && <TaskRules />}
      {section === "quality" && <QualityControl />}
      {section === "payment" && <PaymentConfig />}
      {section === "savings" && <SavingsConfig />}
      {section === "admins" && <AdminAccounts />}
      {section === "notifications" && <NotificationSettings />}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
      {children}
    </div>
  );
}

const inp = "h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

function Setting({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3 border-b border-border pb-3 last:border-b-0 last:pb-0">
      <label className="text-xs font-medium text-foreground sm:col-span-1">{label}</label>
      <div className="sm:col-span-2">{children}</div>
    </div>
  );
}

function PlatformSettings() {
  return (
    <Card title="Platform Settings">
      <Setting label="Platform Name"><input className={inp} defaultValue="PayGrowa" /></Setting>
      <Setting label="Support Email"><input className={inp} defaultValue="support@paygrowa.com" /></Setting>
      <Setting label="Default Currency"><input className={inp} defaultValue="NGN (₦)" disabled /></Setting>
      <Setting label="Maintenance Mode"><Toggle defaultOn={false} /></Setting>
      <div className="flex justify-end pt-2"><Button onClick={() => toast.success("Platform settings saved")}>Save Changes</Button></div>
    </Card>
  );
}

function TaskRules() {
  return (
    <Card title="Task Rules">
      <Setting label="Min reward per task (₦)"><input type="number" className={inp} defaultValue={100} /></Setting>
      <Setting label="Max reward per task (₦)"><input type="number" className={inp} defaultValue={10000} /></Setting>
      <Setting label="Default slot limit"><input type="number" className={inp} defaultValue={500} /></Setting>
      <Setting label="Allow concurrent tasks per user"><input type="number" className={inp} defaultValue={3} /></Setting>
      <div className="flex justify-end pt-2"><Button onClick={() => toast.success("Task rules saved")}>Save Changes</Button></div>
    </Card>
  );
}

function QualityControl() {
  return (
    <Card title="Quality Control Thresholds">
      <Setting label="Auto-approval pass threshold (%)"><input type="number" className={inp} defaultValue={80} /></Setting>
      <Setting label="Minimum completion time (sec)"><input type="number" className={inp} defaultValue={30} /></Setting>
      <Setting label="Attention check required by default"><Toggle defaultOn={true} /></Setting>
      <Setting label="Flag user after N failed checks"><input type="number" className={inp} defaultValue={3} /></Setting>
      <div className="flex justify-end pt-2"><Button onClick={() => toast.success("Quality thresholds saved")}>Save Changes</Button></div>
    </Card>
  );
}

function PaymentConfig() {
  return (
    <Card title="Payment Configuration">
      <Setting label="Verification delay (minutes)"><input type="number" className={inp} defaultValue={1} /></Setting>
      <Setting label="Minimum withdrawal (₦)"><input type="number" className={inp} defaultValue={500} /></Setting>
      <Setting label="Auto-approve payments"><Toggle defaultOn={false} /></Setting>
      <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-xs text-muted-foreground">
        After completion: status is <strong>Verifying</strong>. After 1 minute, status changes to <strong>Paid</strong> and the wallet updates. Balance does not update during verification.
      </div>
      <div className="flex justify-end pt-2"><Button onClick={() => toast.success("Payment config saved")}>Save Changes</Button></div>
    </Card>
  );
}

function SavingsConfig() {
  return (
    <Card title="Savings Configuration">
      <Setting label="Default auto-save percentage"><input type="number" className={inp} defaultValue={5} /></Setting>
      <Setting label="Allow user to disable auto-save"><Toggle defaultOn={true} /></Setting>
      <Setting label="Default goal target (₦)"><input type="number" className={inp} defaultValue={10000} /></Setting>
      <div className="flex justify-end pt-2"><Button onClick={() => toast.success("Savings config saved")}>Save Changes</Button></div>
    </Card>
  );
}

function AdminAccounts() {
  const [accounts, setAccounts] = useState<AdminAccount[]>([
    { id: "a1", email: "admin@gmail.com", role: "Super Admin" },
  ]);
  const [adding, setAdding] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<AdminRole>("Reviewer");

  const handleAdd = () => {
    if (!newEmail.includes("@")) return;
    setAccounts((a) => [...a, { id: "a" + Date.now(), email: newEmail, role: newRole }]);
    setNewEmail(""); setNewRole("Reviewer"); setAdding(false);
    toast.success("Admin added");
  };

  return (
    <div className="space-y-6">
      <Card title="Admin Accounts">
        <div className="space-y-2">
          {accounts.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2"><Shield className="h-4 w-4 text-primary" /></div>
                <div>
                  <p className="text-sm font-medium text-foreground">{a.email}</p>
                  <p className="text-xs text-muted-foreground">{a.role}</p>
                </div>
              </div>
              {a.email !== "admin@gmail.com" && (
                <button onClick={() => { setAccounts((acc) => acc.filter((x) => x.id !== a.id)); toast.success("Admin removed"); }} className="rounded-md p-1.5 text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        {!adding ? (
          <Button variant="outline" className="gap-2" onClick={() => setAdding(true)}><Plus className="h-4 w-4" />Add Admin</Button>
        ) : (
          <div className="space-y-2 rounded-lg border border-border p-3">
            <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="admin@email.com" className={inp} />
            <select value={newRole} onChange={(e) => setNewRole(e.target.value as AdminRole)} className={inp}>
              <option>Super Admin</option>
              <option>Operations Admin</option>
              <option>Reviewer</option>
            </select>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd}>Add</Button>
              <Button size="sm" variant="outline" onClick={() => setAdding(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </Card>

      <Card title="Role Permissions">
        <div className="space-y-3">
          {(Object.keys(PERMISSIONS) as AdminRole[]).map((role) => (
            <div key={role} className="rounded-lg border border-border p-3">
              <p className="text-sm font-semibold text-foreground">{role}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {PERMISSIONS[role].map((p) => (
                  <span key={p} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function NotificationSettings() {
  return (
    <Card title="Notification Settings">
      <Setting label="Notify users on submission approval"><Toggle defaultOn={true} /></Setting>
      <Setting label="Notify users on submission rejection"><Toggle defaultOn={true} /></Setting>
      <Setting label="Notify users on payment paid"><Toggle defaultOn={true} /></Setting>
      <Setting label="Admin email digest"><Toggle defaultOn={false} /></Setting>
      <div className="flex justify-end pt-2"><Button onClick={() => toast.success("Notification settings saved")}>Save Changes</Button></div>
    </Card>
  );
}

function Toggle({ defaultOn }: { defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button onClick={() => setOn(!on)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${on ? "bg-primary" : "bg-muted"}`}>
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${on ? "translate-x-5" : "translate-x-1"}`} />
    </button>
  );
}
