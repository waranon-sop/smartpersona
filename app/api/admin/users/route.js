import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags: [Users]
 *     summary: List all users
 *     description: Returns a paginated, filterable list of users.
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search by name or email
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [Admin, User] }
 *         description: Filter by role
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [Active, Inactive, Suspended] }
 *         description: Filter by status
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
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
  const role = searchParams.get("role") || "";
  const status = searchParams.get("status") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limit;

  try {
    let whereClause = "WHERE 1=1";
    const queryParams = [];

    if (search) {
      whereClause += " AND (u.name LIKE ? OR u.email LIKE ?)";
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    if (role && role !== "All Roles") {
      whereClause += " AND u.role = ?";
      queryParams.push(role);
    }
    if (status && status !== "All Status") {
      whereClause += " AND u.status = ?";
      queryParams.push(status);
    }

    const [countRows] = await pool.query(
      `SELECT COUNT(*) as count FROM users u ${whereClause}`,
      queryParams,
    );
    const totalItems = countRows[0].count;
    const totalPages = Math.ceil(totalItems / limit);

    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.status, u.created_at,
        (SELECT COUNT(*) FROM resumes r WHERE r.user_id = u.id) as resumes
       FROM users u ${whereClause}
       ORDER BY u.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset],
    );

    return NextResponse.json({
      data: rows,
      pagination: { page, limit, totalItems, totalPages },
    });
  } catch (error) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: integer }
 *                 message: { type: string }
 *       400:
 *         description: Missing required fields
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
    const { name, email, role = "User", status = "Active" } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "name and email are required" },
        { status: 400 },
      );
    }

    const emailRe = /^\S+@\S+\.\S+$/;
    if (!emailRe.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    const allowedRoles = ["Admin", "User"];
    const allowedStatus = ["Active", "Inactive", "Suspended"];
    if (!allowedRoles.includes(role))
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    if (!allowedStatus.includes(status))
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });

    const [result] = await pool.query(
      "INSERT INTO users (name, email, role, status) VALUES (?, ?, ?, ?)",
      [name, email, role, status],
    );

    return NextResponse.json(
      { id: result.insertId, message: "User created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/admin/users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
