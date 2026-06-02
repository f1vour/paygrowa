import React, { createContext, useContext, useState, useCallback } from "react";

export type TaskStatus = "draft" | "live" | "paused" | "closed";
export type TaskType = "survey" | "voice" | "data_tagging" | "community_report";
export type SubmissionStatus = "passed" | "failed" | "flagged" | "approved" | "rejected";
export type PaymentStatus = "pending" | "approved" | "paid" | "failed";
export type UserStatus = "active" | "suspended";

export interface AdminQuestion {
  id: string;
  text: string;
  type: "single" | "multiple" | "text" | "image" | "voice";
  options?: string[];
}

export interface AdminTask {
  id: string;
  title: string;
  description: string;
  reward: number;
  estimatedMinutes: number;
  slots: number;
  slotsFilled: number;
  type: TaskType;
  status: TaskStatus;
  createdDate: string;
  questions: AdminQuestion[];
  eligibility?: { ageRange?: string; gender?: string; state?: string; location?: string };
  quality?: { attentionCheck?: string; minTimeSec?: number; requireMedia?: boolean; passThreshold?: number };
  approvalRate?: number;
  avgCompletionMin?: number;
}

export interface AdminSubmission {
  id: string;
  userId: string;
  userName: string;
  taskId: string;
  taskName: string;
  submittedAt: string;
  completionTimeSec: number;
  attentionCheck: "pass" | "fail";
  timeCheck: "pass" | "fail";
  qualityResult: "Passed" | "Failed" | "Flagged";
  status: SubmissionStatus;
  answers: { question: string; answer: string }[];
  mediaUrl?: string;
  rejectionReason?: string;
}

export interface AdminPayment {
  id: string;
  userName: string;
  taskName: string;
  reward: number;
  savingsDeduction: number;
  net: number;
  status: PaymentStatus;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  state: string;
  registrationDate: string;
  tasksCompleted: number;
  walletBalance: number;
  savingsBalance: number;
  status: UserStatus;
}

export interface AdminActivity {
  id: string;
  type: "registration" | "submission" | "approval" | "rejection";
  message: string;
  time: string;
}

