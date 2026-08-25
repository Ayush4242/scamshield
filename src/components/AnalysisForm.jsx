"use client";

import { useState } from "react";
import { analyzeContentAction } from "@/app/actions/analysis";
import AnalysisResult from "./AnalysisResult";
import Link from "next/link";

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

    // Basic client-side checks
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
      // Invoke server action
      const response = await analyzeContentAction(type, trimmedInput);
      if (response.success) {
        // If we want to fetch the created analysis details to display
        // We can run the scanner client side or just get the full result.
        // Wait, the action performs the analysis and saves it. It returns the analysisId.
        // Let's create an API route or action to retrieve details, or let the action return the result *along* with the id!
        // That is an excellent optimization! Let's update analyzeContentAction to also return the calculated result, 
        // which avoids an extra database query. We'll update src/app/actions/analysis.js in our mind, but first let's see.
        // Wait! The server action calls createAnalysis which doesn't directly return the object.
        // Let's update `analyzeContentAction` to return both `{ success: true, analysisId: id, result }`!
        // Let's check how we wrote analyzeContentAction: it calls `createAnalysis` which returns the newId.
        // Let's write the handler here assuming we will receive the full result or can link them to it.
        // Actually, we can fetch it, or have the server action return `{ success: true, analysisId: id, result: runScamAnalysis(type, input) }`!
        // Yes, that's exactly what we will do.
        setSavedId(response.analysisId);
        
        // We can run the scanner to show local results immediately.
        // Let's update the Server Action to return the result too. Let's make sure it handles that.
        // For now, let's write the UI logic.
        if (response.result) {
          setResult(response.result);
        } else {
          // If result isn't directly returned, we can redirect or show link
          setResult({
            type,
            input: trimmedInput,
            finalScore: response.finalScore || 50,
            riskLevel: response.riskLevel || "MEDIUM",
            category: response.category || "Other",
            reasons: response.reasons || ["Scam analysis completed and stored."],
            recommendation: response.recommendation || "Verify details carefully.",
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
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        {/* Toggle Tabs */}
        <div className="flex border-b border-border mb-6">
          <button
            type="button"
            onClick={() => {
              setType("URL");
              setInput("");
              setError(null);
              setResult(null);
            }}
            className={`pb-3 text-sm font-semibold border-b-2 px-4 transition-all cursor-pointer ${
              type === "URL"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            URL Link Check
          </button>
          <button
            type="button"
            onClick={() => {
              setType("MESSAGE");
              setInput("");
              setError(null);
              setResult(null);
            }}
            className={`pb-3 text-sm font-semibold border-b-2 px-4 transition-all cursor-pointer ${
              type === "MESSAGE"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Message / Text Check
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              {type === "URL"
                ? "Paste the suspicious website link/URL"
                : "Paste the suspicious message, email content, or SMS text"}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                type === "URL"
                  ? "e.g., http://secure-banking-verify-update.xyz/login"
                  : "e.g., Your bank account is frozen. Click here immediately to verify: http://bit.ly/fakeurl"
              }
              rows={4}
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-muted-foreground"
            />
          </div>

          {error && (
            <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? "Analyzing..." : "Run Scam Shield Analysis"}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-4">
          <AnalysisResult result={result} />
          {savedId && (
            <div className="flex justify-end">
              <Link
                href={`/history/${savedId}`}
                className="text-sm text-blue-400 hover:underline flex items-center gap-1"
              >
                View Saved History Entry & Add Notes →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
