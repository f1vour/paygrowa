import { Trophy, Medal, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { useApp, trustLevel } from "@/context/AppContext";

const mockBoard = [
  { rank: 1, name: "Adeola O.", tasks: 412, score: 98 },
  { rank: 2, name: "Tunde A.", tasks: 387, score: 97 },
  { rank: 3, name: "Ngozi E.", tasks: 359, score: 96 },
  { rank: 4, name: "Ibrahim K.", tasks: 341, score: 94 },
  { rank: 5, name: "Funke B.", tasks: 320, score: 93 },
  { rank: 6, name: "Chinedu P.", tasks: 298, score: 91 },
  { rank: 7, name: "Aisha M.", tasks: 276, score: 89 },
  { rank: 8, name: "Kunle S.", tasks: 254, score: 87 },
  { rank: 9, name: "Bisi O.", tasks: 232, score: 85 },
  { rank: 10, name: "Emeka U.", tasks: 218, score: 83 },
];

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { trustScore, user } = useApp();
  const userRank = 47;
  const totalContributors = 2315;

  return (
    <div className="flex min-h-screen flex-col bg-background pb-24">
      <AppHeader />
      <main className="flex-1 px-4 pt-4 space-y-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-xs text-muted-foreground"><ArrowLeft className="h-3 w-3" /> Back</button>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-warning" />
          <h1 className="text-xl font-bold text-foreground">Leaderboard</h1>
        </div>
        <p className="text-xs text-muted-foreground">Top contributors this month</p>

        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-xs text-muted-foreground">Your Rank</p>
          <p className="text-2xl font-bold text-foreground">#{userRank} <span className="text-sm font-normal text-muted-foreground">of {totalContributors.toLocaleString()}</span></p>
          <p className="mt-1 text-xs text-muted-foreground">{user?.firstName} · {trustLevel(trustScore)} · {trustScore}/100</p>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
              <tr><th className="px-3 py-2">#</th><th className="px-3 py-2">Contributor</th><th className="px-3 py-2 text-right">Tasks</th><th className="px-3 py-2 text-right">Score</th></tr>
            </thead>
            <tbody>
              {mockBoard.map((row) => (
                <tr key={row.rank} className="border-t border-border">
                  <td className="px-3 py-2.5 font-semibold text-foreground">
                    {row.rank <= 3 ? <Medal className={`inline h-3.5 w-3.5 ${row.rank === 1 ? "text-warning" : row.rank === 2 ? "text-muted-foreground" : "text-tertiary"}`} /> : null} {row.rank}
                  </td>
                  <td className="px-3 py-2.5">
                    <p className="font-medium text-foreground">{row.name}</p>
                    <p className="text-[10px] text-muted-foreground">{trustLevel(row.score)}</p>
                  </td>
                  <td className="px-3 py-2.5 text-right text-muted-foreground">{row.tasks}</td>
                  <td className="px-3 py-2.5 text-right font-semibold text-foreground">{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
