import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

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

export type OrgStatus = "Not Submitted" | "Pending Verification" | "Verified Organization" | "Rejected";

export interface OrgProfile {
  id: string;
  organizationName: string;
  organizationType: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  status: OrgStatus;
}

export interface OrgPayment {
  id: string;
  date: string;
  description: string;
  amount: number;
  method: string;
  status: "Paid" | "Pending" | "Failed";
  invoiceNo: string;
}

interface OrgData {
  profile: OrgProfile;
  projects: ClientProject[];
  payments: OrgPayment[];
}

const today = (offsetDays = 0) => {
  const d = new Date(); d.setDate(d.getDate() + offsetDays);
  return d.toLocaleDateString("en-NG");
};

const q = (text: string, type: ProjectQuestion["type"] = "single", options?: string[]): ProjectQuestion => ({
  id: "q_" + Math.random().toString(36).slice(2, 8), text, type, options,
});

const MOCK_ORGS: Record<string, OrgData> = {
  org_greenfield: {
    profile: {
      id: "org_greenfield", organizationName: "Greenfield NGO", organizationType: "NGO / Non-Profit",
      contactPerson: "Adaeze Okonkwo", email: "adaeze@greenfield.ng", phone: "+234 803 555 0142",
      country: "Nigeria", status: "Verified Organization",
    },
    projects: [
      {
        id: "pj_gf_1", title: "Waste Management Audit – Lagos", objective: "Assess household waste disposal habits",
        description: "Multi-LGA survey on disposal frequency and access to collection services.",
        type: "Survey", country: "Nigeria", state: "Lagos", language: "English",
        ageRange: "18-45", gender: "Any", responsesRequired: 500, estimatedMinutes: 6,
        rewardPerResponse: 450, deadline: today(14), status: "Live", createdAt: today(-21),
        questions: [q("How often is waste collected?", "single", ["Daily", "Weekly", "Rarely", "Never"])],
        responsesCollected: 312, budgetUsed: 161460,
      },
      {
        id: "pj_gf_2", title: "Plastic Pollution Community Reporting", objective: "Geo-tagged plastic dumpsite reports",
        description: "Contributors capture photos and GPS of pollution hotspots.",
        type: "Community Reporting", country: "Nigeria", state: "Lagos", language: "English",
        ageRange: "18-55", gender: "Any", responsesRequired: 200, estimatedMinutes: 10,
        rewardPerResponse: 800, deadline: today(30), status: "Live", createdAt: today(-10),
        questions: [], reporting: { objective: "Identify dumpsites", requiredPhotos: 3, gpsRequired: true, observations: "Estimated pile size; nearby water bodies", notes: "" },
        responsesCollected: 84, budgetUsed: 77280,
      },
      {
        id: "pj_gf_3", title: "Climate Awareness Baseline Survey", objective: "Awareness levels across age groups",
        description: "5-minute survey on climate change knowledge.",
        type: "Survey", country: "Nigeria", state: "Lagos", language: "English",
        ageRange: "18-65", gender: "Any", responsesRequired: 1000, estimatedMinutes: 5,
        rewardPerResponse: 400, deadline: today(-7), status: "Completed", createdAt: today(-60),
        questions: [], responsesCollected: 1000, budgetUsed: 460000,
      },
      {
        id: "pj_gf_4", title: "Recycling Behavior Study Q3", objective: "Behavior change tracking",
        description: "Follow-up wave to baseline study.",
        type: "Survey", country: "Nigeria", state: "Lagos", language: "English",
        ageRange: "18-45", gender: "Any", responsesRequired: 300, estimatedMinutes: 7,
        rewardPerResponse: 500, deadline: today(21), status: "Under Review", createdAt: today(-3),
        questions: [], responsesCollected: 0, budgetUsed: 0,
      },
    ],
    payments: [
      { id: "p1", date: today(-21), description: "Project funding – Waste Management Audit", amount: 258750, method: "Bank Transfer", status: "Paid", invoiceNo: "INV-2026-0411" },
      { id: "p2", date: today(-10), description: "Project funding – Plastic Pollution Reporting", amount: 184000, method: "Bank Transfer", status: "Paid", invoiceNo: "INV-2026-0438" },
      { id: "p3", date: today(-60), description: "Project funding – Climate Awareness Baseline", amount: 460000, method: "Card", status: "Paid", invoiceNo: "INV-2026-0312" },
      { id: "p4", date: today(-3), description: "Project funding – Recycling Behavior Q3", amount: 172500, method: "Bank Transfer", status: "Pending", invoiceNo: "INV-2026-0501" },
    ],
  },
  org_healthbridge: {
    profile: {
      id: "org_healthbridge", organizationName: "HealthBridge Research", organizationType: "Research Institute",
      contactPerson: "Dr. Tunde Adeyemi", email: "tunde@healthbridge.africa", phone: "+234 802 555 0177",
      country: "Nigeria", status: "Verified Organization",
    },
    projects: [
      {
        id: "pj_hb_1", title: "Maternal Health Access Survey", objective: "ANC access in rural LGAs",
        description: "Survey women 18-45 on antenatal care access.",
        type: "Survey", country: "Nigeria", state: "Kano", language: "Hausa",
        ageRange: "18-45", gender: "Female", responsesRequired: 800, estimatedMinutes: 8,
        rewardPerResponse: 600, deadline: today(20), status: "Live", createdAt: today(-15),
        questions: [], responsesCollected: 421, budgetUsed: 252600,
      },
      {
        id: "pj_hb_2", title: "Malaria Net Distribution Verification", objective: "Verify net distribution in PHCs",
        description: "Photo + GPS verification of nets at distribution centers.",
        type: "Community Reporting", country: "Nigeria", state: "Kano", language: "Hausa",
        ageRange: "18-65", gender: "Any", responsesRequired: 150, estimatedMinutes: 12,
        rewardPerResponse: 900, deadline: today(10), status: "Live", createdAt: today(-8),
        questions: [], reporting: { objective: "Verify nets", requiredPhotos: 4, gpsRequired: true, observations: "Quantity visible; date label", notes: "" },
        responsesCollected: 67, budgetUsed: 69345,
      },
      {
        id: "pj_hb_3", title: "Adolescent Nutrition Pilot", objective: "Nutrition habits of 13-17", description: "Pilot wave.",
        type: "Survey", country: "Nigeria", state: "Kano", language: "English",
        ageRange: "13-17", gender: "Any", responsesRequired: 200, estimatedMinutes: 6,
        rewardPerResponse: 350, deadline: today(45), status: "Draft", createdAt: today(-2),
        questions: [], responsesCollected: 0, budgetUsed: 0,
      },
    ],
    payments: [
      { id: "p1", date: today(-15), description: "Project funding – Maternal Health Access", amount: 552000, method: "Bank Transfer", status: "Paid", invoiceNo: "INV-2026-0420" },
      { id: "p2", date: today(-8), description: "Project funding – Malaria Net Verification", amount: 155250, method: "Bank Transfer", status: "Paid", invoiceNo: "INV-2026-0455" },
    ],
  },
  org_civicpulse: {
    profile: {
      id: "org_civicpulse", organizationName: "CivicPulse Initiative", organizationType: "NGO / Non-Profit",
      contactPerson: "Ngozi Eze", email: "ngozi@civicpulse.org", phone: "+234 805 555 0193",
      country: "Nigeria", status: "Pending Verification",
    },
    projects: [
      {
        id: "pj_cp_1", title: "Road Infrastructure Reporting – FCT", objective: "Map bad roads",
        description: "GPS-tagged photo reports of road defects.",
        type: "Community Reporting", country: "Nigeria", state: "FCT", language: "English",
        ageRange: "18-65", gender: "Any", responsesRequired: 250, estimatedMinutes: 10,
        rewardPerResponse: 700, deadline: today(25), status: "Paused", createdAt: today(-30),
        questions: [], reporting: { objective: "Document road defects", requiredPhotos: 3, gpsRequired: true, observations: "Pothole size; traffic impact", notes: "" },
        responsesCollected: 138, budgetUsed: 111090,
      },
      {
        id: "pj_cp_2", title: "Voter Education Awareness Survey", objective: "Election awareness baseline",
        description: "5-min survey across 6 states.",
        type: "Survey", country: "Nigeria", state: "FCT", language: "English",
        ageRange: "18-65", gender: "Any", responsesRequired: 1500, estimatedMinutes: 5,
        rewardPerResponse: 400, deadline: today(40), status: "Under Review", createdAt: today(-5),
        questions: [], responsesCollected: 0, budgetUsed: 0,
      },
    ],
    payments: [
      { id: "p1", date: today(-30), description: "Project funding – Road Infrastructure Reporting", amount: 201250, method: "Bank Transfer", status: "Paid", invoiceNo: "INV-2026-0288" },
      { id: "p2", date: today(-5), description: "Project funding – Voter Education", amount: 690000, method: "Card", status: "Failed", invoiceNo: "INV-2026-0492" },
    ],
  },
  org_agritrust: {
    profile: {
      id: "org_agritrust", organizationName: "AgriTrust Africa", organizationType: "Private Business",
      contactPerson: "Emeka Nwosu", email: "emeka@agritrust.africa", phone: "+234 807 555 0210",
      country: "Nigeria", status: "Verified Organization",
    },
    projects: [
      {
        id: "pj_at_1", title: "Smallholder Farmer Yield Survey", objective: "Yield reporting Q2",
        description: "Survey 600 smallholder farmers on yields and inputs.",
        type: "Survey", country: "Nigeria", state: "Kaduna", language: "Hausa",
        ageRange: "25-65", gender: "Any", responsesRequired: 600, estimatedMinutes: 9,
        rewardPerResponse: 550, deadline: today(18), status: "Live", createdAt: today(-12),
        questions: [], responsesCollected: 389, budgetUsed: 213950,
      },
      {
        id: "pj_at_2", title: "Fertilizer Distribution Verification", objective: "Audit subsidy program",
        description: "Photo + GPS verification of fertilizer pickup points.",
        type: "Community Reporting", country: "Nigeria", state: "Kaduna", language: "Hausa",
        ageRange: "18-65", gender: "Any", responsesRequired: 180, estimatedMinutes: 12,
        rewardPerResponse: 950, deadline: today(22), status: "Live", createdAt: today(-9),
        questions: [], reporting: { objective: "Verify fertilizer", requiredPhotos: 3, gpsRequired: true, observations: "Bag count; brand", notes: "" },
        responsesCollected: 92, budgetUsed: 100510,
      },
      {
        id: "pj_at_3", title: "Crop Disease Reporting – Yam", objective: "Map disease outbreaks",
        description: "Farmers report observed crop diseases.",
        type: "Community Reporting", country: "Nigeria", state: "Benue", language: "English",
        ageRange: "25-65", gender: "Any", responsesRequired: 120, estimatedMinutes: 10,
        rewardPerResponse: 800, deadline: today(-2), status: "Completed", createdAt: today(-45),
        questions: [], reporting: { objective: "Disease mapping", requiredPhotos: 2, gpsRequired: true, observations: "Symptoms; field size", notes: "" },
        responsesCollected: 120, budgetUsed: 110400,
      },
      {
        id: "pj_at_4", title: "Market Price Tracking – Maize", objective: "Weekly price tracking",
        description: "Recurring price snapshot from local markets.",
        type: "Community Reporting", country: "Nigeria", state: "Kaduna", language: "Hausa",
        ageRange: "18-65", gender: "Any", responsesRequired: 400, estimatedMinutes: 4,
        rewardPerResponse: 300, deadline: today(60), status: "Draft", createdAt: today(-1),
        questions: [], responsesCollected: 0, budgetUsed: 0,
      },
    ],
    payments: [
      { id: "p1", date: today(-12), description: "Project funding – Yield Survey", amount: 379500, method: "Bank Transfer", status: "Paid", invoiceNo: "INV-2026-0431" },
      { id: "p2", date: today(-9), description: "Project funding – Fertilizer Verification", amount: 196650, method: "Bank Transfer", status: "Paid", invoiceNo: "INV-2026-0447" },
      { id: "p3", date: today(-45), description: "Project funding – Crop Disease Reporting", amount: 110400, method: "Card", status: "Paid", invoiceNo: "INV-2026-0356" },
    ],
  },
};

