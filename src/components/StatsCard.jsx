export default function StatsCard({ title, value, icon, description, accentColor = "blue", className = "" }) {
  let topBorderClass = "border-t-blue-500/80";
  if (accentColor === "rose") topBorderClass = "border-t-rose-500/80";
  if (accentColor === "amber") topBorderClass = "border-t-amber-500/80";
  if (accentColor === "emerald") topBorderClass = "border-t-emerald-500/80";

  return (
    <div className={`glass-card rounded-2xl p-5 border-t-2 ${topBorderClass} shadow-lg hover:border-slate-700/80 transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</span>
        {icon && (
          <div className="h-8 w-8 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-300">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-black tracking-tight text-white">{value}</span>
      </div>
      {description && <p className="mt-1 text-[11px] text-slate-400 font-medium">{description}</p>}
    </div>
  );
}
