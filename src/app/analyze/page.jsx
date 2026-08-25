import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import AnalysisForm from "@/components/AnalysisForm";

export const metadata = {
  title: "Analyze Content — ScamShield",
};

export default async function AnalyzePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <Sidebar />
      <div className="flex-1 space-y-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold tracking-tight">Scam Analyzer</h2>
          <p className="text-muted-foreground">
            Submit suspicious links or messages for passive verification.
          </p>
        </div>

        <AnalysisForm />
      </div>
    </div>
  );
}
