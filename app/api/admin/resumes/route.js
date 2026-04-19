import pool from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/admin/resumes:
 *   get:
 *     tags: [Resumes]
 *     summary: List all resumes
 *     description: Returns a paginated, filterable list of resumes with author info.
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search by title, user name, or resume ID
 *       - in: query
 *         name: template
 *         schema: { type: string, enum: [Modern UX, Professional, Minimalist, Creative] }
 *         description: Filter by template
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Paginated list of resumes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Resume'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       500:
 *         description: Internal server error
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role?.toLowerCase() !== "admin") {
    return NextResponse.json(
      { error: "Forbidden: Admins only" },
      { status: 403 },
    );
  }
  const search = searchParams.get("search") || "";
  const template = searchParams.get("template") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limit;

  try {
    let whereClause = "WHERE 1=1";
    const queryParams = [];

    if (search) {
      whereClause += " AND (r.title LIKE ? OR u.name LIKE ? OR r.id LIKE ?)";
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (template && template !== "All Templates") {
      whereClause += " AND r.template = ?";
      queryParams.push(template);
    }

    const [countRows] = await pool.query(
      `SELECT COUNT(*) as count FROM resumes r LEFT JOIN users u ON r.user_id = u.id ${whereClause}`,
      queryParams,
    );
    const totalItems = countRows[0].count;
    const totalPages = Math.ceil(totalItems / limit);

    const [rows] = await pool.query(
      `SELECT r.id, r.title, r.template, r.status, r.views, r.downloads, r.created_at,
              u.name as user_name, u.email as user_email
       FROM resumes r
       LEFT JOIN users u ON r.user_id = u.id
       ${whereClause}
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset],
    );

    return NextResponse.json({
      data: rows,
      pagination: { page, limit, totalItems, totalPages },
    });
  } catch (error) {
    console.error("GET /api/admin/resumes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
