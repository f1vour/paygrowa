import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderKanban, Plus, BarChart3, Wallet, User, LogOut, Menu, X, Building2 } from "lucide-react";
import { useState } from "react";
import PayGrowaLogo from "@/components/PayGrowaLogo";
import { useApp } from "@/context/AppContext";
import { useClient } from "@/context/ClientContext";

const navItems = [
  { to: "/organization/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/organization/projects", icon: FolderKanban, label: "Projects" },
  { to: "/organization/create", icon: Plus, label: "Create Project" },
  { to: "/organization/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/organization/payments", icon: Wallet, label: "Payments" },
  { to: "/organization/profile", icon: User, label: "Profile" },
];

export default function ClientLayout() {
  const navigate = useNavigate();
  const { user, logout } = useApp();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/organization/login"); };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden md:flex w-60 flex-col border-r border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <PayGrowaLogo size="md" clickable={false} />
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Organization Portal</p>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              <Icon className="h-4 w-4" /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card px-4 py-3 md:px-6">
          <div className="flex items-center gap-3 md:hidden">
            <button onClick={() => setOpen(true)} aria-label="Menu" className="rounded-lg border border-border p-2"><Menu className="h-5 w-5" /></button>
            <PayGrowaLogo size="sm" clickable={false} />
          </div>
          <div className="hidden md:block" />
          <div className="text-xs text-muted-foreground hidden md:block">
            {user?.lastName /* org name */} · {user?.email}
          </div>
        </header>

        {open && (
          <div className="fixed inset-0 z-50 md:hidden" onClick={() => setOpen(false)}>
            <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
            <div className="absolute left-0 top-0 h-full w-72 bg-card p-5" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between">
                <PayGrowaLogo size="sm" clickable={false} />
                <button onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
              </div>
              <nav className="space-y-1">
                {navItems.map(({ to, icon: Icon, label }) => (
                  <NavLink key={to} to={to} onClick={() => setOpen(false)}
                    className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}>
                    <Icon className="h-4 w-4" /> {label}
                  </NavLink>
                ))}
                <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-destructive hover:bg-muted">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </nav>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 md:p-6"><Outlet /></main>
      </div>
    </div>
  );
}
