import { PageHeader } from "@/components/admin/AdminUi";
import { useApp } from "@/context/AppContext";
export default function ClientProfile() {
  const { user } = useApp();
  return (
    <div>
      <PageHeader title="Organization Profile" subtitle="Manage your account information" />
      <div className="rounded-2xl border border-border bg-card p-6 space-y-3 max-w-xl">
        <div><p className="text-xs text-muted-foreground">Organization</p><p className="text-sm font-semibold text-foreground">{user?.lastName || "—"}</p></div>
        <div><p className="text-xs text-muted-foreground">Contact</p><p className="text-sm font-semibold text-foreground">{user?.firstName || "—"}</p></div>
        <div><p className="text-xs text-muted-foreground">Email</p><p className="text-sm font-semibold text-foreground">{user?.email}</p></div>
      </div>
    </div>
  );
}
