import { getSession } from "@/lib/auth";
import { getDashboardStats, listAnalyses } from "@/services/analysis";
import { redirect } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import StatsCard from "@/components/StatsCard";
import RiskBadge from "@/components/RiskBadge";
import { formatDate } from "@/lib/utils";
import { BarChart2, ShieldAlert, AlertTriangle, ShieldCheck, ArrowRight, Eye } from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const stats = await getDashboardStats(session.id);
  const recentAnalyses = await listAnalyses(session.id, 5);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <Sidebar />
      <div className="flex-1 space-y-8">
        
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 glass-card p-6 rounded-2xl border border-slate-800">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Security Overview</span>
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Monitor link and message evaluation metrics for account <strong className="text-slate-200">{session.email}</strong>.
            </p>
          </div>
          <div>
            <Link
              href="/analyze"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold px-4 py-2.5 text-xs shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <ShieldAlert className="h-4 w-4" />
              <span>Analyze New Content</span>
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatsCard
            title="Total Submissions"
            value={stats.total}
            description="Evaluated items"
            accentColor="blue"
            icon={<BarChart2 className="h-4 w-4 text-blue-400" />}
          />
          <StatsCard
            title="High Risk"
            value={stats.high}
            description="Severe threats found"
            accentColor="rose"
            icon={<ShieldAlert className="h-4 w-4 text-rose-400" />}
          />
          <StatsCard
            title="Medium Risk"
            value={stats.medium}
            description="Suspicious items"
            accentColor="amber"
            icon={<AlertTriangle className="h-4 w-4 text-amber-400" />}
          />
          <StatsCard
            title="Low Risk"
            value={stats.low}
            description="Safe/Verified items"
            accentColor="emerald"
            icon={<ShieldCheck className="h-4 w-4 text-emerald-400" />}
          />
        </div>

        {/* Recent Evaluations Section */}
        <div className="glass-card rounded-2xl overflow-hidden shadow-xl border border-slate-800">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Recent Security Evaluations</h3>
            <Link href="/history" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              <span>View full history</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recentAnalyses.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <p className="text-xs font-medium">No analyses run yet. Copy & paste suspicious links or text messages to check threat scores.</p>
              <Link
                href="/analyze"
                className="text-xs font-bold text-cyan-400 hover:underline inline-block"
              >
                Analyze your first content entry →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-extrabold uppercase tracking-wider">
                    <th className="p-4">Type</th>
                    <th className="p-4">Input Snippet</th>
                    <th className="p-4">Risk Level</th>
                    <th className="p-4">Score</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentAnalyses.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4 font-bold text-slate-300">{item.type}</td>
                      <td className="p-4 font-mono text-slate-200 max-w-[200px] truncate" title={item.input}>
                        {item.input}
                      </td>
                      <td className="p-4">
                        <RiskBadge level={item.risk_level} />
                      </td>
                      <td className="p-4 font-black text-white text-sm">{item.risk_score}</td>
                      <td className="p-4 text-slate-300 font-semibold">{item.category}</td>
                      <td className="p-4 text-slate-400 font-medium">{formatDate(item.created_at)}</td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/history/${item.id}`}
                          className="rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 px-3 py-1.5 text-xs font-bold transition-all inline-flex items-center gap-1.5 border border-slate-800"
                        >
                          <Eye className="h-3.5 w-3.5 text-blue-400" />
                          <span>View</span>
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
