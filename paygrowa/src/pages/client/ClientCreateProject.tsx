import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/AdminUi";
import { useClient, ProjectQuestion, ProjectType } from "@/context/ClientContext";
import { toast } from "sonner";

const PLATFORM_FEE = 0.15;

export default function ClientCreateProject() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const editId = params.get("edit");
  const { createProject, updateProject, projects, setProjectStatus } = useClient();
  const existing = editId ? projects.find((p) => p.id === editId) : null;

  const [form, setForm] = useState({
    title: "", objective: "", description: "",
    type: "Survey" as ProjectType,
    country: "Nigeria", state: "Lagos", language: "English",
    ageRange: "18-24", gender: "Any",
    responsesRequired: 100, estimatedMinutes: 5,
    rewardPerResponse: 500, deadline: "",
  });
  const [questions, setQuestions] = useState<ProjectQuestion[]>([]);
  const [reporting, setReporting] = useState({ objective: "", requiredPhotos: 1, gpsRequired: true, observations: "", notes: "" });

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title, objective: existing.objective, description: existing.description,
        type: existing.type, country: existing.country, state: existing.state, language: existing.language,
        ageRange: existing.ageRange, gender: existing.gender,
        responsesRequired: existing.responsesRequired, estimatedMinutes: existing.estimatedMinutes,
        rewardPerResponse: existing.rewardPerResponse, deadline: existing.deadline,
      });
      setQuestions(existing.questions || []);
      if (existing.reporting) setReporting(existing.reporting);
    }
  }, [existing]);

  const budget = useMemo(() => {
    const base = form.responsesRequired * form.rewardPerResponse;
    const fee = base * PLATFORM_FEE;
    return { base, fee, total: base + fee };
  }, [form.responsesRequired, form.rewardPerResponse]);

  const set = (k: string) => (e: any) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setNum = (k: string) => (e: any) => setForm((f) => ({ ...f, [k]: Number(e.target.value) || 0 }));

  const addQuestion = () => setQuestions((qs) => [...qs, { id: "q" + Date.now(), text: "", type: "single", options: ["", ""] }]);
  const updateQ = (id: string, u: Partial<ProjectQuestion>) => setQuestions((qs) => qs.map((q) => q.id === id ? { ...q, ...u } : q));
  const removeQ = (id: string) => setQuestions((qs) => qs.filter((q) => q.id !== id));

  const save = (status: "Draft" | "Under Review") => {
    if (!form.title || !form.objective) {
      toast.error("Title and objective are required");
      return;
    }
    const payload = { ...form, questions, reporting: form.type === "Community Reporting" ? reporting : undefined };
    if (editId && existing) {
      updateProject(editId, payload as any);
      if (status === "Under Review") setProjectStatus(editId, "Under Review");
      toast.success(status === "Draft" ? "Saved as draft" : "Submitted for review");
    } else {
      createProject({ ...payload, status } as any);
      toast.success(status === "Draft" ? "Project saved" : "Submitted for review");
    }
    navigate("/organization/projects");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={editId ? "Edit Project" : "Create Project"} subtitle="Define your data collection campaign" />

      <div className="space-y-4">
        <Section title="Basics">
          <Field label="Project Title" value={form.title} onChange={set("title")} />
          <Field label="Project Objective" value={form.objective} onChange={set("objective")} />
          <TextArea label="Project Description" value={form.description} onChange={set("description")} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Select label="Project Type" value={form.type} onChange={set("type")} options={["Survey", "Community Reporting"]} />
            <Field label="Language" value={form.language} onChange={set("language")} />
          </div>
        </Section>

        <Section title="Targeting">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Target Country" value={form.country} onChange={set("country")} />
            <Field label="Target State" value={form.state} onChange={set("state")} />
            <Select label="Age Range" value={form.ageRange} onChange={set("ageRange")} options={["18-24","25-34","35-44","45+","Any"]} />
            <Select label="Gender" value={form.gender} onChange={set("gender")} options={["Any","Male","Female"]} />
          </div>
        </Section>

        <Section title="Volume & Budget">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Responses Required" type="number" value={form.responsesRequired} onChange={setNum("responsesRequired")} />
            <Field label="Estimated Time (mins)" type="number" value={form.estimatedMinutes} onChange={setNum("estimatedMinutes")} />
            <Field label="Reward Per Response (₦)" type="number" value={form.rewardPerResponse} onChange={setNum("rewardPerResponse")} />
            <Field label="Project Deadline" type="date" value={form.deadline} onChange={set("deadline")} />
          </div>
          <div className="mt-3 rounded-xl bg-muted/40 p-4 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Responses × Reward</span><span>₦{budget.base.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Platform fee (15%)</span><span>₦{budget.fee.toLocaleString()}</span></div>
            <div className="mt-2 flex justify-between border-t border-border pt-2 font-bold text-foreground"><span>Total</span><span>₦{budget.total.toLocaleString()}</span></div>
          </div>
        </Section>

        {form.type === "Survey" ? (
          <Section title="Survey Questions">
            {questions.length === 0 && <p className="text-xs text-muted-foreground">No questions yet.</p>}
            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div key={q.id} className="rounded-xl border border-border p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Question {idx + 1}</span>
                    <button onClick={() => removeQ(q.id)} className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                  <input value={q.text} onChange={(e) => updateQ(q.id, { text: e.target.value })} placeholder="Question text"
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" />
                  <Select label="" value={q.type} onChange={(e: any) => updateQ(q.id, { type: e.target.value })} options={["single","multiple","text"]} />
                  {q.type !== "text" && (
                    <textarea value={(q.options || []).join("\n")} onChange={(e) => updateQ(q.id, { options: e.target.value.split("\n") })}
                      placeholder="One option per line" rows={3}
                      className="w-full rounded-lg border border-input bg-background p-2 text-sm" />
                  )}
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-3" onClick={addQuestion}><Plus className="h-3 w-3" /> Add Question</Button>
          </Section>
        ) : (
          <Section title="Community Reporting Setup">
            <TextArea label="Reporting Objective" value={reporting.objective} onChange={(e: any) => setReporting({ ...reporting, objective: e.target.value })} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Required Photo Uploads" type="number" value={reporting.requiredPhotos} onChange={(e: any) => setReporting({ ...reporting, requiredPhotos: Number(e.target.value) })} />
              <label className="flex items-center gap-2 text-sm pt-6">
                <input type="checkbox" checked={reporting.gpsRequired} onChange={(e) => setReporting({ ...reporting, gpsRequired: e.target.checked })} />
                GPS Required
              </label>
            </div>
            <TextArea label="Required Observations" value={reporting.observations} onChange={(e: any) => setReporting({ ...reporting, observations: e.target.value })} />
            <TextArea label="Additional Notes" value={reporting.notes} onChange={(e: any) => setReporting({ ...reporting, notes: e.target.value })} />
          </Section>
        )}

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => save("Draft")}>Save as Draft</Button>
          <Button className="flex-1" onClick={() => save("Under Review")}>Submit For Review</Button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
      {children}
    </div>
  );
}
function Field({ label, ...props }: any) {
  return (
    <div>
      {label && <label className="mb-1 block text-xs font-medium text-foreground">{label}</label>}
      <input {...props} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none" />
    </div>
  );
}
function TextArea({ label, ...props }: any) {
  return (
    <div>
      {label && <label className="mb-1 block text-xs font-medium text-foreground">{label}</label>}
      <textarea rows={3} {...props} className="w-full rounded-lg border border-input bg-background p-2 text-sm focus:border-primary focus:outline-none" />
    </div>
  );
}
function Select({ label, options, ...props }: any) {
  return (
    <div>
      {label && <label className="mb-1 block text-xs font-medium text-foreground">{label}</label>}
      <select {...props} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none">
        {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
