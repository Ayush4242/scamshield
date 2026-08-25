import { AlertTriangle, ShieldCheck, AlertOctagon, HelpCircle } from "lucide-react";

export default function RiskBadge({ level }) {
  let colorClasses = "";
  let Icon = HelpCircle;

  switch (level?.toUpperCase()) {
    case "LOW":
      colorClasses = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10";
      Icon = ShieldCheck;
      break;
    case "MEDIUM":
      colorClasses = "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-amber-500/10";
      Icon = AlertTriangle;
      break;
    case "HIGH":
      colorClasses = "bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-rose-500/10";
      Icon = AlertOctagon;
      break;
    default:
      colorClasses = "bg-slate-500/10 text-slate-400 border-slate-500/30 shadow-slate-500/10";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-extrabold uppercase tracking-wider select-none shadow-sm backdrop-blur-md ${colorClasses}`}>
      <Icon className="h-3.5 w-3.5" />
      <span>{level || "UNKNOWN"} RISK</span>
    </span>
  );
}
