import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  try {
    // 1. ดึงข้อมูลต้นฉบับ
    const sourceResumes = await query(
      "SELECT title, template, status FROM resumes WHERE id = ? AND user_id = ?",
      [id, user.id]
    );

    if (sourceResumes.length === 0) {
      return NextResponse.json({ message: "Resume not found" }, { status: 404 });
    }

    const sourceContent = await query(
      "SELECT config, personal, education, experience, summary, skills FROM resume_content WHERE resume_id = ?",
      [id]
    );

    const original = sourceResumes[0];
    const content = sourceContent[0] || {};
    const newId = uuidv4();
    const newTitle = `${original.title} (Copy)`;

    // 2. Insert ลงตาราง resumes
    await query(
      "INSERT INTO resumes (id, user_id, title, template, status) VALUES (?, ?, ?, ?, 'Draft')",
      [newId, user.id, newTitle, original.template]
    );

    // 3. Insert ลงตาราง resume_content (safe-stringify ป้องกัน null crash)
    const safeStr = (v) => (v != null ? (typeof v === "string" ? v : JSON.stringify(v)) : "null");
    await query(
      `INSERT INTO resume_content (resume_id, config, personal, education, experience, summary, skills)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        newId,
        safeStr(content.config),
        safeStr(content.personal),
        safeStr(content.education),
        safeStr(content.experience),
        safeStr(content.summary),
        safeStr(content.skills),
      ]
    );

    return NextResponse.json({ message: "Duplicated successfully", newId }, { status: 201 });
  } catch (error) {
    console.error("Duplicate Resume Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
