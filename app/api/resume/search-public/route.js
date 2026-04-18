import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/resume/search-public?query=xxx - Search for public resumes
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("query");

    if (!searchQuery || searchQuery.trim().length === 0) {
      return NextResponse.json(
        { message: "Search query is required" },
        { status: 400 }
      );
    }

    const searchTerm = `%${searchQuery}%`;

    // Search in resume_content for personal info (name) and skills
    const rows = await query(
      `SELECT 
        r.id as resume_id,
        u.id as user_id,
        u.name as user_name,
        r.title,
        r.template,
        rc.personal,
        rc.skills,
        r.created_at
      FROM resumes r
      JOIN resume_content rc ON r.id = rc.resume_id
      JOIN users u ON r.user_id = u.id
      WHERE r.is_public = 1
      AND (
        CAST(JSON_UNQUOTE(JSON_EXTRACT(rc.personal, '$.firstName')) AS CHAR) LIKE ?
        OR CAST(JSON_UNQUOTE(JSON_EXTRACT(rc.personal, '$.lastName')) AS CHAR) LIKE ?
        OR CAST(JSON_UNQUOTE(JSON_EXTRACT(rc.personal, '$.email')) AS CHAR) LIKE ?
        OR rc.skills LIKE ?
      )
      ORDER BY r.created_at DESC
      LIMIT 50`,
      [searchTerm, searchTerm, searchTerm, searchTerm]
    );

    // Format the response
    const formattedRows = rows.map((row) => {
      let personal = {};
      let skills = { list: "" };

      try {
        personal = typeof row.personal === 'string' 
          ? JSON.parse(row.personal) 
          : row.personal || {};
      } catch (e) {
        console.error("Error parsing personal:", e);
      }

      try {
        skills = typeof row.skills === 'string' 
          ? JSON.parse(row.skills) 
          : row.skills || { list: "" };
      } catch (e) {
        console.error("Error parsing skills:", e);
      }

      return {
        resumeId: row.resume_id,
        userId: row.user_id,
        userName: row.user_name,
        title: row.title,
        template: row.template,
        firstName: personal.firstName || "",
        lastName: personal.lastName || "",
        email: personal.email || "",
        skills: skills.list || "",
        createdAt: row.created_at,
      };
    });

    return NextResponse.json(
      {
        total: formattedRows.length,
        results: formattedRows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error searching resumes:", error);
    return NextResponse.json(
      { message: "Error searching resumes", error: error.message },
      { status: 500 }
    );
  }
}
