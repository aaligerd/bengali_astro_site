import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/jwt";

export async function POST(request) {
  try {
    // 1. Authenticate calling admin
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("astro_session");

    if (!tokenCookie || !tokenCookie.value) {
      return NextResponse.json({ error: "অননুমোদিত প্রবেশ" }, { status: 401 });
    }

    const decoded = verifyToken(tokenCookie.value);
    if (!decoded || !decoded.username) {
      return NextResponse.json({ error: "অননুমোদিত প্রবেশ" }, { status: 401 });
    }

    const callerUsername = decoded.username;

    // 2. Parse request body
    const { username, password } = await request.json();

    if (!username || !password || username.trim().length < 3 || password.length < 6) {
      return NextResponse.json(
        { error: "ইউজারনেম কমপক্ষে ৩ অক্ষরের এবং পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" },
        { status: 400 }
      );
    }

    const newUsername = username.trim().toLowerCase();

    // 3. Check if username already exists
    const checkUserResult = await pool.query(
      "SELECT id FROM admins WHERE username = $1",
      [newUsername]
    );

    if (checkUserResult.rows.length > 0) {
      return NextResponse.json(
        { error: "ইউজারনেমটি ইতিমধ্যে বিদ্যমান" },
        { status: 400 }
      );
    }

    // 4. Hash the password and save
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO admins (username, password_hash) VALUES ($1, $2)",
      [newUsername, hashedPassword]
    );

    // 5. Log activity
    await pool.query(
      "INSERT INTO activity_logs (admin_username, action, details) VALUES ($1, $2, $3)",
      [
        callerUsername,
        "CREATE_ADMIN",
        `নতুন অ্যাডমিন তৈরি করা হয়েছে: ${newUsername}`,
      ]
    );

    return NextResponse.json({
      success: true,
      message: `অ্যাডমিন '${newUsername}' সফলভাবে তৈরি করা হয়েছে`,
    });
  } catch (error) {
    console.error("Create Admin API error:", error);
    return NextResponse.json(
      { error: "অভ্যন্তরীণ সার্ভার ত্রুটি" },
      { status: 500 }
    );
  }
}
