import { useState } from "react";
import { CheckCircle, ClipboardCheck, CreditCard, Shield, Building2, Search, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PayGrowaLogo from "@/components/PayGrowaLogo";
import heroPhone from "@/assets/hero-phone.jpg";

const NAV_LINKS: { label: string; to?: string; href?: string }[] = [
  { label: "Home", to: "/" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "For Contributors", to: "/signup" },
  { label: "For Organizations", to: "/organizations" },
  { label: "About Us", href: "#about" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (l: { to?: string; href?: string }) => {
    setMenuOpen(false);
    if (l.to) navigate(l.to);
    else if (l.href) {
      const el = document.querySelector(l.href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navigation */}
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <PayGrowaLogo size="md" />
          <nav className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((l) => (
              <button key={l.label} onClick={() => handleNav(l)} className="text-sm text-muted-foreground hover:text-foreground">
                {l.label}
              </button>
            ))}
            <button onClick={() => navigate("/login")} className="text-sm font-medium text-foreground hover:text-primary">Sign In</button>
            <Button size="sm" onClick={() => navigate("/signup")}>Get Started</Button>
          </nav>
          <button
            className="lg:hidden rounded-lg border border-border bg-card p-2 tap-scale"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
          <div className="absolute right-0 top-0 h-full w-72 bg-card shadow-xl p-5 animate-slide-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <PayGrowaLogo size="sm" clickable={false} />
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="rounded-lg p-2 hover:bg-muted">
                <X className="h-5 w-5 text-foreground" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <button key={l.label} onClick={() => handleNav(l)} className="rounded-lg px-3 py-2.5 text-left text-sm text-foreground hover:bg-muted">
                  {l.label}
                </button>
              ))}
              <div className="my-2 h-px bg-border" />
              <button onClick={() => { setMenuOpen(false); navigate("/login"); }} className="rounded-lg px-3 py-2.5 text-left text-sm text-foreground hover:bg-muted">
                Sign In
              </button>
              <Button className="mt-2" onClick={() => { setMenuOpen(false); navigate("/signup"); }}>Get Started</Button>
            </nav>
          </div>
        </div>
      )}


      <main className="flex flex-1 flex-col">
        {/* Hero Section - desktop: side by side, mobile: stacked */}
        <section className="px-6 py-12 md:py-20">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:gap-12">
            {/* Left text */}
            <div className="flex-1">
              <h1 className="mb-4 text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
                Earn money by completing simple tasks
              </h1>
              <p className="mb-8 max-w-lg text-base text-muted-foreground md:text-lg">
                Join thousands of Nigerians turning their spare time into consistent digital earnings. Fast payments, verified tasks, and absolute transparency.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" variant="hero" onClick={() => navigate("/signup")}>Get Started</Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/signup")}>Learn More</Button>
              </div>
            </div>
            {/* Right image */}
            <div className="relative flex-1 max-w-lg">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={heroPhone}
                  alt="Person earning money on their smartphone with PayGrowa"
                  className="w-full h-auto object-cover"
                  width={768}
                  height={512}
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-4 left-4 flex items-center gap-2.5 rounded-xl bg-card shadow-lg px-4 py-3 border border-border md:left-8">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/20">
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Last Task Paid</p>
                  <p className="text-sm font-bold text-foreground">₦4,500.00</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-primary px-6 py-6">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-around">
            {[
              { value: "₦12.5M+", label: "PAID OUT" },
              { value: "45,000+", label: "ACTIVE TASKERS" },
              { value: "98.2%", label: "SUCCESS RATE" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-xl font-extrabold text-primary-foreground md:text-2xl">{value}</p>
                <p className="text-xs text-primary-foreground/70">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="px-6 py-16 scroll-mt-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-2 text-2xl font-bold text-foreground text-center">Start earning in minutes</h2>
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-secondary" />
            <p className="mb-12 text-sm text-muted-foreground text-center max-w-md mx-auto">
              No complex skills required. Just a smartphone, an internet connection, and your time.
            </p>

            <div className="grid gap-8 sm:grid-cols-3">
              {[
                { icon: ClipboardCheck, title: "Choose a task", desc: "Browse through hundreds of available micro-tasks ranging from surveys to app testing." },
                { icon: CheckCircle, title: "Complete it", desc: "Follow the simple instructions provided for each task and submit your proof for review." },
                { icon: CreditCard, title: "Get paid", desc: "Once verified, your earnings are credited instantly to your digital wallet for withdrawal." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-2xl border border-border bg-card p-6 text-left">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-sm font-bold text-foreground">{title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Real earnings section */}
        <section id="about" className="bg-muted/50 px-6 py-16 scroll-mt-20">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-start">
            {/* Left */}
            <div className="flex-1">
              <h2 className="mb-6 text-2xl font-bold text-foreground">Real earnings, real impact</h2>
              <div className="space-y-5">
                {[
                  { icon: Shield, title: "Institutional Security", desc: "Your data and funds are protected by bank-grade encryption and secure authentication." },
                  { icon: Building2, title: "Direct bank transfers", desc: "Withdraw your hard-earned money directly to any Nigerian bank account in minutes." },
                  { icon: Search, title: "Transparent verification", desc: "Real-time tracking of task approval status with clear feedback on every submission." },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{title}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right - earner cards grid */}
            <div className="grid flex-1 grid-cols-2 gap-3">
              {[
                { name: "John D.", initials: "JD", amount: "₦12,400", color: "bg-primary" },
                { name: "Musa A.", initials: "MA", amount: "₦8,200", color: "bg-secondary" },
                { name: "Sarah K.", initials: "SK", amount: "₦15,800", color: "bg-tertiary" },
                { name: "Grace O.", initials: "GO", amount: "₦5,600", color: "bg-primary" },
              ].map(({ name, initials, amount, color }) => (
                <div key={name} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full ${color} text-[10px] font-bold text-white`}>{initials}</div>
                    <span className="text-xs font-medium text-foreground">{name}</span>
                  </div>
                  <p className="text-lg font-bold text-secondary">{amount}</p>
                  <p className="text-[10px] text-muted-foreground">Earned this week</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-2xl rounded-2xl bg-primary p-10 text-center">
            <h2 className="mb-3 text-2xl font-bold text-primary-foreground md:text-3xl">Ready to start earning?</h2>
            <p className="mb-6 text-sm text-primary-foreground/80">
              Join the 45,000+ active taskers today. Registration takes less than 2 minutes.
            </p>
            <Button size="xl" variant="secondary" className="rounded-full px-10" onClick={() => navigate("/signup")}>
              Create Free Account
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 px-6 py-10">
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-4">
          <div>
            <PayGrowaLogo size="md" />
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              Empowering the next generation of digital earners across Nigeria with reliable, safe micro-tasks.
            </p>
          </div>
          {[
            { title: "COMPANY", items: ["About Us", "Careers", "Our Blog", "Newsroom"] },
            { title: "LEGAL", items: ["Privacy Policy", "Terms of Service", "Security Policy", "Cookie Settings"] },
            { title: "SUPPORT", items: ["Help Center", "Contact Support", "Safety Guidelines", "System Status"] },
          ].map(({ title, items }) => (
            <div key={title}>
              <p className="mb-3 text-xs font-semibold text-foreground">{title}</p>
              <div className="space-y-2 text-xs text-muted-foreground">
                {items.map((item) => <p key={item} className="hover:text-foreground cursor-pointer">{item}</p>)}
              </div>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-8 flex max-w-6xl items-center justify-between border-t border-border pt-6">
          <p className="text-[10px] text-muted-foreground">© {new Date().getFullYear()} PayGrowa Technologies Ltd. All rights reserved.</p>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Shield className="h-3 w-3 text-success" />
            Secured by PayGrowa Shield™
          </div>
        </div>
      </footer>
    </div>
  );
}
