import { getSession } from "@/lib/auth";
import { getAnalysis } from "@/services/analysis";
import { updateNoteAction } from "@/app/actions/analysis";
import Sidebar from "@/components/Sidebar";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import RiskBadge from "@/components/RiskBadge";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `Analysis Detail — ScamShield`,
  };
}

export default async function AnalysisDetailPage({ params }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const analysis = await getAnalysis(id, session.id);

  if (!analysis) {
    notFound();
  }

  // Handle note submission
  const handleSaveNote = async (formData) => {
    "use server";
    const note = formData.get("note");
    await updateNoteAction(id, note);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <Sidebar />
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <Link
              href="/history"
              className="text-sm text-blue-400 hover:underline font-medium"
            >
              ← Back to History
            </Link>
            <h2 className="text-3xl font-extrabold tracking-tight mt-2">Analysis Detail</h2>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              Evaluated on {formatDate(analysis.created_at)}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-md">
          {/* Header section with risk indicator */}
          <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-muted/20">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Evaluation
              </span>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold tracking-tight">Risk Score</h3>
                <RiskBadge level={analysis.risk_level} />
              </div>
            </div>
            <div className="text-right">
              <span className="text-4xl font-extrabold tracking-tight text-white">{analysis.risk_score}</span>
              <span className="text-muted-foreground text-sm font-semibold">/100</span>
            </div>
          </div>

          {/* Details section */}
          <div className="p-6 space-y-6">
            {/* User Input Text */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Submitted Input ({analysis.type})
              </h4>
              <div className="p-4 rounded-lg bg-background border border-border text-sm font-mono break-all leading-relaxed max-h-48 overflow-y-auto">
                {analysis.input}
              </div>
            </div>

            {/* Classification details */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <span className="text-xs text-muted-foreground uppercase font-bold">Category</span>
                <p className="text-lg font-semibold mt-0.5 text-foreground">{analysis.category}</p>
              </div>
            </div>

            {/* Flagged reasons / signals */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Flagged Risk Indicators
              </h4>
              <ul className="space-y-2">
                {analysis.reasons.map((reason, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-foreground/90 font-medium">
                    <span className="text-rose-400 mt-1 select-none font-bold">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safety Recommendation */}
            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Actionable Recommendation
              </h4>
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm leading-relaxed font-semibold">
                {analysis.recommendation}
              </div>
            </div>
          </div>
        </div>

        {/* CRUD Update Section: Personal Note */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-lg font-bold">Personal Note</h3>
            <p className="text-xs text-muted-foreground font-medium">
              Attach a custom note or context to this analysis (e.g., &quot;Received via SMS from spoofed bank number&quot;).
            </p>
          </div>

          <form action={handleSaveNote} className="space-y-4">
            <textarea
              name="note"
              defaultValue={analysis.note || ""}
              placeholder="Write your note here..."
              rows={3}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-muted-foreground font-medium"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 text-sm transition-all cursor-pointer"
              >
                Save Note
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
