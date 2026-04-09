import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const resumeId = searchParams.get('id');

    if (!resumeId) {
      return NextResponse.json({ message: "Resume ID is required" }, { status: 400 });
    }

    const sql = `
      SELECT r.id, r.user_id, r.title, r.template, 
             c.config, c.personal, c.education, c.experience, c.summary, c.skills,
             c.languages, c.certifications, c.projects
      FROM resumes r
      LEFT JOIN resume_content c ON r.id = c.resume_id
      WHERE r.id = ? AND r.user_id = ?
    `;
    const results = await query(sql, [resumeId, user.id]);

    if (results.length === 0) {
      return NextResponse.json({ message: "Resume not found" }, { status: 404 });
    }

    const row = results[0];
    
    // Parse JSON strings — DB stores "education"/"experience" columns (singular)
    // but the frontend ResumeContext uses "educations"/"experiences" (plural arrays)
    const parseField = (raw, fallback) =>
      raw ? (typeof raw === "string" ? JSON.parse(raw) : raw) : fallback;

    const rawEducation  = parseField(row.education,  null);
    const rawExperience = parseField(row.experience, null);

    // Normalise to array (new saves are arrays; old saves may be a single object)
    const educations  = Array.isArray(rawEducation)  ? rawEducation  : rawEducation  ? [rawEducation]  : [];
    const experiences = Array.isArray(rawExperience) ? rawExperience : rawExperience ? [rawExperience] : [];

    const data = {
      config:      parseField(row.config,   { template: row.template || "classic" }),
      personal:    parseField(row.personal, { firstName: "", lastName: "", email: "", phone: "", address: "", profilePic: "" }),
      educations,
      experiences,
      summary:     parseField(row.summary,  { details: "" }),
      skills:      parseField(row.skills,   { list: "" }),
      languages:      parseField(row.languages, []),
      certifications: parseField(row.certifications, []),
      projects:       parseField(row.projects, []),
    };

    return NextResponse.json({ data, resumeId: row.id }, { status: 200 });
  } catch (error) {
    console.error("Load Resume Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
