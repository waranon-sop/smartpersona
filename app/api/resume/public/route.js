import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const resumeId = searchParams.get("id");

    if (!resumeId) {
      return NextResponse.json({ message: "Resume ID is required" }, { status: 400 });
    }

    // ดึงข้อมูล Resume เฉพาะที่เป็น Public เท่านั้น
    const sql = `
      SELECT r.id, r.title, r.template, 
             c.config, c.personal, c.education, c.experience, c.summary, c.skills,
             c.languages, c.certifications, c.projects
      FROM resumes r
      LEFT JOIN resume_content c ON r.id = c.resume_id
      WHERE r.id = ? AND r.is_public = 1
    `;
    const results = await query(sql, [resumeId]);

    if (results.length === 0) {
      return NextResponse.json({ message: "Resume not found or not public" }, { status: 404 });
    }

    const row = results[0];
    
    // Increment view count for public access
    await query("UPDATE resumes SET views = views + 1 WHERE id = ?", [resumeId]);

    // แปลง JSON string เป็น Object — ใช้ helper เดียวกับ load route
    const parseField = (raw, fallback) =>
      raw ? (typeof raw === "string" ? JSON.parse(raw) : raw) : fallback;

    const rawEducation  = parseField(row.education,  null);
    const rawExperience = parseField(row.experience, null);

    const data = {
      config:         parseField(row.config, { template: row.template || "classic" }),
      personal:       parseField(row.personal, {}),
      educations:     Array.isArray(rawEducation)  ? rawEducation  : rawEducation  ? [rawEducation]  : [],
      experiences:    Array.isArray(rawExperience) ? rawExperience : rawExperience ? [rawExperience] : [],
      summary:        parseField(row.summary, {}),
      skills:         parseField(row.skills, {}),
      languages:      parseField(row.languages, []),
      certifications: parseField(row.certifications, []),
      projects:       parseField(row.projects, []),
    };

    return NextResponse.json({ data, resumeId: row.id, title: row.title }, { status: 200 });
  } catch (error) {
    console.error("Public Resume Load Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
