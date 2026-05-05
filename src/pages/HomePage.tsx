import { Clock, Zap, Banknote, CheckCircle, ArrowRight, Users, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PayGrowaLogo from "@/components/PayGrowaLogo";
import heroPhone from "@/assets/hero-phone.jpg";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <PayGrowaLogo size="md" />
        <button onClick={() => navigate("/login")} className="text-sm font-medium text-primary tap-scale">
          Log In
        </button>
      </header>

      <main className="flex flex-1 flex-col">
        {/* Hero section with image background — matching reference */}
        <section className="relative px-6 pt-8 pb-6">
          {/* Badge */}
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Now Live in Emerging Markets
          </div>

          <h1 className="mb-3 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
            Earn money by completing simple tasks
          </h1>
          <p className="mb-6 max-w-sm text-base text-muted-foreground">
            Turn your spare time into extra income. Join thousands of users to complete micro-tasks and get paid directly to your local accounts.
          </p>

          <div className="flex w-full max-w-sm flex-col gap-3 mb-6">
            <Button size="xl" variant="hero" className="w-full" onClick={() => navigate("/signup")}>
              Get Started
            </Button>
            <Button size="lg" variant="hero-outline" className="w-full" onClick={() => navigate("/signup")}>
              Learn More
            </Button>
          </div>

          {/* Hero image with overlay card */}
          <div className="relative w-full overflow-hidden rounded-2xl">
            <img
              src={heroPhone}
              alt="Person earning money on their smartphone with PayGrowa"
              className="w-full h-56 object-cover"
              width={768}
              height={896}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
            {/* Floating earnings card */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-card/95 backdrop-blur-sm px-3 py-2 shadow-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-success/20">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Last Task Paid</p>
                <p className="text-sm font-bold text-success">₦2,500.00</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats row */}
        <section className="border-y border-border px-6 py-6">
          <div className="flex flex-col items-center gap-4">
            {[
              { value: "₦2.5M+", label: "PAID OUT TO USERS" },
              { value: "45,000+", label: "ACTIVE TASKERS" },
              { value: "98.2%", label: "SUCCESS RATE" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-xl font-extrabold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="px-6 py-8">
          <h2 className="mb-2 text-xl font-bold text-foreground text-center">Start earning in minutes</h2>
          <p className="mb-8 text-sm text-muted-foreground text-center">
            No complex skills required. Just a smartphone, an internet connection, and your time.
          </p>

          <div className="space-y-6">
            {[
              { icon: Zap, title: "Choose a task", desc: "Browse hundreds of available micro-tasks ranging from surveys to content moderation." },
              { icon: Clock, title: "Complete it", desc: "Follow simple instructions to finish the task. Most tasks take less than 5 minutes to complete." },
              { icon: Banknote, title: "Get paid", desc: "Once verified, funds are instantly credited to your PayGrowa wallet for withdrawal." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-1 text-sm font-bold text-foreground">{title}</h3>
                <p className="text-xs text-muted-foreground max-w-xs">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trust / Community section */}
        <section className="bg-primary/5 px-6 py-8">
          <h2 className="mb-2 text-lg font-bold text-foreground">Real earnings, real impact</h2>
          <p className="mb-5 text-sm text-muted-foreground">
            Join our community of earners who are building a better future, one task at a time. Secure, verified, and always on time.
          </p>

          <div className="space-y-3 mb-6">
            {[
              "Enterprise-grade security for all transactions",
              "Direct bank transfers to local banks",
              "Transparent task verification process",
            ].map((text) => (
              <div key={text} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0 text-success" />
                <span className="text-xs text-foreground">{text}</span>
              </div>
            ))}
          </div>

          {/* Earnings cards grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "John D.", amount: "₦1,200.00" },
              { name: "Musa A.", amount: "₦800.00" },
              { name: "Sarah K.", amount: "₦4,500.00" },
              { name: "Grace O.", amount: "₦2,100.00" },
            ].map(({ name, amount }) => (
              <div key={name} className="rounded-xl border border-border bg-card p-3">
                <p className="text-xs text-muted-foreground">{name} just earned</p>
                <p className="text-sm font-bold text-success">{amount}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA section */}
        <section className="px-6 py-8 text-center">
          <h2 className="mb-2 text-lg font-bold text-foreground">Ready to start earning?</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Create your free account today and browse thousands of available tasks. Your first payout could be minutes away.
          </p>
          <Button size="xl" variant="hero" className="w-full max-w-sm" onClick={() => navigate("/signup")}>
            Create Free Account
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-6">
        <div className="mb-4">
          <PayGrowaLogo size="md" />
        </div>
        <p className="mb-4 text-xs text-muted-foreground">
          The leading platform for micro-tasking in emerging markets. We bridge the gap between global digital labor and local talent.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
          <div>
            <p className="font-semibold text-foreground mb-2">COMPANY</p>
            <div className="space-y-1.5 text-muted-foreground">
              <p>About Us</p>
              <p>Contact Us</p>
              <p>Careers</p>
            </div>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-2">LEGAL</p>
            <div className="space-y-1.5 text-muted-foreground">
              <p>Privacy Policy</p>
              <p>Terms of Service</p>
              <p>Cookie Policy</p>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground text-center">
          © {new Date().getFullYear()} PayGrowa Technologies. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
