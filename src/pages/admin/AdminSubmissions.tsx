import { useState } from "react";
import { CheckCircle, XCircle, Flag, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, StatusBadge, EmptyState } from "@/components/admin/AdminUi";
import { Drawer } from "@/pages/admin/AdminTasks";
import { useAdmin, AdminSubmission } from "@/context/AdminContext";
import { toast } from "sonner";

export default function AdminSubmissions() {
  const { submissions, reviewSubmission } = useAdmin();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "passed" | "failed" | "flagged" | "approved" | "rejected">("all");
  const [openSub, setOpenSub] = useState<AdminSubmission | null>(null);
  const [rejectFor, setRejectFor] = useState<AdminSubmission | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const filtered = submissions.filter((s) =>
    (filter === "all" || s.status === filter) &&
    (s.userName.toLowerCase().includes(search.toLowerCase()) || s.taskName.toLowerCase().includes(search.toLowerCase())),
  );

  const handleReject = () => {
    if (rejectFor && rejectReason.trim()) {
      reviewSubmission(rejectFor.id, "reject", rejectReason);
      toast.success("Submission rejected");
      setRejectFor(null);
      setRejectReason("");
      setOpenSub(null);
    }
  };

  return (
    <div>
      <PageHeader title="Submissions" subtitle="Review submissions, quality checks and approvals" />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by user or task…" className="h-9 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm focus:border-primary focus:outline-none" />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          <Filter className="ml-1 h-3 w-3 text-muted-foreground" />
          {(["all", "passed", "failed", "flagged", "approved", "rejected"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-md px-3 py-1 text-xs font-medium capitalize ${filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No submissions found" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">User</th>
                <th className="px-4 py-3 text-left font-semibold">Task</th>
                <th className="px-4 py-3 text-left font-semibold">Submitted</th>
                <th className="px-4 py-3 text-left font-semibold">Completion</th>
                <th className="px-4 py-3 text-left font-semibold">Quality</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 cursor-pointer" onClick={() => setOpenSub(s)}>
                  <td className="px-4 py-3 font-medium text-foreground">{s.userName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.taskName}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{s.submittedAt}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{Math.floor(s.completionTimeSec / 60)}m {s.completionTimeSec % 60}s</td>
                  <td className="px-4 py-3"><StatusBadge status={s.qualityResult} /></td>
                  <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { reviewSubmission(s.id, "approve"); toast.success("Approved"); }} className="rounded-md p-1.5 text-success hover:bg-success/10" title="Approve"><CheckCircle className="h-4 w-4" /></button>
                      <button onClick={() => setRejectFor(s)} className="rounded-md p-1.5 text-destructive hover:bg-destructive/10" title="Reject"><XCircle className="h-4 w-4" /></button>
                      <button onClick={() => { reviewSubmission(s.id, "flag"); toast.info("Flagged for review"); }} className="rounded-md p-1.5 text-warning hover:bg-warning/10" title="Flag"><Flag className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <p className="text-xs font-semibold text-foreground">Auto-approval logic</p>
        <p className="mt-1 text-xs text-muted-foreground">When both Attention Check and Time Check pass, submissions are auto-approved. All other submissions enter the review queue.</p>
      </div>

      {openSub && (
        <Drawer title="Submission Details" onClose={() => setOpenSub(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Info label="User" value={openSub.userName} />
              <Info label="Task" value={openSub.taskName} />
              <Info label="Completion Time" value={`${Math.floor(openSub.completionTimeSec / 60)}m ${openSub.completionTimeSec % 60}s`} />
              <Info label="Submitted" value={openSub.submittedAt} />
              <Info label="Attention Check" value={openSub.attentionCheck === "pass" ? "✓ Pass" : "✗ Fail"} />
              <Info label="Time Check" value={openSub.timeCheck === "pass" ? "✓ Pass" : "✗ Fail"} />
            </div>

            <div>
              <h3 className="mb-2 text-sm font-bold text-foreground">User Answers</h3>
              <div className="space-y-2">
                {openSub.answers.length === 0 && <p className="text-xs text-muted-foreground">No text answers (media submission)</p>}
                {openSub.answers.map((a, i) => (
                  <div key={i} className="rounded-lg border border-border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">{a.question}</p>
                    <p className="mt-1 text-sm font-medium text-foreground">{a.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {openSub.mediaUrl && (
              <div>
                <h3 className="mb-2 text-sm font-bold text-foreground">Uploaded Media</h3>
                <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">{openSub.mediaUrl}</div>
              </div>
            )}

            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => { reviewSubmission(openSub.id, "approve"); toast.success("Approved"); setOpenSub(null); }}>Approve</Button>
              <Button variant="destructive" className="flex-1" onClick={() => setRejectFor(openSub)}>Reject</Button>
              <Button variant="outline" className="flex-1" onClick={() => { reviewSubmission(openSub.id, "flag"); toast.info("Flagged"); setOpenSub(null); }}>Flag</Button>
            </div>
          </div>
        </Drawer>
      )}

      {rejectFor && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/40 backdrop-blur-sm" onClick={() => setRejectFor(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-foreground">Reject submission</h2>
            <p className="text-xs text-muted-foreground">Please provide a reason. The user will be notified.</p>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={4} placeholder="Reason for rejection…" className="w-full rounded-lg border border-input bg-background p-3 text-sm focus:border-primary focus:outline-none resize-none" />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setRejectFor(null)}>Cancel</Button>
              <Button variant="destructive" className="flex-1" disabled={!rejectReason.trim()} onClick={handleReject}>Reject</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <p className="text-[10px] uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
