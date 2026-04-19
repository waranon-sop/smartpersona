import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

/**
 * @swagger
 * /api/admin/resumes/{id}:
 *   get:
 *     tags: [Resumes]
 *     summary: Get a resume by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Resume ID (e.g. RES-001)
 *     responses:
 *       200:
 *         description: Resume data with author info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resume'
 *       404:
 *         description: Resume not found
 *       500:
 *         description: Internal server error
 */
export async function GET(request, { params }) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role?.toLowerCase() !== "admin") {
    return NextResponse.json(
      { error: "Forbidden: Admins only" },
      { status: 403 },
    );
  }
  try {
    const [rows] = await pool.query(
      `SELECT r.*, u.name as user_name, u.email as user_email
       FROM resumes r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.id = ?`,
      [id],
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error(`GET /api/admin/resumes/${id} error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/admin/resumes/{id}:
 *   delete:
 *     tags: [Resumes]
 *     summary: Delete a resume
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Resume ID
 *     responses:
 *       200:
 *         description: Resume deleted successfully
 *       404:
 *         description: Resume not found
 *       500:
 *         description: Internal server error
 */
export async function DELETE(request, { params }) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role?.toLowerCase() !== "admin") {
    return NextResponse.json(
      { error: "Forbidden: Admins only" },
      { status: 403 },
    );
  }
  try {
    const [result] = await pool.query("DELETE FROM resumes WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error(`DELETE /api/admin/resumes/${id} error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
