import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import pool from "@/lib/db";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("astro_session");
    
    let username = "unknown";
    if (tokenCookie && tokenCookie.value) {
      const decoded = verifyToken(tokenCookie.value);
      if (decoded && decoded.username) {
        username = decoded.username;
      }
    }

    // Clear the HTTP-only session cookie
    cookieStore.set("astro_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0, // Expired immediately
    });

    if (username !== "unknown") {
      // Log logout event
      await pool.query(
        "INSERT INTO activity_logs (admin_username, action, details) VALUES ($1, $2, $3)",
        [username, "LOGOUT", "লগআউট করা হয়েছে"]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
