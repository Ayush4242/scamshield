"use client";

import { useState } from "react";
import { analyzeContentAction } from "@/app/actions/analysis";
import AnalysisResult from "./AnalysisResult";
import Link from "next/link";
import { Link2, MessageSquare, ShieldCheck, Loader2, AlertCircle, ArrowRight } from "lucide-react";

export default function AnalysisForm() {
  const [type, setType] = useState("URL"); // "URL" | "MESSAGE"
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [savedId, setSavedId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setSavedId(null);

    const trimmedInput = input.trim();

    if (type === "URL") {
      if (trimmedInput.length < 3) {
        setError("Please enter a valid URL (minimum 3 characters)");
        return;
      }
    } else {
      if (trimmedInput.length < 5) {
        setError("Please paste a message of at least 5 characters");
        return;
      }
    }

    setLoading(true);

    try {
      const response = await analyzeContentAction(type, trimmedInput);
      if (response.success) {
        setSavedId(response.analysisId);
        if (response.result) {
          setResult(response.result);
        } else {
          setResult({
            type,
            input: trimmedInput,
            finalScore: 50,
            riskLevel: "MEDIUM",
            category: "Other",
            reasons: ["Scam analysis completed and stored."],
            recommendation: "Verify details carefully.",
          });
        }
      } else {
        setError(response.error || "Analysis failed.");
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Top Accent Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-600"></div>

        {/* Segmented Switcher Tabs */}
        <div className="grid grid-cols-2 p-1.5 rounded-xl bg-slate-950/80 border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setType("URL");
              setInput("");
              setError(null);
              setResult(null);
            }}
            className={`flex items-center justify-center gap-2 py-3 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              type === "URL"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Link2 className="h-4 w-4" />
            <span>URL Link Check</span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              setType("MESSAGE");
              setInput("");
              setError(null);
              setResult(null);
            }}
            className={`flex items-center justify-center gap-2 py-3 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              type === "MESSAGE"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Message / Email Scan</span>
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                {type === "URL" ? "Suspicious Link / Domain URL" : "Suspicious Message / Email Content"}
              </label>
              <span className="text-[11px] font-semibold text-slate-500">
                {type === "URL" ? "Passive string analysis" : "Untrusted text format"}
              </span>
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                type === "URL"
                  ? "e.g., http://secure-banking-verify-update.xyz/login"
                  : "e.g., URGENT: Your bank account has been frozen. Click immediately to verify: http://bit.ly/fake-update"
              }
              rows={4}
              required
              className="w-full rounded-xl border border-slate-800 bg-slate-950/90 px-4 py-3.5 text-sm font-mono text-slate-100 placeholder:text-slate-600 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-500 text-white font-extrabold py-3.5 px-6 text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Running Threat Analysis Engine...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-5 w-5" />
                <span>Analyze Content Security</span>
              </>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <AnalysisResult result={result} />
          {savedId && (
            <div className="flex justify-end">
              <Link
                href={`/history/${savedId}`}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 group"
              >
                <span>View Full Record & Attach Personal Note</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
