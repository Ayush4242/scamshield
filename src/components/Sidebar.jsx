import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-card hidden md:block min-h-[calc(100vh-4rem)] p-6 space-y-6">
      <div>
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
          Shield Controls
        </h3>
        <nav className="space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-muted text-foreground transition-all"
          >
            <span>📊</span> Dashboard
          </Link>
          <Link
            href="/analyze"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-muted text-foreground transition-all"
          >
            <span>🛡️</span> Scam Analyzer
          </Link>
          <Link
            href="/history"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-muted text-foreground transition-all"
          >
            <span>📜</span> History
          </Link>
        </nav>
      </div>
    </aside>
  );
}
