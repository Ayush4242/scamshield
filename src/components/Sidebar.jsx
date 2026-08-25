import Link from "next/link";
import { LayoutDashboard, ShieldAlert, History, Lock, Cpu } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 glass-card rounded-2xl hidden md:block p-5 space-y-6 self-start shadow-xl">
      <div>
        <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-4 px-2 flex items-center justify-between">
          <span>Shield Controls</span>
          <Cpu className="h-3.5 w-3.5 text-blue-400" />
        </h3>
        <nav className="space-y-1.5">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent hover:border-slate-700/60 transition-all duration-200 group"
          >
            <LayoutDashboard className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/analyze"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent hover:border-slate-700/60 transition-all duration-200 group"
          >
            <ShieldAlert className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>Scam Analyzer</span>
          </Link>
          <Link
            href="/history"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent hover:border-slate-700/60 transition-all duration-200 group"
          >
            <History className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span>Analysis History</span>
          </Link>
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800/80">
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Lock className="h-3.5 w-3.5 text-cyan-400" />
            <span>Passive Verification</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
            URL links & message text are analyzed purely as static input without triggering network requests.
          </p>
        </div>
      </div>
    </aside>
  );
}
