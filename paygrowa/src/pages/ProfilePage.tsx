import { User, Mail, Shield, LogOut, Upload, Camera, ChevronRight, CheckCircle2, AlertCircle, Clock, X, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { useApp, trustLevel, ContributorProfile, IdentityType, IdentityStatus } from "@/context/AppContext";
import { toast } from "sonner";

const NG_STATES = ["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"];
const LANGUAGES = ["Hausa", "Igbo", "Yoruba", "English"];
const EDU = ["Secondary School", "ND", "HND", "Bachelor's Degree", "Master's Degree", "Other"];
const COUNTRIES = ["Nigeria", "Uganda", "Zambia"];
const ID_TYPES: IdentityType[] = ["NIN", "Voters Card", "Drivers License", "International Passport"];

const statusStyle: Record<IdentityStatus, string> = {
  "Not Verified": "bg-muted text-muted-foreground",
  "Pending Review": "bg-warning/10 text-warning",
  "Verified": "bg-success/10 text-success",
  "Rejected": "bg-destructive/10 text-destructive",
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, profile, trustScore, identityStatus, identitySubmission, saveProfile, submitIdentity, logout } = useApp();
  const level = trustLevel(trustScore);

  const [form, setForm] = useState<ContributorProfile>(profile || {
    fullName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
    phone: "", country: "Nigeria", state: "", languages: [], dob: "", gender: "", education: "",
  });
  const photoRef = useRef<HTMLInputElement>(null);
  const photoCameraRef = useRef<HTMLInputElement>(null);

  const [pwOpen, setPwOpen] = useState(false);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);

  const [verifyOpen, setVerifyOpen] = useState(false);
  const [vStep, setVStep] = useState(1);
  const [verify, setVerify] = useState<{ type: IdentityType; number: string; docDataUrl?: string; selfieDataUrl?: string }>({ type: "NIN", number: "" });
  const docRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);

  const update = (k: keyof ContributorProfile) => (v: any) => setForm((f) => ({ ...f, [k]: v }));
  const toggleLang = (lang: string) =>
    setForm((f) => ({ ...f, languages: f.languages.includes(lang) ? f.languages.filter((l) => l !== lang) : [...f.languages, lang] }));

  const readImage = (e: React.ChangeEvent<HTMLInputElement>, cb: (dataUrl: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => cb(r.result as string);
    r.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSave = () => {
    if (!form.fullName || !form.dob || !form.state || form.languages.length === 0 || !form.gender) {
      toast.error("Fill all required fields"); return;
    }
    saveProfile(form);
    toast.success("Profile saved");
  };

  const submitChangePw = () => {
    if (!pw.current || !pw.next || pw.next !== pw.confirm) { toast.error("Check your inputs"); return; }
    setPw({ current: "", next: "", confirm: "" }); setPwOpen(false);
    toast.success("Password updated");
  };

  const submitVerify = () => {
    if (!verify.number || !verify.docDataUrl || !verify.selfieDataUrl) { toast.error("Complete all steps"); return; }
    submitIdentity({ ...verify, submittedAt: new Date().toLocaleString("en-NG") });
    setVerifyOpen(false); setVStep(1);
    toast.success("Identity submitted for review");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-24">
      <AppHeader />
      <main className="flex-1 px-4 pt-4 space-y-5">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="relative">
            {form.photoDataUrl ? (
              <img src={form.photoDataUrl} alt="Profile" className="h-20 w-20 rounded-full object-cover" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <User className="h-9 w-9 text-primary" />
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => photoRef.current?.click()}><Upload className="h-3 w-3" /> Upload</Button>
            <Button size="sm" variant="outline" onClick={() => photoCameraRef.current?.click()}><Camera className="h-3 w-3" /> Take Photo</Button>
            <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={(e) => readImage(e, (d) => update("photoDataUrl")(d))} />
            <input ref={photoCameraRef} type="file" accept="image/*" capture="user" className="hidden" onChange={(e) => readImage(e, (d) => update("photoDataUrl")(d))} />
          </div>
          <h1 className="text-lg font-bold text-foreground">{form.fullName || `${user?.firstName} ${user?.lastName}`}</h1>
          <div className="flex items-center gap-1 text-xs text-muted-foreground"><Mail className="h-3 w-3" />{user?.email}</div>
          <span className="rounded-full bg-primary/10 px-3 py-0.5 text-[10px] font-semibold text-primary">{level} · {trustScore}/100</span>
        </div>

        {/* SECTION 1 — BASIC INFO */}
        <section id="basic" className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <h2 className="text-sm font-bold text-foreground">Basic Information</h2>

          <Field label="Full Name" value={form.fullName} onChange={update("fullName")} />
          <Field label="Email Address" value={user?.email || ""} disabled />
          <Field label="Phone Number" value={form.phone} onChange={update("phone")} type="tel" placeholder="+234..." />

          <Select label="Country" value={form.country} onChange={(v) => update("country")(v as any)} options={COUNTRIES} />
          <Select label="State" value={form.state} onChange={update("state")} options={["", ...NG_STATES]} />

          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Languages</label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l} type="button" onClick={() => toggleLang(l)}
                  className={`rounded-full border px-3 py-1 text-xs ${form.languages.includes(l) ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"}`}
                >{l}</button>
              ))}
            </div>
          </div>

          <Field label="Date of Birth" type="date" value={form.dob} onChange={update("dob")} />
          <Select label="Gender" value={form.gender} onChange={(v) => update("gender")(v as any)} options={["", "Male", "Female", "Prefer Not To Say"]} />
          <Select label="Education Level" value={form.education} onChange={update("education")} options={["", ...EDU]} />

          <Button size="lg" className="w-full" onClick={handleSave}>Save Changes</Button>
        </section>

        {/* SECTION 2 — SECURITY */}
        <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <h2 className="text-sm font-bold text-foreground">Account Security</h2>
          <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">••••••••</span>
            </div>
            <Button size="sm" variant="outline" onClick={() => setPwOpen(true)}>Change Password</Button>
          </div>
        </section>

        {/* SECTION 3 — IDENTITY VERIFICATION */}
        <section id="identity" className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Identity Verification</h2>
            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${statusStyle[identityStatus]}`}>{identityStatus}</span>
          </div>
          {identityStatus === "Not Verified" && (
            <>
              <p className="text-xs text-muted-foreground">Verify your identity to unlock higher-paying tasks (₦3,000 – ₦5,000).</p>
              <Button className="w-full" onClick={() => { setVerifyOpen(true); setVStep(1); }}>Verify Identity</Button>
            </>
          )}
          {identityStatus === "Pending Review" && (
            <div className="flex items-start gap-2 rounded-lg bg-warning/10 p-3 text-xs text-warning"><Clock className="mt-0.5 h-4 w-4" /> Submitted on {identitySubmission?.submittedAt}. Review in 24–48h.</div>
          )}
          {identityStatus === "Verified" && (
            <div className="flex items-start gap-2 rounded-lg bg-success/10 p-3 text-xs text-success"><CheckCircle2 className="mt-0.5 h-4 w-4" /> Your identity has been verified.</div>
          )}
          {identityStatus === "Rejected" && (
            <>
              <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive"><AlertCircle className="mt-0.5 h-4 w-4" /> Submission rejected. Please try again with a clearer document.</div>
              <Button className="w-full" onClick={() => { setVerifyOpen(true); setVStep(1); }}>Re-submit</Button>
            </>
          )}
        </section>

        <Button variant="ghost" className="w-full text-destructive" onClick={() => { logout(); navigate("/"); }}>
          <LogOut className="h-4 w-4" /> Log Out
        </Button>
      </main>
      <BottomNav />

      {/* Change password modal */}
      {pwOpen && (
        <Modal onClose={() => setPwOpen(false)} title="Change Password">
          <div className="space-y-3">
            <div className="relative">
              <Field label="Current Password" type={showPw ? "text" : "password"} value={pw.current} onChange={(v) => setPw({ ...pw, current: v })} />
              <button type="button" className="absolute right-3 top-8 text-muted-foreground" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Field label="New Password" type="password" value={pw.next} onChange={(v) => setPw({ ...pw, next: v })} />
            <Field label="Confirm New Password" type="password" value={pw.confirm} onChange={(v) => setPw({ ...pw, confirm: v })} />
            <Button className="w-full" onClick={submitChangePw}>Save Password</Button>
          </div>
        </Modal>
      )}

      {/* Identity verification modal */}
      {verifyOpen && (
        <Modal onClose={() => setVerifyOpen(false)} title={`Verify Identity (Step ${vStep} of 4)`}>
          {vStep === 1 && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">Select verification type</p>
              <div className="grid grid-cols-2 gap-2">
                {ID_TYPES.map((t) => (
                  <button key={t} onClick={() => setVerify({ ...verify, type: t })}
                    className={`rounded-xl border p-3 text-left text-sm ${verify.type === t ? "border-primary bg-primary/5" : "border-border"}`}>
                    {t}
                  </button>
                ))}
              </div>
              <Button className="w-full" onClick={() => setVStep(2)}>Continue</Button>
            </div>
          )}
          {vStep === 2 && (
            <div className="space-y-3">
              <Field label={`${verify.type} Number`} value={verify.number} onChange={(v) => setVerify({ ...verify, number: v })} />
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setVStep(1)}>Back</Button>
                <Button className="flex-1" onClick={() => setVStep(3)} disabled={!verify.number}>Continue</Button>
              </div>
            </div>
          )}
          {vStep === 3 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Upload your ID document</p>
              {verify.docDataUrl ? (
                <img src={verify.docDataUrl} alt="ID" className="w-full rounded-lg border border-border" />
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => docRef.current?.click()} className="flex h-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-xs">
                    <Upload className="h-5 w-5 text-primary" /> Upload
                  </button>
                  <button onClick={() => docRef.current?.click()} className="flex h-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-xs">
                    <Camera className="h-5 w-5 text-primary" /> Take Picture
                  </button>
                </div>
              )}
              <input ref={docRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => readImage(e, (d) => setVerify((v) => ({ ...v, docDataUrl: d })))} />
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setVStep(2)}>Back</Button>
                <Button className="flex-1" onClick={() => setVStep(4)} disabled={!verify.docDataUrl}>Continue</Button>
              </div>
            </div>
          )}
          {vStep === 4 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Take a selfie</p>
              {verify.selfieDataUrl ? (
                <img src={verify.selfieDataUrl} alt="Selfie" className="w-full rounded-lg border border-border" />
              ) : (
                <button onClick={() => selfieRef.current?.click()} className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-sm">
                  <Camera className="h-6 w-6 text-primary" /> Take Selfie
                </button>
              )}
              <input ref={selfieRef} type="file" accept="image/*" capture="user" className="hidden" onChange={(e) => readImage(e, (d) => setVerify((v) => ({ ...v, selfieDataUrl: d })))} />
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setVStep(3)}>Back</Button>
                <Button className="flex-1" onClick={submitVerify} disabled={!verify.selfieDataUrl}>Submit Verification</Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, disabled }: { label: string; value: string; onChange?: (v: string) => void; type?: string; placeholder?: string; disabled?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-foreground">{label}</label>
      <input
        type={type} value={value} placeholder={placeholder} disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-foreground">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
        {options.map((o) => <option key={o} value={o}>{o || "Select…"}</option>)}
      </select>
    </div>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm md:items-center" onClick={onClose}>
      <div className="w-full max-w-md rounded-t-2xl bg-card p-5 md:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">{title}</h3>
          <button onClick={onClose} aria-label="Close"><X className="h-4 w-4 text-muted-foreground" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
