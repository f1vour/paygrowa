import { useNavigate } from "react-router-dom";
import { Plus, Eye, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, StatusBadge, EmptyState } from "@/components/admin/AdminUi";
import { useClient } from "@/context/ClientContext";
import { toast } from "sonner";

export default function ClientProjects() {
  const navigate = useNavigate();
  const { projects, setProjectStatus, currentOrg } = useClient();
  const verified = currentOrg.status === "Verified Organization";

  const submit = (id: string) => {
    if (!verified) { toast.error("Verify your organization to publish projects"); return; }
    setProjectStatus(id, "Under Review");
    toast.success("Project submitted for review");
  };

  return (
    <div>
      <PageHeader title="Projects" subtitle="Manage all your data collection projects" actions={
        <Button onClick={() => navigate("/organization/create")}><Plus className="h-4 w-4" /> New</Button>
      } />
      {projects.length === 0 ? (
        <EmptyState title="No projects yet" description="Get started by creating a project." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Responses</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-foreground">{p.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.type}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.responsesCollected} / {p.responsesRequired}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/organization/create?edit=${p.id}`)}><Eye className="h-3 w-3" /> Edit</Button>
                      {p.status === "Draft" && (
                        <Button size="sm" onClick={() => submit(p.id)}><Send className="h-3 w-3" /> Submit</Button>
                      )}
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
