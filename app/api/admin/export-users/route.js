import pool from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role?.toLowerCase() !== "admin") {
      return new Response("Forbidden: Admins only", { status: 403 });
    }
    const [rows] = await pool.query(
      "SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC",
    );

    // Create CSV
    let csvData = "ID,Name,Email,Role,Status,Created At\n";

    // Append Rows
    rows.forEach((row) => {
      // Escape commas and quotes for CSV format
      const name = `"${row.name.replace(/"/g, '""')}"`;
      const email = `"${row.email}"`;
      csvData += `${row.id},${name},${email},${row.role},${row.status},${row.created_at}\n`;
    });

    return new Response(csvData, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition":
          'attachment; filename="smartpersona_users_export.csv"',
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return new Response("Failed to generate export", { status: 500 });
  }
}
