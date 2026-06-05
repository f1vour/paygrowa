import { useRef, useState } from "react";
import { ArrowLeft, Camera, Image as ImageIcon, Banknote, Clock, MapPin, X, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PayGrowaLogo from "@/components/PayGrowaLogo";

const communityTasks: Record<string, { title: string; reward: number; deadline: string; instructions: string[]; example: string }> = {
  "c1": {
    title: "Report a Road Condition",
    reward: 1500,
    deadline: "Within 24 hours",
    instructions: [
      "Walk to a nearby road in your area",
      "Take a clear photo showing the road surface",
      "Capture any potholes, flooding or damage if present",
      "Make sure the photo is taken in daylight",
    ],
    example: "Clear daylight photo of road surface, no people identifiable, taken within your local area.",
  },
  "c2": {
    title: "Capture Environmental Conditions",
    reward: 1200,
    deadline: "Within 48 hours",
    instructions: [
      "Pick a public outdoor area near you",
      "Take 1–2 photos showing current weather / surroundings",
      "Avoid private property and identifiable faces",
    ],
    example: "Outdoor scene, sky and ground visible, clearly lit.",
  },
};

export default function CommunityTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const task = communityTasks[id || "c1"] || communityTasks["c1"];
  const [images, setImages] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => setImages((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(f);
    });
    e.target.value = "";
  };

  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const canSubmit = images.length >= 1 && confirmed && !submitting;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setShowConfirm(true);
  };

  const confirmSubmit = () => {
    setSubmitting(true);
    setShowConfirm(false);
    setTimeout(() => navigate("/success", { state: { taskTitle: task.title, reward: task.reward, category: "community" } }), 300);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-24">
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="tap-scale" aria-label="Back"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <PayGrowaLogo size="sm" clickable={false} />
      </header>

      <main className="flex-1 px-4 pt-5 space-y-5">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
            <MapPin className="h-3 w-3" /> Local Community Reporting
          </span>
          <h1 className="text-xl font-bold text-foreground">{task.title}</h1>
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
              <Banknote className="h-3 w-3" />₦{task.reward.toLocaleString()}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              <Clock className="h-3 w-3" />{task.deadline}
            </span>
          </div>
        </div>

        <section>
          <h2 className="mb-2 text-sm font-semibold text-foreground">Instructions</h2>
          <ul className="space-y-2">
            {task.instructions.map((line, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                {line}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-semibold text-foreground">What a good submission looks like</h2>
          <p className="rounded-xl border border-border bg-muted/40 p-3 text-sm text-muted-foreground">{task.example}</p>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-semibold text-foreground">Upload Photos</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => cameraRef.current?.click()}
              className="flex h-28 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card text-sm font-medium text-foreground tap-scale hover:border-primary hover:bg-primary/5"
            >
              <Camera className="h-6 w-6 text-primary" />
              Take Photo
            </button>
            <button
              onClick={() => galleryRef.current?.click()}
              className="flex h-28 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card text-sm font-medium text-foreground tap-scale hover:border-primary hover:bg-primary/5"
            >
              <ImageIcon className="h-6 w-6 text-primary" />
              From Gallery
            </button>
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFiles} />
            <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
          </div>

          {images.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {images.map((src, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-border">
                  <img src={src} alt={`Upload ${i + 1}`} className="h-full w-full object-cover" />
                  <button
                    onClick={() => removeImage(i)}
                    aria-label="Remove image"
                    className="absolute right-1 top-1 rounded-full bg-foreground/70 p-1 text-background"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {images.length === 0 && (
            <p className="mt-2 text-xs text-muted-foreground">At least one photo is required.</p>
          )}
        </section>

        <label className="flex items-start gap-2 rounded-xl border border-border bg-card p-3 text-sm text-foreground">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
          />
          <span>I confirm the photos are authentic, taken by me, and represent the conditions described.</span>
        </label>

        <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground flex items-start gap-2">
          <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
          After submission, your report enters verification. Earnings are credited as Paid within 5 minutes.
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" size="lg" onClick={() => navigate(-1)} className="flex-1">Back</Button>
          <Button size="lg" onClick={handleSubmit} disabled={!canSubmit} className="flex-1">
            {submitting ? "Submitting…" : "Submit Report"}
          </Button>
        </div>
      </main>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm px-6">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 text-center space-y-4 animate-scale-in">
            <h2 className="text-lg font-bold text-foreground">Submit Report?</h2>
            <p className="text-sm text-muted-foreground">Once submitted, your report cannot be changed. Your payment will be processed shortly.</p>
            <div className="flex gap-3">
              <Button variant="outline" size="lg" className="flex-1" onClick={() => setShowConfirm(false)}>Cancel</Button>
              <Button size="lg" className="flex-1" onClick={confirmSubmit}>Submit</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
