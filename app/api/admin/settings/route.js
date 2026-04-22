import pool from "@/lib/db";
import { getSettings, updateSettings } from "@/app/admin/actions/adminActions";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

/**
 * @swagger
 * /api/admin/settings:
 *   get:
 *     tags: [Settings]
 *     summary: Get platform settings
 *     responses:
 *       200:
 *         description: Settings data
 *       500:
 *         description: Internal server error
 */
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role?.toLowerCase() !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admins only" },
        { status: 403 },
      );
    }

    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET /api/admin/settings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/admin/settings:
 *   post:
 *     tags: [Settings]
 *     summary: Update platform settings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               platformName:
 *                 type: string
 *               supportEmail:
 *                 type: string
 *               notifyNewUser:
 *                 type: string
 *               weeklyReport:
 *                 type: string
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *       500:
 *         description: Internal server error
 */
export async function POST(request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role?.toLowerCase() !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admins only" },
        { status: 403 },
      );
    }

    const body = await request.json();

    // Convert booleanish to string "true"/"false" for DB consistency
    const allowRegistration = String(
      body.allow_registration === "true" || body.allow_registration === true,
    );
    const maintenanceMode = String(
      body.maintenance_mode === "true" || body.maintenance_mode === true,
    );

    // Basic validation
    const emailRe = /^\S+@\S+\.\S+$/;
    const contactEmail = body.supportEmail || body.contact_email;
    if (contactEmail && !emailRe.test(contactEmail)) {
      return NextResponse.json(
        { error: "Invalid supportEmail" },
        { status: 400 },
      );
    }

    const settingsToSave = [
      ["site_name", body.platformName || body.site_name],
      ["contact_email", contactEmail],
      ["allow_registration", allowRegistration],
      ["maintenance_mode", maintenanceMode],
    ];

    for (const [key, val] of settingsToSave) {
      if (val !== undefined && val !== null) {
        await pool.query(
          "INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?",
          [key, val, val],
        );
      }
    }

    return NextResponse.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("POST /api/admin/settings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
