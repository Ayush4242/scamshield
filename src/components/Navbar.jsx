import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutUser } from "@/app/actions/auth";

export default async function Navbar() {
  const session = await getSession();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              ScamShield
            </span>
          </Link>
          {session && (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link href="/dashboard" className="hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link href="/analyze" className="hover:text-foreground transition-colors">
                Analyze
              </Link>
              <Link href="/history" className="hover:text-foreground transition-colors">
                History
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Hello, <strong className="text-foreground">{session.name}</strong>
              </span>
              <form action={logoutUser}>
                <button
                  type="submit"
                  className="rounded-md border border-border px-3 py-1.5 text-sm font-semibold hover:bg-muted transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-md px-3.5 py-2 text-sm font-semibold hover:bg-muted transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-white text-black px-3.5 py-2 text-sm font-semibold hover:bg-zinc-200 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
