import React, { createContext, useContext, useState, useCallback } from "react";

export type ProjectStatus = "Draft" | "Under Review" | "Approved" | "Live" | "Paused" | "Completed" | "Rejected";
export type ProjectType = "Survey" | "Community Reporting";

export interface ProjectQuestion { id: string; text: string; type: "single" | "multiple" | "text"; options?: string[]; }

export interface ClientProject {
  id: string;
  title: string;
  objective: string;
  description: string;
  type: ProjectType;
  country: string;
  state: string;
  language: string;
  ageRange: string;
  gender: string;
  responsesRequired: number;
  estimatedMinutes: number;
  rewardPerResponse: number;
  deadline: string;
  status: ProjectStatus;
  createdAt: string;
  questions: ProjectQuestion[];
  reporting?: { objective: string; requiredPhotos: number; gpsRequired: boolean; observations: string; notes: string };
  responsesCollected: number;
  budgetUsed: number;
}

interface ClientContextType {
  projects: ClientProject[];
  createProject: (p: Omit<ClientProject, "id" | "createdAt" | "status" | "responsesCollected" | "budgetUsed"> & { status?: ProjectStatus }) => string;
  updateProject: (id: string, updates: Partial<ClientProject>) => void;
  setProjectStatus: (id: string, status: ProjectStatus) => void;
  deleteProject: (id: string) => void;
}

const ClientContext = createContext<ClientContextType | null>(null);

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<ClientProject[]>([]);

  const createProject = useCallback((p: any) => {
    const id = "pj_" + Date.now();
    setProjects((prev) => [{
      ...p, id, createdAt: new Date().toLocaleDateString("en-NG"),
      status: p.status || "Draft", responsesCollected: 0, budgetUsed: 0,
    }, ...prev]);
    return id;
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<ClientProject>) => {
    setProjects((prev) => prev.map((p) => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const setProjectStatus = useCallback((id: string, status: ProjectStatus) => {
    setProjects((prev) => prev.map((p) => p.id === id ? { ...p, status } : p));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <ClientContext.Provider value={{ projects, createProject, updateProject, setProjectStatus, deleteProject }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClient() {
  const ctx = useContext(ClientContext);
  if (!ctx) throw new Error("useClient must be used within ClientProvider");
  return ctx;
}
