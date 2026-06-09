import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export type UserRole = "contributor" | "client" | "admin";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "task" | "savings" | "withdrawal";
  status: "earning" | "verifying" | "paid" | "completed";
  date: string;
  bankName?: string;
  goalName?: string;
  verifyAt?: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  category: string;
  targetAmount: number;
  savedAmount: number;
  timeframe: "weekly" | "monthly" | null;
  targetDate?: string;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export type IdentityType = "NIN" | "Voters Card" | "Drivers License" | "International Passport";
export type IdentityStatus = "Not Verified" | "Pending Review" | "Verified" | "Rejected";

export interface IdentitySubmission {
  type: IdentityType;
  number: string;
  docDataUrl?: string;
  selfieDataUrl?: string;
  submittedAt: string;
}

export interface ContributorProfile {
  fullName: string;
  phone: string;
  photoDataUrl?: string;
  country: "Nigeria" | "Uganda" | "Zambia";
  state: string;
  languages: string[];
  dob: string;
  gender: "Male" | "Female" | "Prefer Not To Say" | "";
  education: string;
}

export interface CommunitySubmission {
  id: string;
  taskId: string;
  taskTitle: string;
  category: string;
  reward: number;
  photos: string[];
  videos: string[];
  gps?: { lat: number; lng: number; capturedAt: string };
  observations: Record<string, string | number>;
  status: "Submitted" | "Under Review" | "Approved" | "Rejected" | "Paid";
  submittedAt: string;
}

export type OrgVerificationStatus = "Not Submitted" | "Pending Verification" | "Verified Organization" | "Rejected";

export interface OrgVerification {
  organizationName: string;
  organizationType: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  status: OrgVerificationStatus;
  documents: { label: string; dataUrl: string }[];
}

export type TrustLevel =
  | "New Contributor"
  | "Verified Contributor"
  | "Bronze Contributor"
  | "Silver Contributor"
  | "Gold Contributor"
  | "Elite Contributor";

export function trustLevel(score: number): TrustLevel {
  if (score >= 96) return "Elite Contributor";
  if (score >= 81) return "Gold Contributor";
  if (score >= 61) return "Silver Contributor";
  if (score >= 41) return "Bronze Contributor";
  if (score >= 21) return "Verified Contributor";
  return "New Contributor";
}

export function nextLevelTarget(score: number): { level: TrustLevel; threshold: number } {
  if (score < 21) return { level: "Verified Contributor", threshold: 21 };
  if (score < 41) return { level: "Bronze Contributor", threshold: 41 };
  if (score < 61) return { level: "Silver Contributor", threshold: 61 };
  if (score < 81) return { level: "Gold Contributor", threshold: 81 };
  if (score < 96) return { level: "Gold Contributor", threshold: 96 };
  return { level: "Elite Contributor", threshold: 100 };
}

interface AppUser { id: string; firstName: string; lastName: string; email: string }

interface AppState {
  authReady: boolean;
  session: Session | null;
  isLoggedIn: boolean;
  role: UserRole;
  user: AppUser | null;
  walletBalance: number;
  savingsBalance: number;
  savingsPercentage: number | null;
  trustScore: number;
  transactions: Transaction[];
  profileCompleted: boolean;
  profile: ContributorProfile | null;
  identityStatus: IdentityStatus;
  identitySubmission: IdentitySubmission | null;
  savingsGoals: SavingsGoal[];
  bankDetails: BankDetails | null;
  communitySubmissions: CommunitySubmission[];
  orgVerification: OrgVerification | null;
}

