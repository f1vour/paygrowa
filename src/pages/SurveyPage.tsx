import { useState, useRef } from "react";
import { ArrowLeft, ArrowRight, ShieldCheck, AlertTriangle, MoreVertical } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Question {
  id: number;
  text: string;
  type: "single" | "text" | "attention";
  options?: string[];
  correctAnswer?: string;
}

const questions: Question[] = [
  {
    id: 1,
    text: "How often do you spend money on food daily?",
    type: "single",
    options: ["Once a day", "2-3 times a day", "More than 3 times", "Rarely"],
  },
  {
    id: 2,
    text: "What is your average daily spending?",
    type: "single",
    options: ["₦0 – ₦500", "₦500 – ₦1,000", "₦1,000 – ₦2,000", "₦2,000+"],
  },
  {
    id: 3,
    text: "Do you currently have a side income?",
    type: "single",
    options: ["Yes, regularly", "Sometimes", "No, not at all", "I'm looking for one"],
  },
  {
    id: 4,
    text: "What do you spend the most on?",
    type: "single",
    options: ["Food & Drinks", "Transportation", "Data & Airtime", "Entertainment"],
  },
  {
    id: 5,
    text: "Describe your biggest daily expense and why.",
    type: "text",
  },
  {
    id: 6,
    text: "Which of the following is NOT a common daily expense for students?",
    type: "attention",
    options: ["Food", "Transport", "Data", "Airplane ticket"],
    correctAnswer: "Airplane ticket",
  },
];

export default function SurveyPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showQualityAlert, setShowQualityAlert] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const startTimeRef = useRef(Date.now());

  const q = questions[step];
  const total = questions.length;
  const progress = ((step + 1) / total) * 100;

  const currentAnswer = answers[q.id];
  const hasAnswer = q.type === "text" ? typeof currentAnswer === "string" && currentAnswer.trim().length > 10 : !!currentAnswer;

  const handleSelect = (option: string) => {
    setAnswers((a) => ({ ...a, [q.id]: option }));
  };

  const handleNext = () => {
    if (q.type === "attention" && currentAnswer !== q.correctAnswer) {
      setShowQualityAlert(true);
      return;
    }

    if (step === total - 1) {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      if (elapsed < 30) {
        setShowQualityAlert(true);
        return;
      }
      setShowConfirmation(true);
    } else {
      setStep(step + 1);
    }
  };

  const handleSubmit = () => {
    const taskId = id || "1";
    const rewards: Record<string, number> = { "1": 1000, "2": 500, "3": 800 };
    navigate("/success", { state: { taskTitle: "Student Spending Habits Survey", reward: rewards[taskId] || 1000 } });
  };

  if (showQualityAlert) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <header className="flex items-center gap-3 border-b border-border px-4 py-3">
          <button onClick={() => setShowQualityAlert(false)} className="tap-scale"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
          <span className="font-bold text-primary">PayGrowa</span>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center px-6">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Quality Control</h2>
            <p className="text-sm text-muted-foreground">
              We noticed your response may not meet our quality standards. Please review your answers carefully to continue earning.
            </p>
            <div className="rounded-xl border border-border bg-muted/50 p-4 text-left">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">Why this matters</span>
              </div>
              <p className="text-xs text-muted-foreground">Accurate responses ensure reliable payments and maintain your account standing and trust score.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="lg" className="flex-1" onClick={() => { setShowQualityAlert(false); setStep(0); setAnswers({}); startTimeRef.current = Date.now(); }}>
                Retry
              </Button>
              <Button size="lg" className="flex-1" onClick={() => { setShowQualityAlert(false); if (q.type === "attention") setAnswers((a) => ({ ...a, [q.id]: undefined as any })); }}>
                Review Answers
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground">Reference ID: QC-{Math.random().toString(36).slice(2, 6).toUpperCase()}-PG</p>
          </div>
        </main>
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm px-6">
        <div className="w-full max-w-sm rounded-2xl bg-card p-6 text-center space-y-4 animate-scale-in">
          <h2 className="text-lg font-bold text-foreground">Submit Survey?</h2>
          <p className="text-sm text-muted-foreground">Once submitted, your answers cannot be changed. Your payment will be processed shortly.</p>
          <div className="flex gap-3">
            <Button variant="outline" size="lg" className="flex-1" onClick={() => setShowConfirmation(false)}>Cancel</Button>
            <Button size="lg" className="flex-1" onClick={handleSubmit}>Submit</Button>
          </div>
        </div>
      </div>
    );
  }

  const isAttention = q.type === "attention";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/95 px-4 py-3 backdrop-blur-md">
        <button onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)} className="tap-scale">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <span className="font-bold text-primary">PayGrowa</span>
        <MoreVertical className="h-5 w-5 text-muted-foreground" />
      </header>

      <div className="px-4 pt-4 space-y-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Step {step + 1} of {total}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-secondary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <main className="flex-1 px-4 pt-6 pb-24 space-y-4">
        {isAttention && (
          <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
            <p className="text-xs text-foreground">Attention Check: Please select the correct answer to continue earning.</p>
          </div>
        )}

        <h2 className="text-lg font-bold text-foreground">{q.text}</h2>
        {q.type === "text" && <p className="text-xs text-muted-foreground">Please provide a detailed response (at least 10 characters).</p>}

        {(q.type === "single" || q.type === "attention") && q.options && (
          <div className="space-y-3">
            {q.options.map((option) => {
              const selected = currentAnswer === option;
              return (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all tap-scale ${
                    selected
                      ? "border-primary bg-primary/5 font-medium text-foreground"
                      : "border-border bg-card text-foreground hover:border-primary/30"
                  }`}
                >
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${selected ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                    {selected && <div className="h-2 w-2 rounded-full bg-primary-foreground" />}
                  </div>
                  <span className="text-sm">{option}</span>
                </button>
              );
            })}
          </div>
        )}

        {q.type === "text" && (
          <textarea
            value={currentAnswer || ""}
            onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
            placeholder="Type your answer here..."
            rows={5}
            className="w-full rounded-xl border border-input bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/95 px-4 py-3 backdrop-blur-md">
        <Button size="lg" className="w-full" disabled={!hasAnswer} onClick={handleNext}>
          {step === total - 1 ? "Submit" : "Next"}
          <ArrowRight className="h-4 w-4" />
        </Button>
        <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-muted-foreground/60">
          <ShieldCheck className="h-3 w-3" />
          Secured by PayGrowa Financial Protocol
        </div>
      </div>
    </div>
  );
}
