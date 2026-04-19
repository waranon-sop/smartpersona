import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role.toLowerCase() !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const [rows] = await pool.query(`
      SELECT r.id, r.title, u.name as author, r.template, r.status, r.views, r.created_at 
      FROM resumes r
      LEFT JOIN users u ON r.user_id = u.id
    `);
    
    // Create CSV Header
    let csv = "ID,Title,Author,Template,Status,Views,Created At\n";
    
    // Create CSV Rows
    rows.forEach(row => {
      csv += `${row.id},"${row.title}","${row.author}",${row.template},${row.status},${row.views},"${new Date(row.created_at).toISOString()}"\n`;
    });

    const response = new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="smartpersona_resumes.csv"',
      },
    });

    return response;
  } catch (error) {
    console.error("Export error:", error);
    return new NextResponse("Failed to export resumes", { status: 500 });
  }
}
