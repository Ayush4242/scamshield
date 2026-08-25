import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-24 space-y-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl space-y-6">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
          Think Before You Click.
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
          Stop scams in their tracks. Copy and paste suspicious links, emails, SMS texts, or social media messages to analyze risk scores using deterministic security rules and AI semantics.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          {session ? (
            <Link
              href="/analyze"
              className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 transition-all shadow-md hover:scale-[1.02]"
            >
              Analyze a Scam
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold px-6 py-3 transition-all shadow-md hover:scale-[1.02]"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-border hover:bg-muted font-semibold px-6 py-3 transition-all"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Grid Features */}
      <div className="w-full max-w-5xl grid md:grid-cols-3 gap-8 pt-12">
        <div className="rounded-xl border border-border bg-card p-6 space-y-3">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold">
            🔗
          </div>
          <h3 className="text-lg font-bold">Link Safety Verification</h3>
          <p className="text-sm text-muted-foreground">
            Checks suspicious URL strings for protocol indicators, typosquatting branding keywords, and suspicious top-level domains without hitting the actual site (preventing SSRF).
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-3">
          <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold">
            💬
          </div>
          <h3 className="text-lg font-bold">Semantic Message Scan</h3>
          <p className="text-sm text-muted-foreground">
            Uses advanced AI language models to parse urgent wording, fake agent threats, payment requests, and fraudulent calls-to-action while safely treating it as untrusted data.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-3">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold">
            🛡️
          </div>
          <h3 className="text-lg font-bold">Hybrid Risk Score</h3>
          <p className="text-sm text-muted-foreground">
            Generates a final index from 0 to 100 based on weighted rule matches (60%) and AI evaluation (40%), providing clear indicators and actionable advice.
          </p>
        </div>
      </div>
    </div>
  );
}
