import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("astro_session");

    if (!tokenCookie || !tokenCookie.value) {
      return NextResponse.json({ authenticated: false });
    }

    const decoded = verifyToken(tokenCookie.value);
    if (!decoded || !decoded.username) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      username: decoded.username,
    });
  } catch (error) {
    console.error("Session API error:", error);
    return NextResponse.json(
      { error: "Internal server error", authenticated: false },
      { status: 500 }
    );
  }
}
