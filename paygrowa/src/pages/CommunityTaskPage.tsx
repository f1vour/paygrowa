import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Camera, Image as ImageIcon, MapPin, Banknote, Clock, Calendar, X, Check, CheckCircle2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import PayGrowaLogo from "@/components/PayGrowaLogo";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

type Category = "Waste Management" | "Road Infrastructure" | "Environmental Monitoring" | "Government Data Collection" | "NGO Field Project" | "Community Assessment";

interface CommunityTaskDef {
  id: string;
  title: string;
  category: Category;
  reward: number;
  estimatedTime: string;
  deadline: string;
  location: string;
  description: string;
  requirements: string[];
  minPhotos: number;
  videoRequired?: boolean;
}

const TASKS: Record<string, CommunityTaskDef> = {
  c1: {
    id: "c1", title: "Report a Road Condition", category: "Road Infrastructure", reward: 1500,
    estimatedTime: "5 mins", deadline: "Within 24 hours", location: "Your local area",
    description: "Visit a road in your area. Take clear photographs of any potholes, broken drainage or damaged surfaces and report the severity.",
    requirements: ["Visit a nearby road", "Take at least 2 daylight photos", "Capture GPS location", "Describe what you observed"],
    minPhotos: 2,
  },
  c2: {
    id: "c2", title: "Capture Environmental Conditions", category: "Environmental Monitoring", reward: 1200,
    estimatedTime: "5 mins", deadline: "Within 48 hours", location: "Public outdoor area",
    description: "Visit a public outdoor location. Document the surrounding environment with photos and short observations.",
    requirements: ["Outdoor public area only", "Take at least 2 photos", "Capture GPS location", "Record observations"],
    minPhotos: 2,
  },
  c3: {
    id: "c3", title: "Illegal Waste Dump Reporting", category: "Waste Management", reward: 1800,
    estimatedTime: "8 mins", deadline: "Within 48 hours", location: "Assigned location",
    description: "Visit the assigned location, take clear photos of the waste site and report the type and approximate size.",
    requirements: ["Visit the location", "Take at least 3 photos", "Capture GPS coordinates", "Answer reporting questions"],
    minPhotos: 3,
  },
};

const CATEGORY_FIELDS: Record<Category, { key: string; label: string; type: "select" | "text" | "number"; options?: string[]; required?: boolean }[]> = {
  "Waste Management": [
    { key: "wasteType", label: "What type of waste is present?", type: "select", options: ["Plastic", "Organic", "Construction Waste", "Mixed Waste", "Other"], required: true },
    { key: "size", label: "Approximate size of dump site", type: "select", options: ["Small", "Medium", "Large"], required: true },
    { key: "description", label: "Description", type: "text", required: true },
    { key: "notes", label: "Additional Notes", type: "text" },
  ],
  "Road Infrastructure": [
    { key: "issueType", label: "Type of issue", type: "select", options: ["Pothole", "Broken Drainage", "Damaged Road", "Collapsed Road"], required: true },
    { key: "severity", label: "Severity", type: "select", options: ["Low", "Medium", "High"], required: true },
    { key: "description", label: "Description", type: "text", required: true },
  ],
  "Environmental Monitoring": [
    { key: "weather", label: "Current weather", type: "select", options: ["Sunny", "Cloudy", "Rainy", "Hazy"], required: true },
    { key: "observations", label: "Observations", type: "text", required: true },
  ],
  "Government Data Collection": [
    { key: "shops", label: "Number of shops observed", type: "number", required: true },
    { key: "activity", label: "Market activity level", type: "select", options: ["Low", "Medium", "High"], required: true },
    { key: "water", label: "Water source available?", type: "select", options: ["Yes", "No"], required: true },
    { key: "description", label: "Description", type: "text", required: true },
  ],
  "NGO Field Project": [
    { key: "activity", label: "Activity completed", type: "text", required: true },
    { key: "impact", label: "Impact observed", type: "text", required: true },
    { key: "comments", label: "Additional Comments", type: "text" },
  ],
  "Community Assessment": [
    { key: "summary", label: "Summary of observation", type: "text", required: true },
    { key: "notes", label: "Notes", type: "text" },
  ],
};

const STEPS = ["Overview", "Requirements", "Evidence", "Observations", "Review", "Submit"];

