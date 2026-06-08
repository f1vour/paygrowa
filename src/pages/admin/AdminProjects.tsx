import { PageHeader, StatusBadge, EmptyState } from "@/components/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { useClient } from "@/context/ClientContext";
import { toast } from "sonner";

export default function AdminProjects() {
  const { projects, setProjectStatus } = useClient();
  const pending = projects.filter((p) => p.status === "Under Review");
  const others = projects.filter((p) => p.status !== "Under Review");

  return (
    <div>
      <PageHeader title="Client Projects" subtitle="Review, approve and manage organization projects" />
      <h3 className="mb-3 text-sm font-bold text-foreground">Pending Review ({pending.length})</h3>
      {pending.length === 0 ? <EmptyState title="No projects awaiting review" /> : (
        <div className="space-y-3">
          {pending.map((p) => (
            <div key={p.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-foreground">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.type} · {p.responsesRequired} responses · ₦{p.rewardPerResponse}/response · {p.state}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{p.description}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={() => { setProjectStatus(p.id, "Live"); toast.success("Approved & live"); }}>Approve & Publish</Button>
                <Button size="sm" variant="outline" onClick={() => { setProjectStatus(p.id, "Draft"); toast("Sent back for changes"); }}>Request Changes</Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { setProjectStatus(p.id, "Rejected"); toast.error("Project rejected"); }}>Reject</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h3 className="mb-3 mt-8 text-sm font-bold text-foreground">All Projects</h3>
      {others.length === 0 ? <EmptyState title="No projects yet" /> : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs text-muted-foreground"><tr>
              <th className="px-4 py-3">Title</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Status</th>
            </tr></thead>
            <tbody>
              {others.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-foreground">{p.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.type}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
