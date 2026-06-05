import React, { createContext, useContext, useState, useCallback } from "react";

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

export type TrustLevel = "Trusted" | "Good" | "Under Review" | "Restricted";

export function trustLevel(score: number): TrustLevel {
  if (score >= 90) return "Trusted";
  if (score >= 70) return "Good";
  if (score >= 50) return "Under Review";
  return "Restricted";
}

interface AppState {
  isLoggedIn: boolean;
  role: UserRole;
  user: { firstName: string; lastName: string; email: string } | null;
  walletBalance: number;
  savingsBalance: number;
  savingsPercentage: number | null;
  trustScore: number;
  transactions: Transaction[];
  profileCompleted: boolean;
  profile: { gender: string; dob: string; state: string } | null;
  savingsGoals: SavingsGoal[];
  bankDetails: BankDetails | null;
}

interface AppContextType extends AppState {
  login: (email: string) => void;
  signup: (firstName: string, lastName: string, email: string) => void;
  signupClient: (orgName: string, contactName: string, email: string) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
  completeTask: (title: string, amount: number) => void;
  setSavingsPreference: (pct: number | null) => void;
  completeProfile: (gender: string, dob: string, state: string) => void;
  withdraw: (amount: number) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, "id" | "savedAmount">) => void;
  editSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
  addMoneyToGoal: (goalId: string, amount: number) => void;
  setBankDetails: (details: BankDetails) => void;
  processVerifications: () => void;
  applyTrustEvent: (event: "approved" | "highQuality" | "rejected" | "attentionFail" | "fraud") => void;
}

const AppContext = createContext<AppContextType | null>(null);

const VERIFY_DURATION = 5 * 60 * 1000; // 5 minutes

const TRUST_DELTAS: Record<string, number> = {
  approved: 2,
  highQuality: 3,
  rejected: -8,
  attentionFail: -5,
  fraud: -20,
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    isLoggedIn: false,
    role: "contributor",
    user: null,
    walletBalance: 0,
    savingsBalance: 0,
    savingsPercentage: null,
    trustScore: 100,
    transactions: [],
    profileCompleted: false,
    profile: null,
    savingsGoals: [],
    bankDetails: null,
  });

  const login = useCallback((email: string) => {
    setState((s) => ({ ...s, isLoggedIn: true, user: s.user || { firstName: "User", lastName: "", email } }));
  }, []);

  const signup = useCallback((firstName: string, lastName: string, email: string) => {
    setState((s) => ({ ...s, isLoggedIn: true, role: "contributor", user: { firstName, lastName, email } }));
  }, []);

  const signupClient = useCallback((orgName: string, contactName: string, email: string) => {
    setState((s) => ({ ...s, isLoggedIn: true, role: "client", user: { firstName: contactName, lastName: orgName, email } }));
  }, []);

  const logout = useCallback(() => {
    setState((s) => ({ ...s, isLoggedIn: false, role: "contributor" }));
  }, []);

  const setRole = useCallback((role: UserRole) => {
    setState((s) => ({ ...s, role }));
  }, []);

  const completeTask = useCallback((title: string, amount: number) => {
    setState((s) => {
      const tx: Transaction = {
        id: Date.now().toString(),
        title,
        amount,
        type: "task",
        status: "verifying",
        date: new Date().toLocaleDateString("en-NG"),
        verifyAt: Date.now() + VERIFY_DURATION,
      };
      return {
        ...s,
        transactions: [tx, ...s.transactions],
      };
    });
  }, []);

  const processVerifications = useCallback(() => {
    setState((s) => {
      const now = Date.now();
      let balanceAdd = 0;
      let savingsAdd = 0;
      let trustAdd = 0;
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

  const setSavingsPreference = useCallback((pct: number | null) => {
    setState((s) => ({ ...s, savingsPercentage: pct }));
  }, []);

  const completeProfile = useCallback((gender: string, dob: string, state_: string) => {
    setState((s) => ({ ...s, profileCompleted: true, profile: { gender, dob, state: state_ } }));
  }, []);

  const withdraw = useCallback((amount: number) => {
    setState((s) => {
      const txs: Transaction[] = [];
      let walletAfter = Math.max(0, s.walletBalance - amount);
      let savingsAfter = s.savingsBalance;
      // Auto-savings if no autosave preference set: move 10% of withdrawal to savings
      if (s.savingsPercentage === null && amount >= 100) {
        const autoSave = Math.round(amount * 0.1);
        if (walletAfter >= autoSave) {
          walletAfter -= autoSave;
          savingsAfter += autoSave;
          txs.push({
            id: (Date.now() + 1).toString(),
            title: "Auto-Save (10%)",
            amount: -autoSave,
            type: "savings",
            status: "completed",
            date: new Date().toLocaleDateString("en-NG"),
          });
        }
      }
      txs.unshift({
        id: Date.now().toString(),
        title: "Withdrawal",
        amount: -amount,
        type: "withdrawal",
        status: "completed",
        date: new Date().toLocaleDateString("en-NG"),
        bankName: s.bankDetails?.bankName,
      });
      return {
        ...s,
        walletBalance: walletAfter,
        savingsBalance: savingsAfter,
        transactions: [...txs, ...s.transactions],
      };
    });
  }, []);

  const addSavingsGoal = useCallback((goal: Omit<SavingsGoal, "id" | "savedAmount">) => {
    setState((s) => {
      // Distribute existing savingsBalance to the new goal up to its target
      const existingAllocated = s.savingsGoals.reduce((sum, g) => sum + g.savedAmount, 0);
      const unallocated = Math.max(0, s.savingsBalance - existingAllocated);
      const seedAmount = Math.min(unallocated, goal.targetAmount);
      return {
        ...s,
        savingsGoals: [...s.savingsGoals, { ...goal, id: Date.now().toString(), savedAmount: seedAmount }],
      };
    });
  }, []);

  const editSavingsGoal = useCallback((id: string, updates: Partial<SavingsGoal>) => {
    setState((s) => ({
      ...s,
      savingsGoals: s.savingsGoals.map((g) => g.id === id ? { ...g, ...updates } : g),
    }));
  }, []);

  const deleteSavingsGoal = useCallback((id: string) => {
    setState((s) => ({ ...s, savingsGoals: s.savingsGoals.filter((g) => g.id !== id) }));
  }, []);

  const addMoneyToGoal = useCallback((goalId: string, amount: number) => {
    setState((s) => {
      if (s.walletBalance < amount) return s;
      const tx: Transaction = {
        id: Date.now().toString(),
        title: "Moved to Savings",
        amount: -amount,
        type: "savings",
        status: "completed",
        date: new Date().toLocaleDateString("en-NG"),
        goalName: s.savingsGoals.find((g) => g.id === goalId)?.name,
      };
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
    setState((s) => ({ ...s, bankDetails: details }));
  }, []);

  const applyTrustEvent = useCallback((event: keyof typeof TRUST_DELTAS) => {
    setState((s) => ({ ...s, trustScore: Math.max(0, Math.min(100, s.trustScore + TRUST_DELTAS[event])) }));
  }, []);

  return (
    <AppContext.Provider value={{
      ...state, login, signup, signupClient, logout, setRole, completeTask, setSavingsPreference,
      completeProfile, withdraw, addSavingsGoal, editSavingsGoal, deleteSavingsGoal, addMoneyToGoal,
      setBankDetails, processVerifications, applyTrustEvent,
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
