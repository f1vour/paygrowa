import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";
import PayGrowaLogo from "@/components/PayGrowaLogo";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border px-4 py-3">
        <PayGrowaLogo size="md" />
      </header>
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Compass className="h-6 w-6 text-primary" />
          </div>
          <h1 className="mb-2 text-xl font-bold text-foreground">Oops! Nothing found here</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            The page you're looking for is unavailable.
          </p>
          <Button size="lg" className="w-full" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}
