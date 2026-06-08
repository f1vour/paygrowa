import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, MapPin, Tag, Bot, Clock, ArrowRight } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";

interface TaskItem { id: string; title: string; reward: number; time: string; route: string; }

const surveyTasks: TaskItem[] = [
  { id: "1", title: "Student Spending Habits Survey", reward: 1000, time: "10 mins", route: "/task/1" },
  { id: "2", title: "Social Media Usage Survey", reward: 500, time: "5 mins", route: "/task/2" },
  { id: "3", title: "Daily Routine & Lifestyle Survey", reward: 800, time: "8 mins", route: "/task/3" },
];
const communityList: TaskItem[] = [
  { id: "c1", title: "Report a Road Condition", reward: 1500, time: "5 mins", route: "/community/c1" },
  { id: "c2", title: "Capture Environmental Conditions", reward: 1200, time: "5 mins", route: "/community/c2" },
];
const dataTaggingList: TaskItem[] = [
  { id: "dt1", title: "Tag Nigerian Food Images", reward: 600, time: "6 mins", route: "/task/1" },
];
const annotationList: TaskItem[] = [
  { id: "ai1", title: "Audio Transcription — Yoruba", reward: 1800, time: "12 mins", route: "/task/1" },
];

const categories = [
  { key: "surveys", title: "Surveys", icon: ClipboardList, desc: "Share your opinion to help brands and researchers", items: surveyTasks, accent: "bg-primary/10 text-primary" },
  { key: "community", title: "Local Community Reporting", icon: MapPin, desc: "Report what's happening around you", items: communityList, accent: "bg-secondary/10 text-secondary" },
  { key: "tagging", title: "Data Tagging", icon: Tag, desc: "Label and classify images or text", items: dataTaggingList, accent: "bg-tertiary/10 text-tertiary" },
  { key: "annotation", title: "AI Annotation", icon: Bot, desc: "Help train AI models with structured data", items: annotationList, accent: "bg-warning/10 text-warning" },
];

export default function TasksHubPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string | null>(null);

  const active = categories.find((c) => c.key === open);

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <AppHeader />
      <main className="flex-1 px-4 pt-4 space-y-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Tasks</h1>
          <p className="text-sm text-muted-foreground">All your earning opportunities in one place</p>
        </div>

        {!active && (
          <div className="space-y-3">
            {categories.map((c) => {
              const Icon = c.icon;
              const rewards = c.items.map((i) => i.reward);
              const min = rewards.length ? Math.min(...rewards) : 0;
              const max = rewards.length ? Math.max(...rewards) : 0;
              return (
                <button
                  key={c.key}
                  onClick={() => setOpen(c.key)}
                  className="flex w-full items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left tap-scale"
                >
                  <div className={`rounded-xl p-2.5 ${c.accent}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">{c.title}</p>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">{c.desc}</p>
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                      <span>{c.items.length} available</span>
                      {rewards.length > 0 && (
                        <>
                          <span>Avg ₦{min === max ? min.toLocaleString() : `${min.toLocaleString()}–${max.toLocaleString()}`}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />~{c.items[0].time}</span>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {active && (
          <>
            <button onClick={() => setOpen(null)} className="text-xs font-medium text-primary tap-scale">← All categories</button>
            <h2 className="text-base font-bold text-foreground">{active.title}</h2>
            <div className="space-y-3">
              {active.items.length === 0 && (
                <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
                  No tasks available right now. Check back soon.
                </div>
              )}
              {active.items.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{t.title}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{t.time}</span>
                      <span className="font-semibold text-success">₦{t.reward.toLocaleString()}</span>
                      <span className="text-[10px]">12 slots left</span>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => navigate(t.route)} className="tap-scale">Start Task</Button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
