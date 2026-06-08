import { Button } from "@/components/ui/button";
import { PageHeader, KpiCard, EmptyState } from "@/components/admin/AdminUi";
import { useClient } from "@/context/ClientContext";
import { Download } from "lucide-react";

export default function ClientAnalytics() {
  const { projects } = useClient();
  const responses = projects.reduce((s, p) => s + p.responsesCollected, 0);
  const required = projects.reduce((s, p) => s + p.responsesRequired, 0);
  const budgetUsed = projects.reduce((s, p) => s + p.budgetUsed, 0);
  const budgetTotal = projects.reduce((s, p) => s + (p.responsesRequired * p.rewardPerResponse * 1.15), 0);
  const completion = required > 0 ? Math.round((responses / required) * 100) : 0;

  const exportCsv = () => {
    const rows = [
      ["Project", "Type", "Responses", "Required", "Budget Used", "Status"],
      ...projects.map((p) => [p.title, p.type, p.responsesCollected, p.responsesRequired, p.budgetUsed, p.status]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "paygrowa-analytics.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Performance across all projects" actions={
        <>
          <Button variant="outline" onClick={exportCsv}><Download className="h-4 w-4" /> CSV</Button>
          <Button variant="outline" onClick={exportCsv}><Download className="h-4 w-4" /> Excel</Button>
        </>
      } />
      {projects.length === 0 ? <EmptyState title="No data yet" description="Create a project to see analytics." /> : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KpiCard label="Responses" value={responses.toLocaleString()} accent="secondary" />
          <KpiCard label="Completion Rate" value={`${completion}%`} />
          <KpiCard label="Budget Used" value={`₦${budgetUsed.toLocaleString()}`} accent="tertiary" />
          <KpiCard label="Budget Remaining" value={`₦${Math.max(0, budgetTotal - budgetUsed).toLocaleString()}`} accent="warning" />
          <KpiCard label="Quality Pass Rate" value="—" />
          <KpiCard label="Avg Completion Time" value="—" />
        </div>
      )}
    </div>
  );
}
