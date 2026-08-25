"use server";

import { getSession } from "@/lib/auth";
import { runScamAnalysis } from "@/services/analysis";
import { query } from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const urlSchema = z.string().trim().min(3, "URL is too short");
const messageSchema = z.string().trim().min(5, "Message must be at least 5 characters long");

/**
 * Action to run a new content analysis
 * @param {"URL" | "MESSAGE"} type 
 * @param {string} input 
 */
export async function analyzeContentAction(type, input) {
  const session = await getSession();
  if (!session?.id) {
    return { success: false, error: "Unauthorized. Please log in first." };
  }

  // Input validation
  if (type === "URL") {
    const parse = urlSchema.safeParse(input);
    if (!parse.success) {
      return { success: false, error: parse.error.errors[0].message };
    }
  } else {
    const parse = messageSchema.safeParse(input);
    if (!parse.success) {
      return { success: false, error: parse.error.errors[0].message };
    }
  }

  try {
    // 1. Run analysis directly
    const result = await runScamAnalysis(type, input);
    const id = crypto.randomUUID();

    // 2. Insert into PostgreSQL
    await query(
      `INSERT INTO analyses (
        id, user_id, type, input, risk_score, risk_level, category, reasons, recommendation, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)`,
      [
        id,
        session.id,
        result.type,
        result.input,
        result.finalScore,
        result.riskLevel,
        result.category,
        JSON.stringify(result.reasons),
        result.recommendation
      ]
    );

    revalidatePath("/dashboard");
    revalidatePath("/history");
    
    return { 
      success: true, 
      analysisId: id, 
      result 
    };
  } catch (error) {
    console.error("Analysis Action Error:", error);
    return {
      success: false,
      error: error?.message || "An unexpected error occurred during analysis.",
    };
  }
}

/**
 * Action to update personal note on an analysis
 * @param {string} id 
 * @param {string} note 
 */
export async function updateNoteAction(id, note) {
  const session = await getSession();
  if (!session?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const res = await query(
      "UPDATE analyses SET note = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [note, id, session.id]
    );
    const updated = res.rows[0];
    
    if (!updated) {
      return { success: false, error: "Analysis not found or unauthorized" };
    }
    revalidatePath(`/history/${id}`);
    revalidatePath("/history");
    return { success: true };
  } catch (error) {
    console.error("Update Note Action Error:", error);
    return { success: false, error: "Database error" };
  }
}

/**
 * Action to delete an analysis
 * @param {string} id 
 */
export async function deleteAnalysisAction(id) {
  const session = await getSession();
  if (!session?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const res = await query(
      "DELETE FROM analyses WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, session.id]
    );
    const deleted = res.rows[0];
    
    if (!deleted) {
      return { success: false, error: "Analysis not found or unauthorized" };
    }
    revalidatePath("/dashboard");
    revalidatePath("/history");
    return { success: true };
  } catch (error) {
    console.error("Delete Analysis Action Error:", error);
    return { success: false, error: "Database error" };
  }
}
