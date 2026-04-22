import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Internal API: ตรวจสอบสถานะ maintenance_mode จากฐานข้อมูล
 * ใช้โดย middleware.js เพื่อตัดสินใจว่าจะบล็อก request หรือไม่
 */
export async function GET() {
  try {
    const rows = await query(
      "SELECT setting_value FROM settings WHERE setting_key = 'maintenance_mode'"
    );

    const isMaintenanceMode =
      rows.length > 0 && rows[0].setting_value === "true";

    return NextResponse.json(
      { maintenance: isMaintenanceMode },
      { status: 200 }
    );
  } catch (error) {
    console.error("Maintenance check error:", error);
    // If DB is down, default to NOT in maintenance (to avoid locking out everyone)
    return NextResponse.json({ maintenance: false }, { status: 200 });
  }
}