interface AppContextType extends AppState {
  logout: () => Promise<void>;
  setRole: (role: UserRole) => void;
  // Backwards-compat (no-op now that auth is real, kept so older pages keep compiling)
  login: (email: string) => void;
  signup: (firstName: string, lastName: string, email: string) => void;
  signupClient: (orgName: string, contactName: string, email: string) => void;
  completeTask: (title: string, amount: number) => void;
  setSavingsPreference: (pct: number | null) => void;
  completeProfile: (gender: string, dob: string, state: string) => void;
  saveProfile: (profile: ContributorProfile) => void;
  submitIdentity: (sub: IdentitySubmission) => void;
  setIdentityStatus: (status: IdentityStatus) => void;
  withdraw: (amount: number) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, "id" | "savedAmount">) => void;
  editSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
  addMoneyToGoal: (goalId: string, amount: number) => void;
  setBankDetails: (details: BankDetails) => void;
  processVerifications: () => void;
  applyTrustEvent: (event: "approved" | "highQuality" | "rejected" | "attentionFail" | "fraud") => void;
  addCommunitySubmission: (sub: Omit<CommunitySubmission, "id" | "submittedAt" | "status">) => string;
  setOrgVerification: (v: OrgVerification | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const VERIFY_DURATION = 5 * 60 * 1000;
const TRUST_DELTAS: Record<string, number> = {
  approved: 2, highQuality: 3, rejected: -8, attentionFail: -5, fraud: -20,
};

const INITIAL: AppState = {
  authReady: false,
  session: null,
  isLoggedIn: false,
  role: "contributor",
  user: null,
  walletBalance: 0,
  savingsBalance: 0,
  savingsPercentage: null,
  trustScore: 72,
  transactions: [],
  profileCompleted: false,
  profile: null,
  identityStatus: "Not Verified",
  identitySubmission: null,
  savingsGoals: [],
  bankDetails: null,
  communitySubmissions: [],
  orgVerification: null,
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(INITIAL);

  // Hydrate profile + role from DB for the current user
  const hydrateForUser = useCallback(async (session: Session | null) => {
    if (!session?.user) {
      setState((s) => ({ ...INITIAL, authReady: true }));
      return;
    }
    const uid = session.user.id;
    const [profileRes, rolesRes, bankRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", uid),
      supabase.from("bank_details").select("*").eq("user_id", uid).maybeSingle(),
    ]);

    const roles = (rolesRes.data || []).map((r: any) => r.role);
    const role: UserRole = roles.includes("admin")
      ? "admin"
      : roles.includes("client")
      ? "client"
      : "contributor";

    const p = profileRes.data as any;
    const bank = bankRes.data as any;

    setState((s) => ({
      ...s,
      authReady: true,
      session,
      isLoggedIn: true,
      role,
      user: {
        id: uid,
        firstName: p?.first_name || (session.user.user_metadata as any)?.first_name || "",
        lastName: p?.last_name || (session.user.user_metadata as any)?.last_name || "",
        email: session.user.email || "",
      },
      walletBalance: Number(p?.wallet_balance ?? 0),
      savingsBalance: Number(p?.savings_balance ?? 0),
      savingsPercentage: p?.savings_percentage ?? null,
      trustScore: Number(p?.trust_score ?? 72),
      profileCompleted: Boolean(p?.dob && p?.state && p?.gender),
      profile: p
        ? {
            fullName: p.full_name || `${p.first_name || ""} ${p.last_name || ""}`.trim(),
            phone: p.phone || "",
            country: (p.country as any) || "Nigeria",
            state: p.state || "",
            languages: p.languages || ["English"],
            dob: p.dob || "",
            gender: (p.gender as any) || "",
            education: p.education || "",
          }
        : null,
      bankDetails: bank
        ? { bankName: bank.bank_name, accountNumber: bank.account_number, accountName: bank.account_name }
        : null,
    }));
  }, []);

  useEffect(() => {
    // Listener first so we never miss an event
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer Supabase calls to avoid deadlocks inside the callback
      setTimeout(() => { void hydrateForUser(session); }, 0);
    });
    // Then check current session
    supabase.auth.getSession().then(({ data }) => { void hydrateForUser(data.session); });
    return () => { sub.subscription.unsubscribe(); };
  }, [hydrateForUser]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setState({ ...INITIAL, authReady: true });
  }, []);

  const setRole = useCallback((role: UserRole) => setState((s) => ({ ...s, role })), []);
  // Legacy no-op shims (real auth happens via supabase.auth in the pages)
  const login = useCallback((_email: string) => { /* no-op: use supabase.auth.signInWithPassword */ }, []);
  const signup = useCallback((_f: string, _l: string, _e: string) => { /* no-op */ }, []);
  const signupClient = useCallback((_o: string, _c: string, _e: string) => { /* no-op */ }, []);

  const completeTask = useCallback((title: string, amount: number) => {
    setState((s) => {
      const tx: Transaction = {
        id: Date.now().toString(), title, amount, type: "task", status: "verifying",
        date: new Date().toLocaleDateString("en-NG"), verifyAt: Date.now() + VERIFY_DURATION,
      };
      return { ...s, transactions: [tx, ...s.transactions] };
    });
  }, []);

  const processVerifications = useCallback(() => {
    setState((s) => {
      const now = Date.now();
      let balanceAdd = 0, savingsAdd = 0, trustAdd = 0;
      const updatedTx = s.transactions.map((tx) => {
        if (tx.status === "verifying" && tx.verifyAt && now >= tx.verifyAt) {
          const savingsDeduction = s.savingsPercentage ? (tx.amount * s.savingsPercentage) / 100 : 0;
          balanceAdd += tx.amount - savingsDeduction;
          savingsAdd += savingsDeduction;
          trustAdd += TRUST_DELTAS.approved;
          return { ...tx, status: "paid" as const };
        }
        return tx;
      });
      if (balanceAdd === 0 && savingsAdd === 0) return s;
      return {
        ...s,
        walletBalance: s.walletBalance + balanceAdd,
        savingsBalance: s.savingsBalance + savingsAdd,
        trustScore: Math.max(0, Math.min(100, s.trustScore + trustAdd)),
        transactions: updatedTx,
      };
    });
  }, []);

  const setSavingsPreference = useCallback((pct: number | null) => setState((s) => ({ ...s, savingsPercentage: pct })), []);

  const completeProfile = useCallback((gender: string, dob: string, state_: string) => {
    setState((s) => {
      const next: AppState = {
        ...s,
        profileCompleted: true,
        profile: s.profile
          ? { ...s.profile, gender: gender as any, dob, state: state_ }
          : {
              fullName: `${s.user?.firstName || ""} ${s.user?.lastName || ""}`.trim(),
              phone: "", country: "Nigeria", state: state_, languages: ["English"],
              dob, gender: gender as any, education: "",
            },
      };
      // Persist to DB if logged in
      if (s.user?.id) {
        void supabase.from("profiles").update({
          gender: gender as any, dob, state: state_,
        }).eq("id", s.user.id);
      }
      return next;
    });
  }, []);

  const saveProfile = useCallback((profile: ContributorProfile) => {
    setState((s) => {
      if (s.user?.id) {
        void supabase.from("profiles").update({
          full_name: profile.fullName,
          phone: profile.phone,
          country: profile.country,
          state: profile.state,
          languages: profile.languages,
          dob: profile.dob || null,
          gender: profile.gender || null,
          education: profile.education,
        }).eq("id", s.user.id);
      }
      return {
        ...s,
        profile,
        profileCompleted: Boolean(profile.fullName && profile.dob && profile.state && profile.languages.length && profile.gender),
      };
    });
  }, []);

  const submitIdentity = useCallback((sub: IdentitySubmission) => {
    setState((s) => {
      if (s.user?.id) {
        void supabase.from("identity_submissions").insert({
          user_id: s.user.id,
          type: sub.type as any,
          id_number: sub.number,
          doc_url: sub.docDataUrl ?? null,
          selfie_url: sub.selfieDataUrl ?? null,
          status: "Pending Review" as any,
        });
      }
      return { ...s, identitySubmission: sub, identityStatus: "Pending Review" };
    });
  }, []);

  const setIdentityStatus = useCallback((status: IdentityStatus) => setState((s) => ({ ...s, identityStatus: status })), []);

  const withdraw = useCallback((amount: number) => {
    setState((s) => {
      const txs: Transaction[] = [];
      let walletAfter = Math.max(0, s.walletBalance - amount);
      let savingsAfter = s.savingsBalance;
      if (s.savingsPercentage === null && amount >= 100) {
        const autoSave = Math.round(amount * 0.1);
        if (walletAfter >= autoSave) {
          walletAfter -= autoSave;
          savingsAfter += autoSave;
          txs.push({
            id: (Date.now() + 1).toString(),
            title: "Auto-Save (10%)", amount: -autoSave, type: "savings", status: "completed",
            date: new Date().toLocaleDateString("en-NG"),
          });
        }
      }
      txs.unshift({
        id: Date.now().toString(),
        title: "Withdrawal", amount: -amount, type: "withdrawal", status: "completed",
        date: new Date().toLocaleDateString("en-NG"), bankName: s.bankDetails?.bankName,
      });
      // Persist transactions
      if (s.user?.id) {
        void supabase.from("transactions").insert(
          txs.map((t) => ({
            user_id: s.user!.id,
            title: t.title, amount: t.amount,
            type: t.type as any, status: t.status as any,
            bank_name: t.bankName ?? null,
          }))
        );
      }
      return { ...s, walletBalance: walletAfter, savingsBalance: savingsAfter, transactions: [...txs, ...s.transactions] };
    });
  }, []);

  const addSavingsGoal = useCallback((goal: Omit<SavingsGoal, "id" | "savedAmount">) => {
    setState((s) => {
      const existingAllocated = s.savingsGoals.reduce((sum, g) => sum + g.savedAmount, 0);
      const unallocated = Math.max(0, s.savingsBalance - existingAllocated);
      const seedAmount = Math.min(unallocated, goal.targetAmount);
      const id = Date.now().toString();
      if (s.user?.id) {
        void supabase.from("savings_goals").insert({
          user_id: s.user.id,
          name: goal.name,
          category: goal.category,
          target_amount: goal.targetAmount,
          saved_amount: seedAmount,
          timeframe: goal.timeframe,
          target_date: goal.targetDate ?? null,
        });
      }
      return { ...s, savingsGoals: [...s.savingsGoals, { ...goal, id, savedAmount: seedAmount }] };
    });
  }, []);

  const editSavingsGoal = useCallback((id: string, updates: Partial<SavingsGoal>) => {
    setState((s) => ({ ...s, savingsGoals: s.savingsGoals.map((g) => g.id === id ? { ...g, ...updates } : g) }));
  }, []);

  const deleteSavingsGoal = useCallback((id: string) => {
    setState((s) => ({ ...s, savingsGoals: s.savingsGoals.filter((g) => g.id !== id) }));
  }, []);

  const addMoneyToGoal = useCallback((goalId: string, amount: number) => {
    setState((s) => {
      if (s.walletBalance < amount) return s;
      const tx: Transaction = {
        id: Date.now().toString(),
        title: "Moved to Savings", amount: -amount, type: "savings", status: "completed",
        date: new Date().toLocaleDateString("en-NG"),
        goalName: s.savingsGoals.find((g) => g.id === goalId)?.name,
      };
      if (s.user?.id) {
        void supabase.from("transactions").insert({
          user_id: s.user.id, title: tx.title, amount: tx.amount,
          type: tx.type as any, status: tx.status as any, goal_name: tx.goalName ?? null,
        });
      }
      return {
        ...s,
        walletBalance: s.walletBalance - amount,
        savingsBalance: s.savingsBalance + amount,
        savingsGoals: s.savingsGoals.map((g) => g.id === goalId ? { ...g, savedAmount: g.savedAmount + amount } : g),
        transactions: [tx, ...s.transactions],
      };
    });
  }, []);

  const setBankDetails = useCallback((details: BankDetails) => {
    setState((s) => {
      if (s.user?.id) {
        void supabase.from("bank_details").upsert({
          user_id: s.user.id,
          bank_name: details.bankName,
          account_number: details.accountNumber,
          account_name: details.accountName,
        }, { onConflict: "user_id" });
      }
      return { ...s, bankDetails: details };
    });
  }, []);

  const applyTrustEvent = useCallback((event: keyof typeof TRUST_DELTAS) => {
    setState((s) => ({ ...s, trustScore: Math.max(0, Math.min(100, s.trustScore + TRUST_DELTAS[event])) }));
  }, []);

  const addCommunitySubmission = useCallback((sub: Omit<CommunitySubmission, "id" | "submittedAt" | "status">) => {
    const id = "cs_" + Date.now();
    setState((s) => {
      if (s.user?.id) {
        void supabase.from("community_submissions").insert({
          user_id: s.user.id,
          task_id: sub.taskId,
          task_title: sub.taskTitle,
          category: sub.category,
          reward: sub.reward,
          photos: sub.photos,
          videos: sub.videos,
          gps_lat: sub.gps?.lat ?? null,
          gps_lng: sub.gps?.lng ?? null,
          gps_captured_at: sub.gps?.capturedAt ?? null,
          observations: sub.observations as any,
          status: "Under Review" as any,
        });
      }
      return {
        ...s,
        communitySubmissions: [
          { ...sub, id, status: "Under Review", submittedAt: new Date().toLocaleString("en-NG") },
          ...s.communitySubmissions,
        ],
      };
    });
    return id;
  }, []);

  const setOrgVerification = useCallback((v: OrgVerification | null) => setState((s) => ({ ...s, orgVerification: v })), []);

  return (
    <AppContext.Provider value={{
      ...state, login, signup, signupClient, logout, setRole, completeTask, setSavingsPreference,
      completeProfile, saveProfile, submitIdentity, setIdentityStatus, withdraw,
      addSavingsGoal, editSavingsGoal, deleteSavingsGoal, addMoneyToGoal,
      setBankDetails, processVerifications, applyTrustEvent,
      addCommunitySubmission, setOrgVerification,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
