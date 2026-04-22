"use server";

import { query } from "@/lib/db";

export async function incrementResumeView(resumeId) {
  if (!resumeId) return;
  try {
    await query(
      "UPDATE resumes SET views = views + 1 WHERE id = ?",
      [resumeId]
    );
  } catch (error) {
    console.error("Error incrementing resume view:", error);
  }
}

export async function incrementResumeDownload(resumeId) {
  if (!resumeId) return;
  try {
    await query(
      "UPDATE resumes SET downloads = downloads + 1 WHERE id = ?",
      [resumeId]
    );
  } catch (error) {
    console.error("Error incrementing resume download:", error);
  }
}
