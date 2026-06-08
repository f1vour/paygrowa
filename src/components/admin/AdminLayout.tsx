import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, ListChecks, Inbox, Wallet, Users, BarChart3, Settings, Bell, Search, LogOut, ChevronDown, FolderKanban } from "lucide-react";
import { useState } from "react";
import PayGrowaLogo from "@/components/PayGrowaLogo";
import { useApp } from "@/context/AppContext";
import { isAdminEmail } from "@/lib/adminAllowlist";

const navItems = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/projects", icon: FolderKanban, label: "Project Review" },
  { to: "/admin/tasks", icon: ListChecks, label: "Task Management" },
  { to: "/admin/submissions", icon: Inbox, label: "Submissions" },
  { to: "/admin/payments", icon: Wallet, label: "Payments" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);

  if (!isAdminEmail(user?.email)) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <PayGrowaLogo size="md" clickable={false} />
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Admin Panel</p>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card px-6 py-3">
          <div className="flex items-center gap-3 md:hidden">
            <PayGrowaLogo size="sm" clickable={false} />
          </div>
          <div className="relative flex-1 max-w-md ml-0 md:ml-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search tasks, users, submissions…"
              className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-lg p-2 hover:bg-muted">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
            </button>
            <div className="relative">
              <button onClick={() => setProfileOpen((v) => !v)} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {(user?.firstName?.[0] || "A").toUpperCase()}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-semibold text-foreground">{user?.firstName || "Admin"} {user?.lastName || ""}</p>
                  <p className="text-[10px] text-muted-foreground">{user?.email}</p>
                </div>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                  <button onClick={() => { setProfileOpen(false); navigate("/admin/settings"); }} className="block w-full px-3 py-2 text-left text-sm hover:bg-muted">Profile & Settings</button>
                  <button onClick={handleLogout} className="block w-full border-t border-border px-3 py-2 text-left text-sm text-destructive hover:bg-muted">Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
