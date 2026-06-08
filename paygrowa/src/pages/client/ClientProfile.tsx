import { useRef, useState } from "react";
import { PageHeader } from "@/components/admin/AdminUi";
import { useApp, OrgVerification, OrgVerificationStatus } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle2, Clock, AlertCircle, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";

const ORG_TYPES = ["NGO / Non-Profit", "Government Agency", "Research Institute", "Private Business", "Academic Institution", "Other"];
const COUNTRIES = ["Nigeria", "Uganda", "Zambia"];
const DOC_LABELS = ["Certificate of Registration", "NGO Registration Document", "Business Registration", "Government Authorization Letter"];

const statusStyle: Record<OrgVerificationStatus, string> = {
  "Not Submitted": "bg-muted text-muted-foreground",
  "Pending Verification": "bg-warning/10 text-warning",
  "Verified Organization": "bg-success/10 text-success",
  "Rejected": "bg-destructive/10 text-destructive",
};

export default function ClientProfile() {
  const { user, orgVerification, setOrgVerification } = useApp();
  const [form, setForm] = useState<OrgVerification>(orgVerification || {
    organizationName: user?.lastName || "",
    organizationType: "",
    contactPerson: user?.firstName || "",
    email: user?.email || "",
    phone: "",
    country: "Nigeria",
    status: "Not Submitted",
    documents: [],
  });
  const [verifyOpen, setVerifyOpen] = useState(false);
  const docRefs = DOC_LABELS.map(() => useRef<HTMLInputElement>(null));
  const [uploads, setUploads] = useState<Record<string, string>>(
    Object.fromEntries((orgVerification?.documents || []).map((d) => [d.label, d.dataUrl]))
  );

  const set = (k: keyof OrgVerification) => (v: any) => setForm((f) => ({ ...f, [k]: v }));

  const saveDetails = () => {
    setOrgVerification({ ...form, documents: form.documents });
    toast.success("Organization details saved");
  };

  const onUpload = (label: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setUploads((u) => ({ ...u, [label]: r.result as string }));
    r.readAsDataURL(file);
    e.target.value = "";
  };

  const submitVerification = () => {
    const documents = DOC_LABELS.filter((l) => uploads[l]).map((label) => ({ label, dataUrl: uploads[label] }));
    if (documents.length === 0) { toast.error("Upload at least one document"); return; }
    const updated: OrgVerification = { ...form, documents, status: "Pending Verification" };
    setOrgVerification(updated);
    setForm(updated); setVerifyOpen(false);
    toast.success("Verification submitted for review");
  };

  return (
    <div>
      <PageHeader title="Organization Profile" subtitle="Manage your account and verification" />

      <div className="max-w-2xl space-y-4">
        {/* Verification status banner */}
        {form.status !== "Verified Organization" && (
          <div className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/5 p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-warning" />
            <div className="flex-1 text-sm">
              <p className="font-semibold text-foreground">Only verified organizations can publish live projects.</p>
              <p className="text-xs text-muted-foreground">Submit your verification documents to unlock live project publishing.</p>
            </div>
          </div>
        )}

        {/* Details */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Organization Details</h2>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyle[form.status]}`}>{form.status}</span>
          </div>
          <Field label="Organization Name" value={form.organizationName} onChange={set("organizationName")} />
          <SelectField label="Organization Type" value={form.organizationType} onChange={set("organizationType")} options={["", ...ORG_TYPES]} />
          <Field label="Contact Person" value={form.contactPerson} onChange={set("contactPerson")} />
          <Field label="Email" value={form.email} onChange={set("email")} type="email" />
          <Field label="Phone" value={form.phone} onChange={set("phone")} type="tel" />
          <SelectField label="Country" value={form.country} onChange={set("country")} options={COUNTRIES} />
          <Button onClick={saveDetails}>Save Changes</Button>
        </div>

        {/* Verification */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <h2 className="text-sm font-bold text-foreground">Verification</h2>
          {form.status === "Not Submitted" && (
            <>
              <p className="text-xs text-muted-foreground">Upload official documents to verify your organization.</p>
              <Button onClick={() => setVerifyOpen(true)}>Verify Organization</Button>
            </>
          )}
          {form.status === "Pending Verification" && (
            <div className="flex items-start gap-2 rounded-lg bg-warning/10 p-3 text-xs text-warning"><Clock className="mt-0.5 h-4 w-4" /> Your documents are being reviewed. Expected: 24–48 hours.</div>
          )}
          {form.status === "Verified Organization" && (
            <div className="flex items-start gap-2 rounded-lg bg-success/10 p-3 text-xs text-success"><CheckCircle2 className="mt-0.5 h-4 w-4" /> Organization verified. You can publish live projects.</div>
          )}
          {form.status === "Rejected" && (
            <>
              <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive"><AlertCircle className="mt-0.5 h-4 w-4" /> Verification rejected. Please re-submit clearer documents.</div>
              <Button onClick={() => setVerifyOpen(true)}>Re-submit</Button>
            </>
          )}
        </div>
      </div>

      {verifyOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm md:items-center" onClick={() => setVerifyOpen(false)}>
          <div className="w-full max-w-lg rounded-t-2xl bg-card p-5 md:rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground">Upload Verification Documents</h3>
              <button onClick={() => setVerifyOpen(false)}><X className="h-4 w-4" /></button>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">Upload any documents that apply to your organization.</p>
            <div className="space-y-3">
              {DOC_LABELS.map((label, i) => (
                <div key={label} className="rounded-xl border border-border bg-background p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    {uploads[label] ? <span className="text-xs text-success">Uploaded ✓</span> : null}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => docRefs[i].current?.click()}>
                      <Upload className="h-3 w-3" /> {uploads[label] ? "Replace" : "Upload"}
                    </Button>
                    {uploads[label] && (
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setUploads((u) => { const n = { ...u }; delete n[label]; return n; })}>Remove</Button>
                    )}
                  </div>
                  <input ref={docRefs[i]} type="file" accept="image/*,application/pdf" className="hidden" onChange={onUpload(label)} />
                </div>
              ))}
            </div>
            <Button className="mt-4 w-full" onClick={submitVerification}>Submit Verification</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-foreground">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" />
    </div>
  );
}
function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-foreground">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
        {options.map((o) => <option key={o} value={o}>{o || "Select…"}</option>)}
      </select>
    </div>
  );
}
