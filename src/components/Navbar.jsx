import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutUser } from "@/app/actions/auth";
import { ShieldAlert, LayoutDashboard, Search, History, LogOut } from "lucide-react";

export default async function Navbar() {
  const session = await getSession();

  return (
    <header className="glass-nav sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
              <div className="h-full w-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <ShieldAlert className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-wider bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                SCAM<span className="text-cyan-400 font-extrabold">SHIELD</span>
              </span>
            </div>
          </Link>

          {/* Navigation Links for Authenticated Users */}
          {session && (
            <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
              >
                <LayoutDashboard className="h-4 w-4 text-blue-400" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/analyze"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
              >
                <Search className="h-4 w-4 text-cyan-400" />
                <span>Analyzer</span>
              </Link>
              <Link
                href="/history"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
              >
                <History className="h-4 w-4 text-indigo-400" />
                <span>History</span>
              </Link>
            </nav>
          )}
        </div>

        {/* Right User Actions */}
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800">
                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                  {session.name ? session.name[0] : "U"}
                </div>
                <span className="text-xs font-medium text-slate-300">
                  {session.name}
                </span>
              </div>
              
              <form action={logoutUser}>
                <button
                  type="submit"
                  title="Log Out"
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 transition-all cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-semibold px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent hover:border-slate-700/60 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-xs font-bold px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