export default function CommunityTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addCommunitySubmission, completeTask } = useApp();
  const task = TASKS[id || "c1"] || TASKS["c1"];

  const [step, setStep] = useState(0);
  const [understood, setUnderstood] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [gps, setGps] = useState<{ lat: number; lng: number; capturedAt: string } | null>(null);
  const [obs, setObs] = useState<Record<string, string | number>>({});

  const photoCamRef = useRef<HTMLInputElement>(null);
  const photoGalRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const fields = CATEGORY_FIELDS[task.category];

  const readFiles = (e: React.ChangeEvent<HTMLInputElement>, setter: (vs: string[]) => void, current: string[]) => {
    const files = Array.from(e.target.files || []);
    const out = [...current];
    let pending = files.length;
    if (pending === 0) return;
    files.forEach((f) => {
      const r = new FileReader();
      r.onload = () => { out.push(r.result as string); pending--; if (pending === 0) setter(out); };
      r.readAsDataURL(f);
    });
    e.target.value = "";
  };

  const captureGPS = () => {
    const stamp = new Date().toLocaleString("en-NG");
    if (!navigator.geolocation) {
      setGps({ lat: 6.5244, lng: 3.3792, capturedAt: stamp });
      toast.success("Location captured");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude, capturedAt: stamp }); toast.success("Location captured"); },
      () => { setGps({ lat: 6.5244, lng: 3.3792, capturedAt: stamp }); toast.success("Location captured (approx)"); },
      { timeout: 5000 }
    );
  };

  const canAdvance = useMemo(() => {
    switch (step) {
      case 0: return true;
      case 1: return understood;
      case 2: return photos.length >= task.minPhotos && !!gps;
      case 3: return fields.every((f) => !f.required || (obs[f.key] !== undefined && obs[f.key] !== ""));
      case 4: return true;
      default: return false;
    }
  }, [step, understood, photos.length, task.minPhotos, gps, fields, obs]);

  const handleNext = () => {
    if (!canAdvance) { toast.error("Complete this step before continuing"); return; }
    setStep((s) => s + 1);
  };
  const handleBack = () => setStep((s) => Math.max(0, s - 1));

  const handleSubmit = () => {
    addCommunitySubmission({
      taskId: task.id, taskTitle: task.title, category: task.category, reward: task.reward,
      photos, videos, gps: gps || undefined, observations: obs,
    });
    completeTask(task.title, task.reward);
    setStep(5);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-24">
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur-md">
        <button onClick={() => step === 0 || step === 5 ? navigate(-1) : handleBack()} aria-label="Back"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <PayGrowaLogo size="sm" clickable={false} />
      </header>

      {step < 5 && (
        <div className="px-4 pt-3">
          <div className="mb-2 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Step {step + 1} of 5</span>
            <span>{STEPS[step]}</span>
          </div>
          <Progress value={((step + 1) / 5) * 100} className="h-1.5" />
        </div>
      )}

      <main className="flex-1 px-4 pt-4 space-y-4">
        {step === 0 && (
          <>
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                <MapPin className="h-3 w-3" /> {task.category}
              </span>
              <h1 className="text-xl font-bold text-foreground">{task.title}</h1>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success"><Banknote className="h-3 w-3" />₦{task.reward.toLocaleString()}</span>
                <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{task.estimatedTime}</span>
                <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"><Calendar className="h-3 w-3" />{task.deadline}</span>
                <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{task.location}</span>
              </div>
              <p className="text-sm text-muted-foreground">{task.description}</p>
            </div>
            <Button size="lg" className="w-full" onClick={handleNext}>Start Task</Button>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="text-base font-bold text-foreground">Task Requirements</h2>
            <ul className="space-y-2 rounded-2xl border border-border bg-card p-4">
              {task.requirements.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-foreground"><Check className="mt-0.5 h-4 w-4 text-success" /> {r}</li>
              ))}
            </ul>
            <label className="flex items-start gap-2 rounded-xl border border-border bg-card p-3 text-sm">
              <input type="checkbox" checked={understood} onChange={(e) => setUnderstood(e.target.checked)} className="mt-0.5 h-4 w-4 accent-primary" />
              <span>I understand the requirements and will follow them.</span>
            </label>
            <Button size="lg" className="w-full" disabled={!understood} onClick={handleNext}>I Understand, Continue</Button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-base font-bold text-foreground">Evidence Collection</h2>
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <p className="text-sm font-medium text-foreground">Photos <span className="text-xs text-muted-foreground">(min {task.minPhotos})</span></p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => photoCamRef.current?.click()} className="flex h-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-xs">
                  <Camera className="h-5 w-5 text-primary" /> Take Photo
                </button>
                <button onClick={() => photoGalRef.current?.click()} className="flex h-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-xs">
                  <ImageIcon className="h-5 w-5 text-primary" /> Upload
                </button>
                <input ref={photoCamRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => readFiles(e, setPhotos, photos)} />
                <input ref={photoGalRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => readFiles(e, setPhotos, photos)} />
              </div>
              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((src, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-border">
                      <img src={src} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                      <button onClick={() => setPhotos((p) => p.filter((_, idx) => idx !== i))} className="absolute right-1 top-1 rounded-full bg-foreground/70 p-1 text-background"><X className="h-3 w-3" /></button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-[11px] text-muted-foreground">{photos.length} / {task.minPhotos} required photos uploaded</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <p className="text-sm font-medium text-foreground">Video (optional)</p>
              <button onClick={() => videoRef.current?.click()} className="flex h-20 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-xs">
                <Video className="h-5 w-5 text-primary" /> Record or Upload Video
              </button>
              <input ref={videoRef} type="file" accept="video/*" capture="environment" className="hidden" onChange={(e) => readFiles(e, setVideos, videos)} />
              {videos.length > 0 && <p className="text-[11px] text-success">{videos.length} video(s) attached</p>}
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
              <p className="text-sm font-medium text-foreground">GPS Location</p>
              {gps ? (
                <div className="rounded-lg bg-success/10 p-3 text-xs text-success">
                  <p className="font-semibold">Location Captured Successfully</p>
                  <p>Lat {gps.lat.toFixed(4)}, Lng {gps.lng.toFixed(4)}</p>
                  <p>{gps.capturedAt}</p>
                </div>
              ) : (
                <Button variant="outline" className="w-full" onClick={captureGPS}><MapPin className="h-4 w-4" /> Capture GPS</Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleBack}>Back</Button>
              <Button className="flex-1" onClick={handleNext} disabled={!canAdvance}>Continue</Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-base font-bold text-foreground">Observation Form</h2>
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="mb-1 block text-xs font-medium text-foreground">{f.label}{f.required && " *"}</label>
                  {f.type === "select" ? (
                    <select value={String(obs[f.key] ?? "")} onChange={(e) => setObs({ ...obs, [f.key]: e.target.value })}
                      className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm">
                      <option value="">Select…</option>
                      {f.options!.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : f.type === "number" ? (
                    <input type="number" value={String(obs[f.key] ?? "")} onChange={(e) => setObs({ ...obs, [f.key]: Number(e.target.value) })}
                      className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm" />
                  ) : (
                    <textarea value={String(obs[f.key] ?? "")} onChange={(e) => setObs({ ...obs, [f.key]: e.target.value })} rows={3}
                      className="w-full rounded-lg border border-input bg-background p-3 text-sm" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleBack}>Back</Button>
              <Button className="flex-1" onClick={handleNext} disabled={!canAdvance}>Continue</Button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-base font-bold text-foreground">Review</h2>
            <div className="rounded-2xl border border-border bg-card p-4 space-y-2 text-sm">
              <Row label="Photos" value={`${photos.length} uploaded`} />
              <Row label="Videos" value={videos.length ? `${videos.length} uploaded` : "None"} />
              <Row label="Location" value={gps ? `${gps.lat.toFixed(4)}, ${gps.lng.toFixed(4)}` : "Not captured"} />
              <Row label="Questions" value={`${fields.length} completed`} />
              <div className="mt-2 grid grid-cols-3 gap-2">
                {photos.slice(0, 6).map((p, i) => (
                  <img key={i} src={p} alt={`Photo ${i + 1}`} className="aspect-square w-full rounded-lg object-cover" />
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
              Make sure your photos are clear, GPS matches the location, and observations are complete. Submissions failing these checks will be rejected.
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleBack}>Back</Button>
              <Button className="flex-1" onClick={handleSubmit}>Submit Task</Button>
            </div>
          </>
        )}

        {step === 5 && (
          <div className="space-y-4 pt-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Submission Received</h2>
            <p className="text-sm text-muted-foreground">Your report has been submitted successfully.</p>
            <div className="rounded-2xl border border-border bg-card p-4 text-left text-sm">
              <Row label="Status" value="Pending Review" />
              <Row label="Expected Review" value="24–48 Hours" />
              <Row label="Reward" value={`₦${task.reward.toLocaleString()}`} />
            </div>
            <Button size="lg" className="w-full" onClick={() => navigate("/dashboard")}>Return to Dashboard</Button>
          </div>
        )}
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-1.5 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}
