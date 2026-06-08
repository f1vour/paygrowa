import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Edit, Pause, Play, X, Trash2, Eye, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, StatusBadge, EmptyState } from "@/components/admin/AdminUi";
import { useAdmin, AdminTask, TaskStatus, TaskType, AdminQuestion } from "@/context/AdminContext";
import { toast } from "sonner";

export default function AdminTasks() {
  const { tasks, updateTask, deleteTask, createTask } = useAdmin();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | TaskStatus>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    if (params.get("new")) {
      setShowCreate(true);
      params.delete("new");
      setParams(params, { replace: true });
    }
  }, [params, setParams]);

  const filtered = tasks.filter((t) =>
    (filter === "all" || t.status === filter) &&
    t.title.toLowerCase().includes(search.toLowerCase()),
  );

  const taskTypeLabel = (t: TaskType) =>
    ({ survey: "Survey", voice: "Voice Recording", data_tagging: "Data Tagging", community_report: "Community Report" }[t]);

  return (
    <div>
      <PageHeader
        title="Task Management"
        subtitle="Create, monitor and manage all platform tasks"
        actions={<Button onClick={() => setShowCreate(true)} className="gap-2"><Plus className="h-4 w-4" />Create Task</Button>}
      />

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks…" className="h-9 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          <Filter className="ml-1 h-3 w-3 text-muted-foreground" />
          {(["all", "draft", "live", "paused", "closed"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-md px-3 py-1 text-xs font-medium capitalize ${filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No tasks found" description="Try changing filters or create a new task." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Task</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Reward</th>
                <th className="px-4 py-3 text-left font-semibold">Slots</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Created</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((task) => (
                <tr key={task.id} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{task.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{taskTypeLabel(task.type)}</td>
                  <td className="px-4 py-3 font-semibold text-success">₦{task.reward.toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground">{task.slotsFilled} / {task.slots}</td>
                  <td className="px-4 py-3"><StatusBadge status={task.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{task.createdDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <IconBtn icon={Eye} label="Preview" onClick={() => toast.info(`Previewing: ${task.title}`)} />
                      <IconBtn icon={Edit} label="Edit" onClick={() => toast.info("Edit coming soon")} />
                      {task.status === "live" && <IconBtn icon={Pause} label="Pause" onClick={() => { updateTask(task.id, { status: "paused" }); toast.success("Task paused"); }} />}
                      {task.status === "paused" && <IconBtn icon={Play} label="Resume" onClick={() => { updateTask(task.id, { status: "live" }); toast.success("Task resumed"); }} />}
                      {task.status !== "closed" && <IconBtn icon={X} label="Close" onClick={() => { updateTask(task.id, { status: "closed" }); toast.success("Task closed"); }} />}
                      <IconBtn icon={Trash2} label="Delete" onClick={() => setConfirmDelete(task.id)} danger />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreate && <CreateTaskDrawer onClose={() => setShowCreate(false)} onCreate={(data, publish) => { createTask({ ...data, status: publish ? "live" : "draft" }); setShowCreate(false); toast.success(publish ? "Task published" : "Task saved as draft"); }} />}

      {confirmDelete && (
        <ConfirmModal
          title="Delete task?"
          description="This will permanently remove the task and its data."
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => { deleteTask(confirmDelete); setConfirmDelete(null); toast.success("Task deleted"); }}
        />
      )}
    </div>
  );
}

function IconBtn({ icon: Icon, label, onClick, danger }: { icon: any; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} title={label} className={`rounded-md p-1.5 hover:bg-muted ${danger ? "text-destructive" : "text-muted-foreground hover:text-foreground"}`}>
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

function ConfirmModal({ title, description, onCancel, onConfirm }: { title: string; description: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm" onClick={onCancel}>
      <div className="w-full max-w-sm rounded-2xl bg-card p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
          <Button variant="destructive" className="flex-1" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

function CreateTaskDrawer({ onClose, onCreate }: { onClose: () => void; onCreate: (data: Omit<AdminTask, "id" | "createdDate" | "slotsFilled" | "status">, publish: boolean) => void }) {
  const [form, setForm] = useState({
    title: "", description: "", reward: 0, estimatedMinutes: 5, slots: 100, type: "survey" as TaskType,
    ageRange: "", gender: "", state: "", location: "",
    attentionCheck: "", minTimeSec: 30, requireMedia: false, passThreshold: 80,
  });
  const [questions, setQuestions] = useState<AdminQuestion[]>([{ id: "q1", text: "", type: "single", options: ["", ""] }]);
  const [previewing, setPreviewing] = useState(false);

  const valid = form.title.trim() && form.reward > 0 && form.slots > 0 && questions.length > 0 && questions.every((q) => q.text.trim());

  const update = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const addQuestion = () => setQuestions((qs) => [...qs, { id: "q" + Date.now(), text: "", type: "single", options: ["", ""] }]);
  const updateQ = (id: string, patch: Partial<AdminQuestion>) => setQuestions((qs) => qs.map((q) => q.id === id ? { ...q, ...patch } : q));
  const deleteQ = (id: string) => setQuestions((qs) => qs.filter((q) => q.id !== id));
  const moveQ = (id: string, dir: -1 | 1) => setQuestions((qs) => {
    const i = qs.findIndex((q) => q.id === id);
    if (i < 0 || i + dir < 0 || i + dir >= qs.length) return qs;
    const copy = [...qs];
    [copy[i], copy[i + dir]] = [copy[i + dir], copy[i]];
    return copy;
  });

  const buildPayload = () => ({
    title: form.title.trim(),
    description: form.description.trim(),
    reward: Number(form.reward),
    estimatedMinutes: Number(form.estimatedMinutes),
    slots: Number(form.slots),
    type: form.type,
    questions,
    eligibility: { ageRange: form.ageRange, gender: form.gender, state: form.state, location: form.location },
    quality: { attentionCheck: form.attentionCheck, minTimeSec: Number(form.minTimeSec), requireMedia: form.requireMedia, passThreshold: Number(form.passThreshold) },
  });

  if (previewing) {
    return (
      <Drawer title="Task Preview" onClose={() => setPreviewing(false)}>
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">Reward</p>
            <p className="text-xl font-bold text-success">₦{Number(form.reward).toLocaleString()}</p>
            <p className="mt-2 text-sm font-semibold text-foreground">{form.title || "Untitled task"}</p>
            <p className="text-xs text-muted-foreground">{form.description || "No description"}</p>
          </div>
          {questions.map((q, i) => (
            <div key={q.id} className="rounded-xl border border-border bg-card p-4">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">Question {i + 1}</p>
              <p className="text-sm font-medium text-foreground">{q.text || "(empty question)"}</p>
              {(q.type === "single" || q.type === "multiple") && q.options && (
                <div className="mt-2 space-y-2">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2 rounded-lg border border-border p-2">
                      <div className={`h-4 w-4 ${q.type === "single" ? "rounded-full" : "rounded"} border border-muted-foreground`} />
                      <span className="text-xs text-foreground">{opt || `Option ${oi + 1}`}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Button variant="outline" className="w-full" onClick={() => setPreviewing(false)}>Back to editor</Button>
        </div>
      </Drawer>
    );
  }

  return (
    <Drawer title="Create New Task" onClose={onClose}>
      <div className="space-y-6">
        <Section title="Task Information">
          <Field label="Task Title"><input value={form.title} onChange={(e) => update("title", e.target.value)} className={inputCls} placeholder="e.g. Lagos Market Pricing Report" /></Field>
          <Field label="Description"><textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} className={inputCls + " resize-none py-2"} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Reward (₦)"><input type="number" value={form.reward || ""} onChange={(e) => update("reward", e.target.value)} className={inputCls} /></Field>
            <Field label="Completion Time (min)"><input type="number" value={form.estimatedMinutes} onChange={(e) => update("estimatedMinutes", e.target.value)} className={inputCls} /></Field>
            <Field label="Slot Limit"><input type="number" value={form.slots} onChange={(e) => update("slots", e.target.value)} className={inputCls} /></Field>
            <Field label="Task Type">
              <select value={form.type} onChange={(e) => update("type", e.target.value)} className={inputCls}>
                <option value="survey">Survey</option>
                <option value="voice">Voice Recording</option>
                <option value="data_tagging">Data Tagging</option>
                <option value="community_report">Local Community Reporting</option>
              </select>
            </Field>
          </div>
        </Section>

        <Section title="Eligibility Rules (Optional)">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Age Range"><input value={form.ageRange} onChange={(e) => update("ageRange", e.target.value)} placeholder="e.g. 18-35" className={inputCls} /></Field>
            <Field label="Gender">
              <select value={form.gender} onChange={(e) => update("gender", e.target.value)} className={inputCls}>
                <option value="">Any</option><option>Male</option><option>Female</option><option>Other</option>
              </select>
            </Field>
            <Field label="State"><input value={form.state} onChange={(e) => update("state", e.target.value)} placeholder="e.g. Lagos" className={inputCls} /></Field>
            <Field label="Location"><input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="e.g. Yaba" className={inputCls} /></Field>
          </div>
        </Section>

        <Section title="Question Builder" action={<Button size="sm" variant="outline" onClick={addQuestion} className="gap-1"><Plus className="h-3 w-3" />Add Question</Button>}>
          <div className="space-y-3">
            {questions.map((q, i) => (
              <div key={q.id} className="rounded-xl border border-border bg-muted/30 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Question {i + 1}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => moveQ(q.id, -1)} className="text-xs text-muted-foreground hover:text-foreground">↑</button>
                    <button onClick={() => moveQ(q.id, 1)} className="text-xs text-muted-foreground hover:text-foreground">↓</button>
                    <button onClick={() => deleteQ(q.id)} className="text-destructive"><Trash2 className="h-3 w-3" /></button>
                  </div>
                </div>
                <input value={q.text} onChange={(e) => updateQ(q.id, { text: e.target.value })} placeholder="Question text" className={inputCls} />
                <select value={q.type} onChange={(e) => updateQ(q.id, { type: e.target.value as any, options: ["single", "multiple"].includes(e.target.value) ? (q.options || ["", ""]) : undefined })} className={inputCls}>
                  <option value="single">Single Choice</option>
                  <option value="multiple">Multiple Choice</option>
                  <option value="text">Text Input</option>
                  <option value="image">Image Upload</option>
                  <option value="voice">Voice Recording</option>
                </select>
                {(q.type === "single" || q.type === "multiple") && (
                  <div className="space-y-1">
                    {(q.options || []).map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-1">
                        <input value={opt} onChange={(e) => updateQ(q.id, { options: q.options?.map((o, j) => j === oi ? e.target.value : o) })} placeholder={`Option ${oi + 1}`} className={inputCls} />
                        {q.options && q.options.length > 2 && (
                          <button onClick={() => updateQ(q.id, { options: q.options?.filter((_, j) => j !== oi) })} className="text-destructive"><X className="h-3 w-3" /></button>
                        )}
                      </div>
                    ))}
                    <button onClick={() => updateQ(q.id, { options: [...(q.options || []), ""] })} className="text-xs text-primary">+ Add option</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>

        <Section title="Quality Control Rules">
          <Field label='Attention check answer (e.g. "Select Option C")'><input value={form.attentionCheck} onChange={(e) => update("attentionCheck", e.target.value)} className={inputCls} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Minimum completion time (sec)"><input type="number" value={form.minTimeSec} onChange={(e) => update("minTimeSec", e.target.value)} className={inputCls} /></Field>
            <Field label="Pass threshold (%)"><input type="number" value={form.passThreshold} onChange={(e) => update("passThreshold", e.target.value)} className={inputCls} /></Field>
          </div>
          <label className="flex items-center gap-2 text-xs text-foreground">
            <input type="checkbox" checked={form.requireMedia} onChange={(e) => update("requireMedia", e.target.checked)} className="h-4 w-4 accent-primary" />
            Require media upload
          </label>
        </Section>

        <div className="sticky bottom-0 -mx-6 flex gap-2 border-t border-border bg-card px-6 py-3">
          <Button variant="outline" className="flex-1" onClick={() => setPreviewing(true)}>Preview</Button>
          <Button variant="outline" className="flex-1" onClick={() => onCreate(buildPayload(), false)} disabled={!valid}>Save Draft</Button>
          <Button className="flex-1" onClick={() => onCreate(buildPayload(), true)} disabled={!valid}>Publish</Button>
        </div>
      </div>
    </Drawer>
  );
}

const inputCls = "h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-1 block text-xs font-medium text-foreground">{label}</label>{children}</div>;
}

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

export function Drawer({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <div className="h-full w-full max-w-2xl overflow-y-auto bg-card shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-muted"><X className="h-4 w-4 text-muted-foreground" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
