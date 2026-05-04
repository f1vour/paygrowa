import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

const states = ["Lagos", "Abuja", "Rivers", "Oyo", "Kano", "Enugu", "Delta", "Edo", "Kaduna", "Ondo", "Ogun", "Anambra", "Imo", "Kwara", "Osun"];

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const { completeProfile } = useApp();
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [state, setState] = useState("");

  const valid = gender && dob && state;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    completeProfile(gender, dob, state);
    toast.success("Profile completed!");
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="tap-scale"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <span className="font-bold text-foreground">Complete Profile</span>
      </header>

      <main className="flex-1 px-4 pt-6 pb-8">
        <p className="mb-6 text-sm text-muted-foreground">Fill in your details to unlock more tasks and higher rewards.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="h-12 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="h-12 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="h-12 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select state</option>
              {states.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={!valid}>Save Profile</Button>
        </form>
      </main>
    </div>
  );
}
