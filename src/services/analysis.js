import { query } from "@/lib/db";
import { analyzeUrlRules, analyzeMessageRules } from "./scamDetector";
import { analyzeContentWithAI } from "@/lib/ai";

/**
 * Maps score to risk level label
 * @param {number} score 
 * @returns {"LOW" | "MEDIUM" | "HIGH"}
 */
export function getRiskLevel(score) {
  if (score <= 30) return "LOW";
  if (score <= 60) return "MEDIUM";
  return "HIGH";
}

/**
 * Runs rule-based and AI-based analyzers and combines the results
 * @param {"URL" | "MESSAGE"} type 
 * @param {string} input 
 * @returns {Promise<object>}
 */
export async function runScamAnalysis(type, input) {
  // 1. Rule-based evaluation
  let ruleResult;
  if (type === "URL") {
    ruleResult = analyzeUrlRules(input);
  } else {
    ruleResult = analyzeMessageRules(input);
  }

  let aiResult = null;
  let aiFallbackTriggered = false;

  // 2. AI-based evaluation
  try {
    aiResult = await analyzeContentWithAI(type, input);
  } catch (error) {
    console.warn("AI analysis failed, falling back to 100% rule-based analysis.", error);
    aiFallbackTriggered = true;
  }

  // 3. Combine results
  let finalScore = 0;
  let category = "Other";
  let reasons = [];
  let recommendation = "";

  if (aiResult && !aiFallbackTriggered) {
    // Hybrid scoring formula: 60% rule-based + 40% AI
    finalScore = Math.round(ruleResult.score * 0.6 + aiResult.riskScore * 0.4);
    category = aiResult.category;
    
    // Merge reasons avoiding duplicates
    reasons = [...ruleResult.signals, ...aiResult.reasons].filter(
      (reason, idx, self) => 
        reason !== "No obvious suspicious rule-based signals detected in URL" &&
        reason !== "No obvious suspicious rule-based signals detected in message content" &&
        self.indexOf(reason) === idx
    );
    if (reasons.length === 0) {
      reasons = ["No major risk indicators flagged."];
    }
    recommendation = aiResult.recommendation;
  } else {
    // Fallback: 100% rule-based
    finalScore = ruleResult.score;
    category = type === "URL" ? "Suspicious Link" : "Other";
    reasons = ruleResult.signals;
    
    if (finalScore > 60) {
      recommendation = type === "URL"
        ? "Do NOT visit this website. It has multiple severe indicators of phishing or scam."
        : "Do NOT reply or provide details. Report and delete this message immediately.";
    } else if (finalScore > 30) {
      recommendation = "Exercise extreme caution. Verify the sender/domain independently before interacting.";
    } else {
      recommendation = "No obvious threats detected. However, remain vigilant with unsolicited content.";
    }
  }

  finalScore = Math.min(Math.max(finalScore, 0), 100);

  return {
    type,
    input,
    ruleScore: ruleResult.score,
    aiScore: aiResult ? aiResult.riskScore : 0,
    finalScore,
    riskLevel: getRiskLevel(finalScore),
    category,
    reasons,
    recommendation,
    aiFallbackTriggered,
  };
}

// =======================================================
// Database CRUD Operations
// =======================================================

/**
 * Creates and saves analysis
 * @param {string} userId 
 * @param {"URL" | "MESSAGE"} type 
 * @param {string} input 
 * @returns {Promise<string>} Created analysis ID
 */
export async function createAnalysis(userId, type, input) {
  const result = await runScamAnalysis(type, input);
  const id = crypto.randomUUID();

  await query(
    `INSERT INTO analyses (
      id, user_id, type, input, risk_score, risk_level, category, reasons, recommendation, created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)`,
    [
      id,
      userId,
      result.type,
      result.input,
      result.finalScore,
      result.riskLevel,
      result.category,
      JSON.stringify(result.reasons),
      result.recommendation
    ]
  );

  return id;
}

/**
 * Reads single analysis checking ownership
 * @param {string} id 
 * @param {string} userId 
 * @returns {Promise<object|null>}
 */
export async function getAnalysis(id, userId) {
  const res = await query("SELECT * FROM analyses WHERE id = $1 AND user_id = $2", [id, userId]);
  return res.rows[0] || null;
}

/**
 * Retrieve statistics for user's analyses
 * @param {string} userId 
 * @returns {Promise<{total: number, high: number, medium: number, low: number}>}
 */
export async function getDashboardStats(userId) {
  const res = await query(
    "SELECT risk_level, COUNT(*)::integer as count FROM analyses WHERE user_id = $1 GROUP BY risk_level",
    [userId]
  );

  const stats = { total: 0, high: 0, medium: 0, low: 0 };
  res.rows.forEach(row => {
    const count = row.count;
    stats.total += count;
    if (row.risk_level === "HIGH") stats.high = count;
    if (row.risk_level === "MEDIUM") stats.medium = count;
    if (row.risk_level === "LOW") stats.low = count;
  });

  return stats;
}

/**
 * Lists analyses for user
 * @param {string} userId 
 * @param {number} limit 
 * @returns {Promise<object[]>}
 */
export async function listAnalyses(userId, limit = 50) {
  const res = await query(
    "SELECT * FROM analyses WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2",
    [userId, limit]
  );
  return res.rows;
}

/**
 * Updates note checking ownership (Update part of CRUD)
 * @param {string} id 
 * @param {string} userId 
 * @param {string} note 
 * @returns {Promise<object|null>}
 */
export async function updateAnalysisNote(id, userId, note) {
  const res = await query(
    "UPDATE analyses SET note = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
    [note, id, userId]
  );
  return res.rows[0] || null;
}

/**
 * Deletes analysis checking ownership (Delete part of CRUD)
 * @param {string} id 
 * @param {string} userId 
 * @returns {Promise<object|null>}
 */
export async function deleteAnalysis(id, userId) {
  const res = await query(
    "DELETE FROM analyses WHERE id = $1 AND user_id = $2 RETURNING *",
    [id, userId]
  );
  return res.rows[0] || null;
}
