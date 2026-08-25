import { getSession } from "@/lib/auth";
import { listAnalyses } from "@/services/analysis";
import { deleteAnalysisAction } from "@/app/actions/analysis";
import { redirect } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import RiskBadge from "@/components/RiskBadge";
import { formatDate } from "@/lib/utils";

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Analysis History</h2>
            <p className="text-muted-foreground font-medium">
              Review all previously analyzed link and message submissions.
            </p>
          </div>
          <div>
            <Link
              href="/analyze"
              className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 text-sm shadow-md transition-all inline-block text-center cursor-pointer"
            >
              New Analysis
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          {analyses.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground space-y-4">
              <p className="text-sm">No scam analyses found in your history.</p>
              <Link
                href="/analyze"
                className="text-sm text-blue-400 hover:underline"
              >
                Analyze your first link or text message
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold">
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
                <tbody className="divide-y divide-border">
                  {analyses.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 font-bold text-xs">{item.type}</td>
                      <td className="p-4 font-medium text-foreground/80 max-w-[150px] truncate" title={item.input}>
                        {item.input}
                      </td>
                      <td className="p-4">
                        <RiskBadge level={item.risk_level} />
                      </td>
                      <td className="p-4 font-bold">{item.risk_score}</td>
                      <td className="p-4 text-muted-foreground">{item.category}</td>
                      <td className="p-4 text-muted-foreground text-xs">{formatDate(item.created_at)}</td>
                      <td className="p-4 text-muted-foreground max-w-[120px] truncate" title={item.note || ""}>
                        {item.note || <span className="text-muted-foreground/40 italic">None</span>}
                      </td>
                      <td className="p-4 text-right flex items-center justify-end gap-2">
                        <Link
                          href={`/history/${item.id}`}
                          className="rounded-md bg-muted hover:bg-zinc-800 text-foreground px-3 py-1.5 text-xs font-semibold transition-all inline-block"
                        >
                          View
                        </Link>
                        
                        {/* Delete form - runs completely server side! */}
                        <form action={deleteAnalysisAction.bind(null, item.id)}>
                          <button
                            type="submit"
                            className="rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 px-3 py-1.5 text-xs font-semibold transition-all inline-block cursor-pointer"
                          >
                            Delete
                          </button>
                        </form>
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
