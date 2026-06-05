import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KpiCard, PageHeader, EmptyState, StatusBadge } from "@/components/admin/AdminUi";
import { useClient } from "@/context/ClientContext";

export default function ClientDashboard() {
  const navigate = useNavigate();
  const { projects } = useClient();
  const count = (s: string) => projects.filter((p) => p.status === s).length;
  const totalSpend = projects.reduce((s, p) => s + p.budgetUsed, 0);
  const responses = projects.reduce((s, p) => s + p.responsesCollected, 0);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your projects and data collection" actions={
        <Button onClick={() => navigate("/client/create")}><Plus className="h-4 w-4" /> Create Project</Button>
      } />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Active Projects" value={count("Live")} accent="secondary" />
        <KpiCard label="Drafts" value={count("Draft")} />
        <KpiCard label="Under Review" value={count("Under Review")} accent="warning" />
        <KpiCard label="Completed" value={count("Completed")} accent="tertiary" />
        <KpiCard label="Total Spend" value={`₦${totalSpend.toLocaleString()}`} accent="tertiary" />
        <KpiCard label="Responses Collected" value={responses.toLocaleString()} accent="secondary" />
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-bold text-foreground">Recent Projects</h2>
        {projects.length === 0 ? (
          <EmptyState title="No projects yet" description="Create your first project to start collecting verified responses." />
        ) : (
          <div className="space-y-2">
            {projects.slice(0, 5).map((p) => (
              <button key={p.id} onClick={() => navigate(`/client/projects`)}
                className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 text-left hover:bg-muted/40">
                <div>
                  <p className="text-sm font-semibold text-foreground">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.type} · {p.responsesRequired} responses · ₦{p.rewardPerResponse}/response</p>
                </div>
                <StatusBadge status={p.status} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
