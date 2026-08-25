import { getSession } from "@/lib/auth";
import { listAnalyses } from "@/services/analysis";
import { deleteAnalysisAction } from "@/app/actions/analysis";
import { redirect } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import RiskBadge from "@/components/RiskBadge";
import { formatDate } from "@/lib/utils";
import { ShieldAlert, Eye, Trash2 } from "lucide-react";

export const metadata = {
  title: "Analysis History — ScamShield",
};

export default async function HistoryPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const analyses = await listAnalyses(session.id, 50);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <Sidebar />
      <div className="flex-1 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 glass-card p-6 rounded-2xl border border-slate-800">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-white">Analysis History</h2>
            <p className="text-xs text-slate-400 font-medium">
              Review all previously evaluated link and message submissions.
            </p>
          </div>
          <div>
            <Link
              href="/analyze"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold px-4 py-2.5 text-xs shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <ShieldAlert className="h-4 w-4" />
              <span>New Analysis</span>
            </Link>
          </div>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden shadow-xl border border-slate-800">
          {analyses.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <p className="text-xs font-medium">No scam analyses found in your history.</p>
              <Link
                href="/analyze"
                className="text-xs font-bold text-cyan-400 hover:underline inline-block"
              >
                Analyze your first link or text message →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-extrabold uppercase tracking-wider">
                    <th className="p-4">Type</th>
                    <th className="p-4">Input Text</th>
                    <th className="p-4">Risk Level</th>
                    <th className="p-4">Score</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Personal Note</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {analyses.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4 font-bold text-slate-300">{item.type}</td>
                      <td className="p-4 font-mono text-slate-200 max-w-[150px] truncate" title={item.input}>
                        {item.input}
                      </td>
                      <td className="p-4">
                        <RiskBadge level={item.risk_level} />
                      </td>
                      <td className="p-4 font-black text-white text-sm">{item.risk_score}</td>
                      <td className="p-4 text-slate-300 font-semibold">{item.category}</td>
                      <td className="p-4 text-slate-400 font-medium">{formatDate(item.created_at)}</td>
                      <td className="p-4 text-slate-400 max-w-[120px] truncate" title={item.note || ""}>
                        {item.note || <span className="text-slate-600 italic">None</span>}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/history/${item.id}`}
                            className="rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 px-3 py-1.5 text-xs font-bold transition-all inline-flex items-center gap-1.5 border border-slate-800"
                          >
                            <Eye className="h-3.5 w-3.5 text-blue-400" />
                            <span>View</span>
                          </Link>

                          <form action={deleteAnalysisAction.bind(null, item.id)}>
                            <button
                              type="submit"
                              className="rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 px-3 py-1.5 text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete</span>
                            </button>
                          </form>
                        </div>
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
