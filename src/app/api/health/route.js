import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          status: "unhealthy",
          database: "disconnected",
          reason: "DATABASE_URL environment variable is not set."
        },
        { status: 500 }
      );
    }

    // Run a test query to verify connection
    const start = Date.now();
    const result = await pool.query("SELECT NOW() as now");
    const duration = Date.now() - start;

    return NextResponse.json(
      {
        status: "healthy",
        database: "connected",
        latencyMs: duration,
        dbTime: result.rows[0].now
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database health check failed:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "error",
        error: error.message
      },
      { status: 500 }
    );
  }
}
