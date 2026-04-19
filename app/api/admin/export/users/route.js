import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role.toLowerCase() !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const [rows] = await pool.query("SELECT id, name, email, role, status, created_at FROM users");
    
    // Create CSV Header
    let csv = "ID,Name,Email,Role,Status,Created At\n";
    
    // Create CSV Rows
    rows.forEach(row => {
      csv += `${row.id},"${row.name}","${row.email || ''}",${row.role},${row.status},"${new Date(row.created_at).toISOString()}"\n`;
    });

    const response = new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="smartpersona_users.csv"',
      },
    });

    return response;
  } catch (error) {
    console.error("Export error:", error);
    return new NextResponse("Failed to export users", { status: 500 });
  }
}
