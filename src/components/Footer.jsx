import { ShieldCheck, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left Status & Copyright */}
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold select-none">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>AI Threat Engine Operational</span>
          </div>
          <span>© {new Date().getFullYear()} ScamShield</span>
        </div>

        {/* Center Developer Signature */}
        <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
          <span>Crafted by</span>
          <span className="text-slate-200 font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Ayush Ranjan
          </span>
        </div>

        {/* Right Links */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
          <a
            href="https://github.com/Ayush4242/scamshield"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors group"
          >
            <Github className="h-3.5 w-3.5 group-hover:text-blue-400 transition-colors" />
            <span>GitHub</span>
          </a>
          <a
            href="[PLACEHOLDER_LINKEDIN_URL]"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors group"
          >
            <Linkedin className="h-3.5 w-3.5 group-hover:text-cyan-400 transition-colors" />
            <span>LinkedIn</span>
          </a>
        </div>

      </div>
    </footer>
  );
}
