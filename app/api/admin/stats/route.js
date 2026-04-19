import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard statistics
 *     description: Returns total user count, total resume count, and recent user registrations.
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                   example: 1248
 *                 totalResumes:
 *                   type: integer
 *                   example: 3842
 *                 recentUsers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
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
    // รัน queries พร้อมกันด้วย Promise.all
    const [
      [userRows],
      [resumeRows],
      [topTemplateRows],
      [todayRows],
      [recentRows]
    ] = await Promise.all([
      pool.query("SELECT COUNT(*) as count FROM users"),
      pool.query("SELECT COUNT(*) as count FROM resumes"),
      pool.query("SELECT template, COUNT(*) as count FROM resumes GROUP BY template ORDER BY count DESC LIMIT 1"),
      pool.query("SELECT COUNT(*) as count FROM resumes WHERE created_at >= CURDATE()"),
      pool.query("SELECT id, name, email, status, created_at FROM users ORDER BY created_at DESC LIMIT 4"),
    ]);

    const topTemplate = topTemplateRows[0]?.template || "ไม่มีข้อมูล";
    const resumesToday = todayRows[0]?.count || 0;

    return NextResponse.json(
      {
        totalUsers: userRows[0].count,
        totalResumes: resumeRows[0].count,
        topTemplate: topTemplate,
        resumesToday: resumesToday,
        recentUsers: recentRows,
      },
      {
        headers: {
          // cache 30 วินนาที (ตรงกันกับ polling interval)
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=10",
        },
      },
    );
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
