import React, { createContext, useContext, useState, useCallback } from "react";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  status: "earned" | "verifying" | "paid";
  date: string;
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
}

interface AppContextType extends AppState {
  login: (email: string) => void;
  signup: (firstName: string, lastName: string, email: string) => void;
  logout: () => void;
  completeTask: (title: string, amount: number) => void;
  setSavingsPreference: (pct: number | null) => void;
  completeProfile: (gender: string, dob: string, state: string) => void;
  withdraw: (amount: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

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
      const savingsDeduction = s.savingsPercentage ? (amount * s.savingsPercentage) / 100 : 0;
      const tx: Transaction = {
        id: Date.now().toString(),
        title,
        amount,
        status: "verifying",
        date: new Date().toLocaleDateString("en-NG"),
      };
      return {
        ...s,
        walletBalance: s.walletBalance + amount - savingsDeduction,
        savingsBalance: s.savingsBalance + savingsDeduction,
        trustScore: s.trustScore + 5,
        transactions: [tx, ...s.transactions],
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
        { id: Date.now().toString(), title: "Withdrawal", amount: -amount, status: "verifying", date: new Date().toLocaleDateString("en-NG") },
        ...s.transactions,
      ],
    }));
  }, []);

  return (
    <AppContext.Provider value={{ ...state, login, signup, logout, completeTask, setSavingsPreference, completeProfile, withdraw }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
