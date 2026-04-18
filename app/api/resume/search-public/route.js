import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET /api/resume/search-public?query=xxx&page=1&limit=12&template=classic&role=developer
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = (searchParams.get("query") || "").trim();
    const page = Math.max(1, parseInt(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit")) || 12));
    const template = (searchParams.get("template") || "").trim();
    const role = (searchParams.get("role") || "").trim();
    const offset = (page - 1) * limit;

    // Build WHERE conditions
    const conditions = ["r.is_public = 1", "rc.personal IS NOT NULL"];
    const params = [];

    if (searchQuery) {
      conditions.push(`(
        JSON_UNQUOTE(JSON_EXTRACT(rc.personal, '$.firstName')) LIKE ?
        OR JSON_UNQUOTE(JSON_EXTRACT(rc.personal, '$.lastName')) LIKE ?
        OR JSON_UNQUOTE(JSON_EXTRACT(rc.personal, '$.email')) LIKE ?
        OR JSON_UNQUOTE(JSON_EXTRACT(rc.skills, '$.list')) LIKE ?
      )`);
      const term = `%${searchQuery}%`;
      params.push(term, term, term, term);
    }

    if (template && template !== "all") {
      conditions.push("r.template = ?");
      params.push(template);
    }

    if (role && role !== "all") {
      conditions.push("JSON_UNQUOTE(JSON_EXTRACT(rc.personal, '$.jobTitle')) LIKE ?");
      params.push(`%${role}%`);
    }

    const whereSQL = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Use pool.query() instead of pool.execute() to avoid prepared statement issues with LIMIT
    const countSQL = `
      SELECT COUNT(*) as total
      FROM resumes r
      LEFT JOIN resume_content rc ON r.id = rc.resume_id
      ${whereSQL}
    `;
    const [countRows] = await pool.query(countSQL, params);
    const total = countRows[0]?.total || 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const dataSQL = `
      SELECT 
        r.id as resume_id,
        r.title,
        r.template,
        r.created_at,
        rc.personal,
        rc.skills
      FROM resumes r
      LEFT JOIN resume_content rc ON r.id = rc.resume_id
      ${whereSQL}
      ORDER BY r.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    const [rows] = await pool.query(dataSQL, params);

    // Format results safely
    const results = rows.map((row) => {
      let personal = {};
      let skills = "";

      try {
        const p = typeof row.personal === "string" ? JSON.parse(row.personal) : (row.personal || {});
        personal = p;
      } catch { /* ignore parse errors */ }

      try {
        const s = typeof row.skills === "string" ? JSON.parse(row.skills) : (row.skills || {});
        skills = s.list || "";
      } catch { /* ignore parse errors */ }

      return {
        resumeId: row.resume_id,
        title: row.title,
        template: row.template,
        firstName: personal.firstName || "",
        lastName: personal.lastName || "",
        email: personal.email || "",
        jobTitle: personal.jobTitle || "",
        skills,
        createdAt: row.created_at,
      };
    });

    return NextResponse.json({ total, page, limit, totalPages, results }, { status: 200 });
  } catch (error) {
    console.error("Error searching resumes:", error);
    return NextResponse.json(
      { message: "Error searching resumes", error: error.message },
      { status: 500 }
    );
  }
}