interface ClientContextType {
  organizations: OrgProfile[];
  currentOrgId: string;
  setCurrentOrgId: (id: string) => void;
  currentOrg: OrgProfile;
  projects: ClientProject[];
  payments: OrgPayment[];
  createProject: (p: Omit<ClientProject, "id" | "createdAt" | "status" | "responsesCollected" | "budgetUsed"> & { status?: ProjectStatus }) => string;
  updateProject: (id: string, updates: Partial<ClientProject>) => void;
  setProjectStatus: (id: string, status: ProjectStatus) => void;
  deleteProject: (id: string) => void;
  updateOrgProfile: (updates: Partial<OrgProfile>) => void;
}

const ClientContext = createContext<ClientContextType | null>(null);

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [orgs, setOrgs] = useState<Record<string, OrgData>>(MOCK_ORGS);
  const [currentOrgId, setCurrentOrgId] = useState<string>("org_greenfield");

  const current = orgs[currentOrgId];
  const organizations = useMemo(() => Object.values(orgs).map((o) => o.profile), [orgs]);

  const mutateOrg = useCallback((fn: (o: OrgData) => OrgData) => {
    setOrgs((prev) => ({ ...prev, [currentOrgId]: fn(prev[currentOrgId]) }));
  }, [currentOrgId]);

  const createProject = useCallback((p: any) => {
    const id = "pj_" + Date.now();
    mutateOrg((o) => ({
      ...o,
      projects: [{ ...p, id, createdAt: new Date().toLocaleDateString("en-NG"), status: p.status || "Draft", responsesCollected: 0, budgetUsed: 0 }, ...o.projects],
    }));
    return id;
  }, [mutateOrg]);

  const updateProject = useCallback((id: string, updates: Partial<ClientProject>) => {
    mutateOrg((o) => ({ ...o, projects: o.projects.map((p) => p.id === id ? { ...p, ...updates } : p) }));
  }, [mutateOrg]);

  const setProjectStatus = useCallback((id: string, status: ProjectStatus) => {
    mutateOrg((o) => ({ ...o, projects: o.projects.map((p) => p.id === id ? { ...p, status } : p) }));
  }, [mutateOrg]);

  const deleteProject = useCallback((id: string) => {
    mutateOrg((o) => ({ ...o, projects: o.projects.filter((p) => p.id !== id) }));
  }, [mutateOrg]);

  const updateOrgProfile = useCallback((updates: Partial<OrgProfile>) => {
    mutateOrg((o) => ({ ...o, profile: { ...o.profile, ...updates } }));
  }, [mutateOrg]);

  return (
    <ClientContext.Provider value={{
      organizations, currentOrgId, setCurrentOrgId,
      currentOrg: current.profile,
      projects: current.projects,
      payments: current.payments,
      createProject, updateProject, setProjectStatus, deleteProject, updateOrgProfile,
    }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClient() {
  const ctx = useContext(ClientContext);
  if (!ctx) throw new Error("useClient must be used within ClientProvider");
  return ctx;
}
