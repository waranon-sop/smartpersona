import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT setting_key, setting_value FROM settings WHERE setting_key IN ('site_name', 'site_description')"
    );

    const settings = rows.reduce((acc, row) => {
      acc[row.setting_key] = row.setting_value;
      return acc;
    }, {});

    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch public settings:", error);
    return NextResponse.json({ site_name: "SmartPersona", site_description: "" }, { status: 500 });
  }
}
