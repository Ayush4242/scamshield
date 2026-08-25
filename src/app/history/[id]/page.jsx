import { getSession } from "@/lib/auth";
import { getAnalysis } from "@/services/analysis";
import { updateNoteAction } from "@/app/actions/analysis";
import Sidebar from "@/components/Sidebar";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import RiskBadge from "@/components/RiskBadge";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Cpu, ShieldAlert, AlertTriangle, CheckCircle2, Save, Notebook } from "lucide-react";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `Analysis Detail — ScamShield`,
  };
}

export default async function AnalysisDetailPage({ params }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const analysis = await getAnalysis(id, session.id);

  if (!analysis) {
    notFound();
  }

  const handleSaveNote = async (formData) => {
    "use server";
    const note = formData.get("note");
    await updateNoteAction(id, note);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <Sidebar />
      <div className="flex-1 space-y-6">
        
        {/* Back Link & Header */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <Link
            href="/history"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Analysis History</span>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-2xl font-black tracking-tight text-white">Evaluation Record</h2>
            <span className="text-xs font-semibold text-slate-400">
              Analyzed on {formatDate(analysis.created_at)}
            </span>
          </div>
        </div>

        {/* Detailed Result Breakdown */}
        <div className="glass-card rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
          
          {/* Header section with risk indicator */}
          <div className="p-6 sm:p-8 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-transparent flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                Security Threat Index
              </span>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-black tracking-tight text-white">Risk Evaluation</h3>
                <RiskBadge level={analysis.risk_level} />
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-5 py-3 rounded-2xl self-start sm:self-auto">
              <div className="text-right">
                <span className="text-4xl font-black tracking-tight text-white">{analysis.risk_score}</span>
                <span className="text-slate-500 text-xs font-extrabold">/100</span>
              </div>
              <Cpu className="h-6 w-6 text-cyan-400" />
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* User Input Text */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-2.5">
                Submitted Input Content ({analysis.type})
              </h4>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-100 break-all leading-relaxed max-h-48 overflow-y-auto">
                {analysis.input}
              </div>
            </div>

            {/* Category classification */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Category</span>
                <p className="text-base font-bold mt-1 text-slate-100 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-blue-400" />
                  <span>{analysis.category}</span>
                </p>
              </div>
            </div>

            {/* Flagged reasons / signals */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">
                Flagged Risk Indicators ({analysis.reasons?.length || 0})
              </h4>
              <ul className="space-y-2.5">
                {analysis.reasons.map((reason, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-xs font-semibold text-slate-200 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
                    <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safety Recommendation */}
            <div className="pt-4 border-t border-slate-800/80">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-2.5">
                Protective Action Recommendation
              </h4>
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs font-bold leading-relaxed flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <span>{analysis.recommendation}</span>
              </div>
            </div>

          </div>
        </div>

        {/* CRUD Update Section: Personal Note */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <Notebook className="h-4 w-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Personal Incident Note</h3>
          </div>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            Attach custom context to this analysis (e.g., &quot;Received via SMS from spoofed bank number&quot;).
          </p>

          <form action={handleSaveNote} className="space-y-4">
            <textarea
              name="note"
              defaultValue={analysis.note || ""}
              placeholder="Write your custom incident note here..."
              rows={3}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold py-2.5 px-5 text-xs transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 flex items-center gap-2 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Save Note</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
