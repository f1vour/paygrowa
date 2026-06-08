import { ReactNode } from "react";

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    live: "bg-success/10 text-success",
    active: "bg-success/10 text-success",
    paid: "bg-success/10 text-success",
    approved: "bg-success/10 text-success",
    passed: "bg-success/10 text-success",
    completed: "bg-success/10 text-success",
    draft: "bg-muted text-muted-foreground",
    paused: "bg-warning/10 text-warning",
    pending: "bg-warning/10 text-warning",
    verifying: "bg-warning/10 text-warning",
    flagged: "bg-warning/10 text-warning",
    "under review": "bg-warning/10 text-warning",
    closed: "bg-muted text-muted-foreground",
    suspended: "bg-destructive/10 text-destructive",
    rejected: "bg-destructive/10 text-destructive",
    failed: "bg-destructive/10 text-destructive",
  };
  const cls = map[status.toLowerCase()] || "bg-muted text-muted-foreground";
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${cls}`}>
      {status}
    </span>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
    </div>
  );
}

export function KpiCard({ label, value, sub, accent = "primary" }: { label: string; value: string | number; sub?: string; accent?: "primary" | "secondary" | "tertiary" | "warning" }) {
  const accentMap = {
    primary: "text-primary",
    secondary: "text-secondary",
    tertiary: "text-tertiary",
    warning: "text-warning",
  };
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-2 text-2xl font-extrabold ${accentMap[accent]}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
