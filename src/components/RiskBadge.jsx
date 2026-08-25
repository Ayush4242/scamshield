export default function RiskBadge({ level }) {
  let colorClasses = "";
  
  switch (level?.toUpperCase()) {
    case "LOW":
      colorClasses = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      break;
    case "MEDIUM":
      colorClasses = "bg-amber-500/10 text-amber-400 border-amber-500/20";
      break;
    case "HIGH":
      colorClasses = "bg-rose-500/10 text-rose-400 border-rose-500/20";
      break;
    default:
      colorClasses = "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold select-none ${colorClasses}`}>
      {level || "UNKNOWN"} RISK
    </span>
  );
}
