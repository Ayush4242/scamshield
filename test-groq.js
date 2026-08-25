import { runScamAnalysis } from "./src/services/analysis.js";
import fs from "fs";

// Load .env file
try {
  const envContent = fs.readFileSync(".env", "utf8");
  const lines = envContent.split("\n");
  for (const line of lines) {
    const parts = line.split("=");
    if (parts.length >= 2) {
      const k = parts[0].trim();
      const v = parts.slice(1).join("=").replace(/["'\r]/g, "").trim();
      process.env[k] = v;
    }
  }
} catch (e) {}

async function testAI() {
  console.log("Starting Live AI Scam Shield Analysis using Groq Key...");

  const testInput = "URGENT: Your Chase bank account has been frozen due to suspicious login attempt. Verify your account password and SSN immediately at: http://secure-chase-update.xyz/login";
  
  try {
    const result = await runScamAnalysis("MESSAGE", testInput);
    console.log("================ LIVE ANALYSIS RESULT ================");
    console.log("Content Type:      ", result.type);
    console.log("Final Risk Score:  ", result.finalScore, "/ 100");
    console.log("Risk Level:        ", result.riskLevel);
    console.log("Scam Category:     ", result.category);
    console.log("Rule Score:        ", result.ruleScore);
    console.log("AI Score:          ", result.aiScore);
    console.log("AI Fallback:       ", result.aiFallbackTriggered ? "YES (Fallback)" : "NO (Live AI Active!)");
    console.log("\nFlagged Reasons:");
    result.reasons.forEach(r => console.log("  •", r));
    console.log("\nRecommendation:");
    console.log(" ", result.recommendation);
    console.log("======================================================");
  } catch (err) {
    console.error("Test Error:", err);
  }
}

testAI();
