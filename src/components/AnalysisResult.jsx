import RiskBadge from "./RiskBadge";

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
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-lg transition-all duration-300">
      {/* Header section with risk indicator */}
      <div className={`p-6 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-linear-to-b from-muted/50 to-transparent`}>
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Analysis Result ({type})
          </span>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold tracking-tight">Risk Evaluation</h3>
            <RiskBadge level={riskLevel} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-3xl font-extrabold tracking-tight">{finalScore}</span>
            <span className="text-muted-foreground text-sm font-semibold">/100</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Category classification */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
            <span className="text-xs text-muted-foreground uppercase font-bold">Scam Category</span>
            <p className="text-lg font-semibold mt-0.5 text-foreground">{category}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
            <span className="text-xs text-muted-foreground uppercase font-bold">Parsed Input</span>
            <p className="text-sm font-medium mt-0.5 truncate text-foreground/85" title={input}>
              {input}
            </p>
          </div>
        </div>

        {/* AI Failure warning */}
        {aiFallbackTriggered && (
          <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-300 text-sm">
            <strong>Notice:</strong> AI semantic analysis was temporarily unavailable. Running in 100% deterministic rule-based mode.
          </div>
        )}

        {/* Flagged reasons / signals */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Flagged Risk Indicators
          </h4>
          <ul className="space-y-2">
            {reasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-foreground/90">
                <span className="text-rose-400 mt-1 select-none">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Safety Recommendation */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Actionable Recommendation
          </h4>
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm leading-relaxed">
            {recommendation}
          </div>
        </div>
      </div>
    </div>
  );
}
