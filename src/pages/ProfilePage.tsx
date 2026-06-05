import { User, Mail, Shield, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { useApp, trustLevel } from "@/context/AppContext";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, profileCompleted, profile, trustScore, logout } = useApp();
  const level = trustLevel(trustScore);
  const levelColor = level === "Trusted" ? "text-success bg-success/10" : level === "Good" ? "text-primary bg-primary/10" : level === "Under Review" ? "text-warning bg-warning/10" : "text-destructive bg-destructive/10";

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <AppHeader />
      <main className="flex-1 px-4 pt-6 space-y-4">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <User className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-lg font-bold text-foreground">{user?.firstName} {user?.lastName}</h1>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" />{user?.email}
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-xs text-muted-foreground">Trust Score</p>
            <p className="text-xl font-bold text-foreground">{trustScore}</p>
            <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${levelColor}`}>{level}</span>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-xs text-muted-foreground">Profile</p>
            <p className="text-sm font-semibold text-foreground">{profileCompleted ? "Complete" : "Incomplete"}</p>
          </div>
        </div>

        {profile && (
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <p className="text-sm font-semibold text-foreground">Profile Details</p>
            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
              <div><span className="block font-medium text-foreground">Gender</span>{profile.gender}</div>
              <div><span className="block font-medium text-foreground">DOB</span>{profile.dob}</div>
              <div><span className="block font-medium text-foreground">State</span>{profile.state}</div>
            </div>
          </div>
        )}

        {!profileCompleted && (
          <Button variant="outline" className="w-full" onClick={() => navigate("/profile-setup")}>
            Complete Profile
          </Button>
        )}

        <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-xs text-muted-foreground">Your data is encrypted and secure</span>
        </div>

        <Button variant="ghost" className="w-full text-destructive" onClick={() => { logout(); navigate("/"); }}>
          <LogOut className="h-4 w-4" /> Log Out
        </Button>
      </main>
      <BottomNav />
    </div>
  );
}
