import { ArrowLeft, Shield, Clock, Banknote, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const taskData: Record<string, { title: string; reward: number; time: string; description: string; requirements: string[]; goodResponse: string }> = {
  "1": {
    title: "Student Spending Habits Survey",
    reward: 1000,
    time: "5–10 minutes",
    description: "Help us understand how Nigerian students spend their money daily. Your responses contribute to research aimed at improving student financial tools.",
    requirements: ["Be a current student or recent graduate", "Answer honestly and completely", "Spend at least 5 minutes"],
    goodResponse: "A good response is detailed, honest, and reflects your real habits. Avoid one-word answers for open-ended questions.",
  },
  "2": {
    title: "Social Media Usage Survey",
    reward: 500,
    time: "5 minutes",
    description: "Share your social media usage patterns to help brands understand Nigerian digital behavior.",
    requirements: ["Active social media user", "Answer all questions", "Be honest"],
    goodResponse: "Provide specific details about your usage. Mention actual platforms and time spent.",
  },
  "3": {
    title: "Daily Routine & Lifestyle Survey",
    reward: 800,
    time: "8 minutes",
    description: "Tell us about your daily routine, lifestyle choices, and spending patterns.",
    requirements: ["Be 18+ years old", "Complete all questions", "Provide thoughtful answers"],
    goodResponse: "Describe your actual daily routine with specifics. Avoid vague or generic answers.",
  },
};

export default function TaskDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const task = taskData[id || "1"] || taskData["1"];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="tap-scale"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="font-bold text-foreground">PayGrowa</span>
        </div>
      </header>

      <main className="flex-1 px-4 pt-6 pb-8 space-y-5">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <h1 className="text-xl font-bold text-foreground">{task.title}</h1>
          <div className="flex flex-wrap gap-3">
            <span className="flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
              <Banknote className="h-3 w-3" />₦{task.reward.toLocaleString()}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              <Clock className="h-3 w-3" />{task.time}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <CheckCircle className="h-3 w-3" />Verified Partner
            </span>
          </div>
        </div>

        <section>
          <h2 className="mb-2 text-sm font-semibold text-foreground">Description</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{task.description}</p>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-semibold text-foreground">What a good response looks like</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{task.goodResponse}</p>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-semibold text-foreground">Requirements</h2>
          <ul className="space-y-2">
            {task.requirements.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                {r}
              </li>
            ))}
          </ul>
        </section>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" size="lg" onClick={() => navigate(-1)} className="flex-1">
            Back
          </Button>
          <Button size="lg" onClick={() => navigate(`/survey/${id || "1"}`)} className="flex-1">
            Start Task
          </Button>
        </div>
      </main>
    </div>
  );
}