interface AdminContextType {
  tasks: AdminTask[];
  submissions: AdminSubmission[];
  payments: AdminPayment[];
  users: AdminUser[];
  activity: AdminActivity[];
  createTask: (t: Omit<AdminTask, "id" | "createdDate" | "slotsFilled" | "status"> & { status?: TaskStatus }) => void;
  updateTask: (id: string, updates: Partial<AdminTask>) => void;
  deleteTask: (id: string) => void;
  reviewSubmission: (id: string, action: "approve" | "reject" | "flag", reason?: string) => void;
  reviewPayment: (id: string, action: "approve" | "reject" | "flag") => void;
  setUserStatus: (id: string, status: UserStatus) => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

// ---------- mock seed data ----------
const today = new Date();
const fmt = (d: Date) => d.toLocaleDateString("en-NG");
const ago = (days: number) => fmt(new Date(today.getTime() - days * 86400000));

const seedTasks: AdminTask[] = [
  {
    id: "t1",
    title: "Student Spending Habits Survey",
    description: "Understand how Nigerian students manage their daily spending.",
    reward: 1000,
    estimatedMinutes: 10,
    slots: 500,
    slotsFilled: 312,
    type: "survey",
    status: "live",
    createdDate: ago(4),
    questions: [],
    approvalRate: 92,
    avgCompletionMin: 8,
  },
  {
    id: "t2",
    title: "Social Media Usage Survey",
    description: "Frequency and platform usage patterns.",
    reward: 500,
    estimatedMinutes: 5,
    slots: 1000,
    slotsFilled: 870,
    type: "survey",
    status: "live",
    createdDate: ago(7),
    questions: [],
    approvalRate: 88,
    avgCompletionMin: 4,
  },
  {
    id: "t3",
    title: "Voice Recording: Yoruba Phrases",
    description: "Record 20 short Yoruba phrases clearly.",
    reward: 1500,
    estimatedMinutes: 15,
    slots: 200,
    slotsFilled: 45,
    type: "voice",
    status: "live",
    createdDate: ago(2),
    questions: [],
    approvalRate: 76,
    avgCompletionMin: 13,
  },
  {
    id: "t4",
    title: "Lagos Market Pricing Report",
    description: "Report current pricing of staples in your local market.",
    reward: 800,
    estimatedMinutes: 8,
    slots: 300,
    slotsFilled: 12,
    type: "community_report",
    status: "draft",
    createdDate: ago(1),
    questions: [],
    approvalRate: 0,
    avgCompletionMin: 0,
  },
  {
    id: "t5",
    title: "Image Tagging — Local Foods",
    description: "Identify Nigerian foods in supplied images.",
    reward: 600,
    estimatedMinutes: 6,
    slots: 400,
    slotsFilled: 400,
    type: "data_tagging",
    status: "closed",
    createdDate: ago(14),
    questions: [],
    approvalRate: 55,
    avgCompletionMin: 5,
  },
];

const seedSubmissions: AdminSubmission[] = [
  {
    id: "s1", userId: "u1", userName: "Chidera O.", taskId: "t1", taskName: "Student Spending Habits Survey",
    submittedAt: ago(0), completionTimeSec: 480, attentionCheck: "pass", timeCheck: "pass",
    qualityResult: "Passed", status: "passed",
    answers: [{ question: "Daily spending?", answer: "₦500 – ₦1,000" }],
  },
  {
    id: "s2", userId: "u2", userName: "Aisha M.", taskId: "t2", taskName: "Social Media Usage Survey",
    submittedAt: ago(0), completionTimeSec: 25, attentionCheck: "fail", timeCheck: "fail",
    qualityResult: "Failed", status: "flagged",
    answers: [{ question: "Hours on social media?", answer: "1-2 hrs" }],
  },
  {
    id: "s3", userId: "u3", userName: "Emeka N.", taskId: "t3", taskName: "Voice Recording: Yoruba Phrases",
    submittedAt: ago(1), completionTimeSec: 780, attentionCheck: "pass", timeCheck: "pass",
    qualityResult: "Passed", status: "approved",
    answers: [], mediaUrl: "voice-recording-3.mp3",
  },
  {
    id: "s4", userId: "u4", userName: "Funke A.", taskId: "t1", taskName: "Student Spending Habits Survey",
    submittedAt: ago(0), completionTimeSec: 320, attentionCheck: "pass", timeCheck: "fail",
    qualityResult: "Flagged", status: "flagged",
    answers: [{ question: "Daily spending?", answer: "₦0 – ₦500" }],
  },
  {
    id: "s5", userId: "u5", userName: "Tunde B.", taskId: "t2", taskName: "Social Media Usage Survey",
    submittedAt: ago(2), completionTimeSec: 290, attentionCheck: "pass", timeCheck: "pass",
    qualityResult: "Passed", status: "approved",
    answers: [],
  },
];

const seedPayments: AdminPayment[] = [
  { id: "p1", userName: "Chidera O.", taskName: "Student Spending Habits Survey", reward: 1000, savingsDeduction: 100, net: 900, status: "pending", createdAt: ago(0) },
  { id: "p2", userName: "Emeka N.", taskName: "Voice Recording: Yoruba Phrases", reward: 1500, savingsDeduction: 75, net: 1425, status: "approved", createdAt: ago(1) },
  { id: "p3", userName: "Tunde B.", taskName: "Social Media Usage Survey", reward: 500, savingsDeduction: 25, net: 475, status: "paid", createdAt: ago(2) },
  { id: "p4", userName: "Grace U.", taskName: "Image Tagging — Local Foods", reward: 600, savingsDeduction: 30, net: 570, status: "paid", createdAt: ago(3) },
  { id: "p5", userName: "Musa A.", taskName: "Student Spending Habits Survey", reward: 1000, savingsDeduction: 50, net: 950, status: "pending", createdAt: ago(0) },
];

const seedUsers: AdminUser[] = [
  { id: "u1", name: "Chidera Okonkwo", email: "chidera@example.com", state: "Lagos", registrationDate: ago(45), tasksCompleted: 18, walletBalance: 4500, savingsBalance: 800, status: "active" },
  { id: "u2", name: "Aisha Mohammed", email: "aisha@example.com", state: "Kano", registrationDate: ago(30), tasksCompleted: 7, walletBalance: 2200, savingsBalance: 300, status: "active" },
  { id: "u3", name: "Emeka Nwankwo", email: "emeka@example.com", state: "Anambra", registrationDate: ago(60), tasksCompleted: 32, walletBalance: 8900, savingsBalance: 1500, status: "active" },
  { id: "u4", name: "Funke Adeyemi", email: "funke@example.com", state: "Oyo", registrationDate: ago(15), tasksCompleted: 4, walletBalance: 1100, savingsBalance: 100, status: "suspended" },
  { id: "u5", name: "Tunde Balogun", email: "tunde@example.com", state: "Lagos", registrationDate: ago(90), tasksCompleted: 54, walletBalance: 12500, savingsBalance: 3200, status: "active" },
  { id: "u6", name: "Grace Uche", email: "grace@example.com", state: "Rivers", registrationDate: ago(7), tasksCompleted: 2, walletBalance: 500, savingsBalance: 0, status: "active" },
];

const seedActivity: AdminActivity[] = [
  { id: "a1", type: "registration", message: "Grace Uche registered", time: "2m ago" },
  { id: "a2", type: "submission", message: "Aisha M. submitted Social Media Survey", time: "5m ago" },
  { id: "a3", type: "approval", message: "Payment approved for Emeka N. (₦1,425)", time: "12m ago" },
  { id: "a4", type: "rejection", message: "Submission rejected for Funke A.", time: "20m ago" },
  { id: "a5", type: "submission", message: "Chidera O. completed Spending Survey", time: "1h ago" },
];

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<AdminTask[]>(seedTasks);
  const [submissions, setSubmissions] = useState<AdminSubmission[]>(seedSubmissions);
  const [payments, setPayments] = useState<AdminPayment[]>(seedPayments);
  const [users, setUsers] = useState<AdminUser[]>(seedUsers);
  const [activity] = useState<AdminActivity[]>(seedActivity);

  const createTask = useCallback((t: Omit<AdminTask, "id" | "createdDate" | "slotsFilled" | "status"> & { status?: TaskStatus }) => {
    setTasks((prev) => [
      { ...t, id: "t" + Date.now(), createdDate: fmt(new Date()), slotsFilled: 0, status: t.status || "draft" },
      ...prev,
    ]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<AdminTask>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const reviewSubmission = useCallback((id: string, action: "approve" | "reject" | "flag", reason?: string) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: action === "approve" ? "approved" : action === "reject" ? "rejected" : "flagged",
              rejectionReason: action === "reject" ? reason : s.rejectionReason,
            }
          : s,
      ),
    );
  }, []);

  const reviewPayment = useCallback((id: string, action: "approve" | "reject" | "flag") => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: action === "approve" ? "approved" : action === "reject" ? "failed" : "pending" }
          : p,
      ),
    );
  }, []);

  const setUserStatus = useCallback((id: string, status: UserStatus) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
  }, []);

  return (
    <AdminContext.Provider value={{ tasks, submissions, payments, users, activity, createTask, updateTask, deleteTask, reviewSubmission, reviewPayment, setUserStatus }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
