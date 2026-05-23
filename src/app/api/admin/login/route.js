import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import pool from "@/lib/db";
import { signToken } from "@/lib/jwt";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Query database for admin
    const { rows } = await pool.query(
      "SELECT * FROM admins WHERE username = $1",
      [username.trim().toLowerCase()]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const admin = rows[0];

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, admin.password_hash);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Sign session token
    const token = signToken({
      id: admin.id,
      username: admin.username,
    });

    // Set HTTP-only session cookie
    const cookieStore = await cookies();
    cookieStore.set("astro_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    // Log the successful login activity
    await pool.query(
      "INSERT INTO activity_logs (admin_username, action, details) VALUES ($1, $2, $3)",
      [admin.username, "LOGIN", "সফলভাবে লগইন করা হয়েছে"]
    );

    return NextResponse.json({
      success: true,
      username: admin.username,
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
