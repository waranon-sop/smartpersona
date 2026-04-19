import pool from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role?.toLowerCase() !== "admin") {
      return new Response("Forbidden: Admins only", { status: 403 });
    }
    const [rows] = await pool.query(`
      SELECT r.id, r.title, r.template, r.status, r.views, r.downloads, r.created_at, u.name as user_name, u.email 
      FROM resumes r
      LEFT JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `);

    // Create CSV Header
    let csvData =
      "Resume ID,Title,Template,Status,Views,Downloads,Author Name,Author Email,Created At\n";

    // Append Rows
    rows.forEach((row) => {
      const title = `"${(row.title || "").replace(/"/g, '""')}"`;
      const userName = `"${(row.user_name || "Unknown").replace(/"/g, '""')}"`;
      csvData += `${row.id},${title},${row.template},${row.status},${row.views},${row.downloads},${userName},${row.email || ""},${row.created_at}\n`;
    });

    return new Response(csvData, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition":
          'attachment; filename="smartpersona_resumes_export.csv"',
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return new Response("Failed to generate export", { status: 500 });
  }
}
