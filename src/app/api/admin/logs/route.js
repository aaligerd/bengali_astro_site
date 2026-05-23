import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/jwt";

export async function GET(request) {
  try {
    // Authenticate calling admin
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("astro_session");

    if (!tokenCookie || !tokenCookie.value) {
      return NextResponse.json({ error: "অননুমোদিত প্রবেশ" }, { status: 401 });
    }

    const decoded = verifyToken(tokenCookie.value);
    if (!decoded || !decoded.username) {
      return NextResponse.json({ error: "অননুমোদিত প্রবেশ" }, { status: 401 });
    }

    // Parse pagination parameters
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10));
    const offset = (page - 1) * limit;

    // Fetch total logs count
    const countResult = await pool.query("SELECT COUNT(*) FROM activity_logs");
    const totalCount = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalCount / limit) || 1;

    // Fetch matching logs subset
    const { rows } = await pool.query(
      `SELECT id, admin_username AS "adminUsername", action, details, created_at AS "createdAt" 
       FROM activity_logs 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return NextResponse.json({
      logs: rows,
      totalCount,
      totalPages,
      currentPage: page,
      limit
    });
  } catch (error) {
    console.error("Activity Logs API error:", error);
    return NextResponse.json(
      { error: "অভ্যন্তরীণ সার্ভার ত্রুটি" },
      { status: 500 }
    );
  }
}
