import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { v4 as uuidv4 } from "uuid";

// POST /api/resume/publish - Make a resume public (only one per user)
export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { resumeId } = body;

    if (!resumeId) {
      return NextResponse.json(
        { message: "Resume ID is required" },
        { status: 400 }
      );
    }

    // Check if this resume belongs to the user
    const resumeRows = await query(
      "SELECT id FROM resumes WHERE id = ? AND user_id = ?",
      [resumeId, user.id]
    );

    if (resumeRows.length === 0) {
      return NextResponse.json(
        { message: "Resume not found" },
        { status: 404 }
      );
    }

    // First, unpublish any previously public resume for this user
    await query(
      "UPDATE resumes SET is_public = 0, public_key = NULL WHERE user_id = ? AND is_public = 1",
      [user.id]
    );

    // Generate unique public key
    const publicKey = `pub_${uuidv4().substring(0, 8)}`;

    // Make this resume public
    await query(
      "UPDATE resumes SET is_public = 1, public_key = ? WHERE id = ?",
      [publicKey, resumeId]
    );

    return NextResponse.json(
      { message: "Resume published successfully", publicKey },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error publishing resume:", error);
    return NextResponse.json(
      { message: "Error publishing resume" },
      { status: 500 }
    );
  }
}

// DELETE /api/resume/publish - Unpublish a resume
export async function DELETE(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { resumeId } = body;

    if (!resumeId) {
      return NextResponse.json(
        { message: "Resume ID is required" },
        { status: 400 }
      );
    }

    // Check if this resume belongs to the user
    const resumeRows = await query(
      "SELECT id FROM resumes WHERE id = ? AND user_id = ?",
      [resumeId, user.id]
    );

    if (resumeRows.length === 0) {
      return NextResponse.json(
        { message: "Resume not found" },
        { status: 404 }
      );
    }

    // Unpublish the resume
    await query(
      "UPDATE resumes SET is_public = 0, public_key = NULL WHERE id = ?",
      [resumeId]
    );

    return NextResponse.json(
      { message: "Resume unpublished successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error unpublishing resume:", error);
    return NextResponse.json(
      { message: "Error unpublishing resume" },
      { status: 500 }
    );
  }
}

// GET /api/resume/publish?resumeId=xxx - Check if resume is public
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const resumeId = searchParams.get("resumeId");

    if (!resumeId) {
      return NextResponse.json(
        { message: "Resume ID is required" },
        { status: 400 }
      );
    }

    const rows = await query(
      "SELECT is_public, public_key FROM resumes WHERE id = ?",
      [resumeId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Resume not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { isPublic: rows[0].is_public, publicKey: rows[0].public_key },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching resume status:", error);
    return NextResponse.json(
      { message: "Error fetching resume status" },
      { status: 500 }
    );
  }
}
