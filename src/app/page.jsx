import Link from "next/link";
import { getSession } from "@/lib/auth";
import { ShieldCheck, Lock, Cpu, ArrowRight, CheckCircle, Zap } from "lucide-react";

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="space-y-20 py-8 md:py-16 relative">
      
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 glow-blue-top pointer-events-none -z-10"></div>

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        
        {/* Badge Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-bold text-slate-300 shadow-md">
          <Cpu className="h-3.5 w-3.5 text-cyan-400" />
          <span>Hybrid AI & Deterministic Threat Engine</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          Think Before <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
            You Click.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium">
          Stop phishing, smishing, and social engineering attacks before they start. Safely analyze suspicious link URLs, SMS texts, and emails using weighted rule checks and AI semantics.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          {session ? (
            <Link
              href="/analyze"
              className="rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold px-7 py-3.5 text-sm transition-all duration-300 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center gap-2 group"
            >
              <span>Analyze a Scam Threat</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold px-7 py-3.5 text-sm transition-all duration-300 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center gap-2 group"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="rounded-xl glass-card text-slate-200 hover:text-white font-bold px-7 py-3.5 text-sm transition-all border border-slate-800 hover:border-slate-700"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

      </div>

      {/* Feature Highlights Grid */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 pt-6">
        
        <div className="glass-card rounded-2xl p-6 space-y-3.5 hover:border-blue-500/40 transition-all duration-300 group">
          <div className="h-11 w-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
            <Lock className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-100">SSRF-Safe Link Analysis</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            Evaluates suspicious URL structure, protocol, raw IP hosts, typosquatting branding, and unusual TLDs purely as static text without making network requests.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-3.5 hover:border-cyan-500/40 transition-all duration-300 group">
          <div className="h-11 w-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
            <Cpu className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-100">AI Semantic Detection</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            Uses AI language models to parse urgent wording, fake agent threats, OTP credential harvesting, and social engineering context safely isolated as untrusted data.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-3.5 hover:border-indigo-500/40 transition-all duration-300 group">
          <div className="h-11 w-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-100">Hybrid Risk Score</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            Generates a index from 0 to 100 based on weighted rule signals (60%) and AI evaluation (40%), providing clear indicators and protective advice.
          </p>
        </div>

      </div>

      {/* Security Assurance Banner */}
      <div className="max-w-4xl mx-auto glass-card rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Zap className="h-5 w-5 text-cyan-400 shrink-0" />
          <span className="text-xs font-bold text-slate-300">
            PostgreSQL Database & HTTP-only AES-256 Session Encrypted Storage
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 shrink-0">
          <CheckCircle className="h-4 w-4" />
          <span>OWASP Compliant</span>
        </div>
      </div>

    </div>
  );
}
