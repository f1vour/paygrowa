import React, { createContext, useContext, useState, useCallback } from "react";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "task" | "savings" | "withdrawal";
  status: "earning" | "verifying" | "paid" | "completed";
  date: string;
  bankName?: string;
  goalName?: string;
  verifyAt?: number; // timestamp when verification completes
}

export interface SavingsGoal {
  id: string;
  name: string;
  category: string;
  targetAmount: number;
  savedAmount: number;
  timeframe: "weekly" | "monthly" | null;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

interface AppState {
  isLoggedIn: boolean;
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
  logout: () => void;
  completeTask: (title: string, amount: number) => void;
  setSavingsPreference: (pct: number | null) => void;
  completeProfile: (gender: string, dob: string, state: string) => void;
  withdraw: (amount: number) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, "id" | "savedAmount">) => void;
  editSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  addMoneyToGoal: (goalId: string, amount: number) => void;
  setBankDetails: (details: BankDetails) => void;
  processVerifications: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const VERIFY_DURATION = 20 * 60 * 1000; // 20 minutes

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    isLoggedIn: false,
    user: null,
    walletBalance: 0,
    savingsBalance: 0,
    savingsPercentage: null,
    trustScore: 0,
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
    setState((s) => ({ ...s, isLoggedIn: true, user: { firstName, lastName, email } }));
  }, []);

  const logout = useCallback(() => {
    setState((s) => ({ ...s, isLoggedIn: false }));
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
        trustScore: s.trustScore + 5,
        transactions: [tx, ...s.transactions],
      };
    });
  }, []);

  const processVerifications = useCallback(() => {
    setState((s) => {
      const now = Date.now();
      let balanceAdd = 0;
      let savingsAdd = 0;
      const updatedTx = s.transactions.map((tx) => {
        if (tx.status === "verifying" && tx.verifyAt && now >= tx.verifyAt) {
          const savingsDeduction = s.savingsPercentage ? (tx.amount * s.savingsPercentage) / 100 : 0;
          balanceAdd += tx.amount - savingsDeduction;
          savingsAdd += savingsDeduction;
          return { ...tx, status: "paid" as const };
        }
        return tx;
      });
      if (balanceAdd === 0 && savingsAdd === 0) return s;
      return {
        ...s,
        walletBalance: s.walletBalance + balanceAdd,
        savingsBalance: s.savingsBalance + savingsAdd,
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
    setState((s) => ({
      ...s,
      walletBalance: Math.max(0, s.walletBalance - amount),
      transactions: [
        { id: Date.now().toString(), title: "Withdrawal", amount: -amount, type: "withdrawal", status: "completed", date: new Date().toLocaleDateString("en-NG"), bankName: s.bankDetails?.bankName },
        ...s.transactions,
      ],
    }));
  }, []);

  const addSavingsGoal = useCallback((goal: Omit<SavingsGoal, "id" | "savedAmount">) => {
    setState((s) => ({
      ...s,
      savingsGoals: [...s.savingsGoals, { ...goal, id: Date.now().toString(), savedAmount: 0 }],
    }));
  }, []);

  const editSavingsGoal = useCallback((id: string, updates: Partial<SavingsGoal>) => {
    setState((s) => ({
      ...s,
      savingsGoals: s.savingsGoals.map((g) => g.id === id ? { ...g, ...updates } : g),
    }));
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

  return (
    <AppContext.Provider value={{
      ...state, login, signup, logout, completeTask, setSavingsPreference,
      completeProfile, withdraw, addSavingsGoal, editSavingsGoal, addMoneyToGoal,
      setBankDetails, processVerifications,
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
