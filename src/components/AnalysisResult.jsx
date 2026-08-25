import RiskBadge from "./RiskBadge";
import { ShieldAlert, AlertTriangle, CheckCircle2, Cpu, Info } from "lucide-react";

export default function AnalysisResult({ result }) {
  if (!result) return null;

  const {
    type,
    input,
    finalScore,
    riskLevel,
    category,
    reasons,
    recommendation,
    aiFallbackTriggered,
  } = result;

  return (
    <div className="glass-card rounded-2xl overflow-hidden shadow-2xl border border-slate-800/90">
      
      {/* Header section with score dial */}
      <div className="p-6 sm:p-8 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-transparent flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
              Evaluation Result
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {type}
            </span>
          </div>
          
          <div className="flex items-center gap-3.5">
            <h3 className="text-2xl font-black tracking-tight text-white">Security Threat Index</h3>
            <RiskBadge level={riskLevel} />
          </div>
        </div>

        {/* Large Numerical Score */}
        <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-5 py-3 rounded-2xl self-start sm:self-auto">
          <div className="text-right">
            <span className="text-4xl font-black tracking-tight text-white">{finalScore}</span>
            <span className="text-slate-500 text-xs font-extrabold">/100</span>
          </div>
          <Cpu className="h-6 w-6 text-cyan-400" />
        </div>

      </div>

      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Classification Summary Cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Threat Category</span>
            <p className="text-base font-bold mt-1 text-slate-100 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-blue-400" />
              <span>{category}</span>
            </p>
          </div>
          
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Evaluated Input Snippet</span>
            <p className="text-xs font-mono mt-1 text-slate-300 truncate" title={input}>
              {input}
            </p>
          </div>
        </div>

        {/* AI Fallback Notice */}
        {aiFallbackTriggered && (
          <div className="flex items-center gap-2.5 p-4 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-300 text-xs font-semibold">
            <Info className="h-4 w-4 shrink-0" />
            <span>AI semantic analysis was unavailable. Evaluated using 100% deterministic security rules.</span>
          </div>
        )}

        {/* Flagged reasons / signals */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3.5">
            Flagged Risk Indicators ({reasons.length})
          </h4>
          <ul className="space-y-2.5">
            {reasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-2.5 text-xs font-semibold text-slate-200 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
                <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Safety Recommendation Banner */}
        <div className="pt-4 border-t border-slate-800/80">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-2.5">
            Protective Action Recommendation
          </h4>
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs font-bold leading-relaxed flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
            <span>{recommendation}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
