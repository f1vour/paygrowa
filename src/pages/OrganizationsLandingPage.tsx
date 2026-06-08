import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, FlaskConical, GraduationCap, Landmark, Briefcase, HeartHandshake, ClipboardList, MapPin, FileSpreadsheet, Target, Filter, Languages, LineChart, ShieldCheck, CheckCircle, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PayGrowaLogo from "@/components/PayGrowaLogo";

const SERVED = [
  { icon: HeartHandshake, label: "NGOs & Development Organizations" },
  { icon: FlaskConical, label: "Research Institutions" },
  { icon: GraduationCap, label: "Universities" },
  { icon: Landmark, label: "Government Agencies" },
  { icon: Briefcase, label: "Businesses & Brands" },
  { icon: Building2, label: "Development Partners" },
];

const CAPABILITIES = [
  { icon: ClipboardList, title: "Survey Research", items: ["Consumer insights", "Academic studies", "Opinion polling"] },
  { icon: MapPin, title: "Community Reporting", items: ["Environmental monitoring", "Infrastructure assessments", "Local observations"] },
  { icon: FileSpreadsheet, title: "Field Data Collection", items: ["Community surveys", "Location-specific reporting", "Evidence gathering"] },
];

const STEPS = [
  "Create Organization Account",
  "Create Project",
  "Select Target Audience",
  "Submit For Review",
  "Project Goes Live",
  "Receive Verified Responses",
  "Export Results",
];

const FEATURES = [
  { icon: Target, label: "Audience targeting" },
  { icon: MapPin, label: "Location filtering" },
  { icon: Languages, label: "Language targeting" },
  { icon: LineChart, label: "Real-time project tracking" },
  { icon: ShieldCheck, label: "Submission review" },
  { icon: FileSpreadsheet, label: "CSV export" },
  { icon: FileSpreadsheet, label: "Excel export" },
  { icon: LineChart, label: "Analytics dashboard" },
];

export default function OrganizationsLandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top Nav */}
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <PayGrowaLogo size="md" />
          <nav className="hidden items-center gap-6 lg:flex">
            <button onClick={() => navigate("/")} className="text-sm text-muted-foreground hover:text-foreground">Home</button>
            <button onClick={() => navigate("/signup")} className="text-sm text-muted-foreground hover:text-foreground">For Contributors</button>
            <button className="text-sm font-medium text-foreground">For Organizations</button>
            <button onClick={() => navigate("/organization/login")} className="text-sm font-medium text-foreground hover:text-primary">Sign In</button>
            <Button size="sm" onClick={() => navigate("/organization/signup")}>Get Started</Button>
          </nav>
          <button className="lg:hidden rounded-lg border border-border bg-card p-2" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
          <div className="absolute right-0 top-0 h-full w-72 bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <PayGrowaLogo size="sm" clickable={false} />
              <button onClick={() => setMenuOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <nav className="flex flex-col gap-1">
              <button onClick={() => { setMenuOpen(false); navigate("/"); }} className="rounded-lg px-3 py-2.5 text-left text-sm hover:bg-muted">Home</button>
              <button onClick={() => { setMenuOpen(false); navigate("/signup"); }} className="rounded-lg px-3 py-2.5 text-left text-sm hover:bg-muted">For Contributors</button>
              <button className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-primary bg-primary/5">For Organizations</button>
              <button onClick={() => { setMenuOpen(false); navigate("/organization/login"); }} className="rounded-lg px-3 py-2.5 text-left text-sm hover:bg-muted">Sign In</button>
              <Button className="mt-2" onClick={() => { setMenuOpen(false); navigate("/organization/signup"); }}>Get Started</Button>
            </nav>
          </div>
        </div>
      )}

      <main className="flex-1">
        {/* Hero */}
        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-5xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Building2 className="h-3 w-3" /> For Organizations
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
              Collect Reliable Community Data Across Nigeria
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
              Launch surveys, community reporting projects, research studies, and local data collection campaigns through PayGrowa's contributor network.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" onClick={() => navigate("/organization/signup")}>Create Organization Account</Button>
              <Button size="lg" variant="outline">Book a Demo</Button>
            </div>
          </div>
        </section>

        {/* Who we serve */}
        <section className="bg-muted/40 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-bold text-foreground">Who We Serve</h2>
            <div className="mx-auto mt-2 mb-10 h-1 w-10 rounded-full bg-secondary" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SERVED.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5">
                  <div className="rounded-xl bg-primary/10 p-2.5"><Icon className="h-5 w-5 text-primary" /></div>
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What you can do */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-bold text-foreground">What You Can Do</h2>
            <div className="mx-auto mt-2 mb-10 h-1 w-10 rounded-full bg-secondary" />
            <div className="grid gap-5 md:grid-cols-3">
              {CAPABILITIES.map(({ icon: Icon, title, items }, i) => (
                <div key={title} className="rounded-2xl border border-border bg-card p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">{i + 1}</div>
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">{title}</h3>
                  <ul className="mt-3 space-y-2">
                    {items.map((it) => (
                      <li key={it} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-3.5 w-3.5 text-success" /> {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-muted/40 px-6 py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-bold text-foreground">How It Works</h2>
            <div className="mx-auto mt-2 mb-10 h-1 w-10 rounded-full bg-secondary" />
            <div className="space-y-3">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</div>
                  <div className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground">{s}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-bold text-foreground">Features</h2>
            <div className="mx-auto mt-2 mb-10 h-1 w-10 rounded-full bg-secondary" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-3xl rounded-2xl bg-primary p-10 text-center">
            <h2 className="text-2xl font-bold text-primary-foreground md:text-3xl">Ready to launch your project?</h2>
            <Button size="xl" variant="secondary" className="mt-6 rounded-full px-10" onClick={() => navigate("/organization/signup")}>
              Create Organization Account <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} PayGrowa Technologies Ltd.
      </footer>
    </div>
  );
}
