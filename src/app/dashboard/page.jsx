import { getSession } from "@/lib/auth";
import { getDashboardStats, listAnalyses } from "@/services/analysis";
import { redirect } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import StatsCard from "@/components/StatsCard";
import RiskBadge from "@/components/RiskBadge";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  // Load stats and recent history entries
  const stats = await getDashboardStats(session.id);
  const recentAnalyses = await listAnalyses(session.id, 5);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <Sidebar />
      <div className="flex-1 space-y-8">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Security Dashboard</h2>
            <p className="text-muted-foreground">
              Overview of your link and message analysis runs.
            </p>
          </div>
          <div>
            <Link
              href="/analyze"
              className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 text-sm shadow-md transition-all inline-block text-center cursor-pointer"
            >
              Analyze Something Suspicious
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Analyses"
            value={stats.total}
            description="Total submissions evaluated"
            icon={<span className="text-xl">📊</span>}
          />
          <StatsCard
            title="High Risk"
            value={stats.high}
            description="Severe scam threats found"
            className="border-rose-500/20 bg-rose-500/5!"
            icon={<span className="text-xl">🚨</span>}
          />
          <StatsCard
            title="Medium Risk"
            value={stats.medium}
            description="Suspicious items identified"
            className="border-amber-500/20 bg-amber-500/5!"
            icon={<span className="text-xl">⚠️</span>}
          />
          <StatsCard
            title="Low Risk"
            value={stats.low}
            description="Safe or low risk items"
            className="border-emerald-500/20 bg-emerald-500/5!"
            icon={<span className="text-xl">✅</span>}
          />
        </div>

        {/* Recent Analyses Section */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-bold">Recent Evaluations</h3>
            <Link href="/history" className="text-xs text-blue-400 hover:underline">
              View full history →
            </Link>
          </div>

          {recentAnalyses.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground space-y-4">
              <p className="text-sm">No analyses run yet. Copy/paste suspicious content to check for scams.</p>
              <Link
                href="/analyze"
                className="text-sm text-blue-400 hover:underline"
              >
                Analyze your first content entry
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold">
                    <th className="p-4">Type</th>
                    <th className="p-4">Input Snippet</th>
                    <th className="p-4">Risk Level</th>
                    <th className="p-4">Score</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentAnalyses.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 font-bold text-xs">{item.type}</td>
                      <td className="p-4 font-medium text-foreground/80 max-w-[200px] truncate">
                        {item.input}
                      </td>
                      <td className="p-4">
                        <RiskBadge level={item.risk_level} />
                      </td>
                      <td className="p-4 font-bold">{item.risk_score}</td>
                      <td className="p-4 text-muted-foreground">{item.category}</td>
                      <td className="p-4 text-muted-foreground text-xs">{formatDate(item.created_at)}</td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/history/${item.id}`}
                          className="rounded-md bg-muted hover:bg-zinc-800 text-foreground px-3 py-1.5 text-xs font-semibold transition-all inline-block"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
