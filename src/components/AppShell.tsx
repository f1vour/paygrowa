import { Outlet, NavLink } from "react-router-dom";
import { Home, Wallet, PiggyBank, User, Menu, LogOut, ListChecks } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import PayGrowaLogo from "@/components/PayGrowaLogo";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/savings", label: "Savings", icon: PiggyBank },
  { to: "/profile", label: "Profile", icon: User },
];

export default function AppShell() {
  const { logout } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-muted/40 md:flex md:justify-center">
      {/* Desktop/Tablet hamburger button */}
      <div className="hidden md:block fixed top-3 left-3 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <button aria-label="Open menu" className="rounded-lg border border-border bg-card p-2 shadow-sm hover:bg-muted">
              <Menu className="h-5 w-5 text-foreground" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="border-b border-border p-4">
              <PayGrowaLogo size="md" clickable={false} />
            </div>
            <nav className="space-y-1 p-2">
              {navItems.map(({ to, label, icon: Icon }) => (
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
              <button
                onClick={() => { logout(); navigate("/login"); }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile-style centered container */}
      <div className="w-full bg-background md:min-h-screen md:max-w-[460px] md:border-x md:border-border md:shadow-sm">
        <Outlet />
      </div>
    </div>
  );
}
