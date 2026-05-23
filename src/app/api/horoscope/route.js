import { NextResponse } from "next/server";
import { getZodiacs } from "@/lib/get-zodiacs";
import pool from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getZodiacs();
  return NextResponse.json(data);
}

export async function POST(request) {
  try {
    // 1. Authenticate caller
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

    const body = await request.json();
    const { data } = body;

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid zodiac data format" }, { status: 400 });
    }

    // Connect to pool and update in a transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      for (const sign of data) {
        await client.query(
          `INSERT INTO zodiacs (
            id, name, english_name, symbol, date_bengali, element, ruler, stone, image, horoscope, love, career, wealth, business
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            english_name = EXCLUDED.english_name,
            symbol = EXCLUDED.symbol,
            date_bengali = EXCLUDED.date_bengali,
            element = EXCLUDED.element,
            ruler = EXCLUDED.ruler,
            stone = EXCLUDED.stone,
            image = EXCLUDED.image,
            horoscope = EXCLUDED.horoscope,
            love = EXCLUDED.love,
            career = EXCLUDED.career,
            wealth = EXCLUDED.wealth,
            business = EXCLUDED.business,
            updated_at = NOW()`,
          [
            sign.id,
            sign.name,
            sign.englishName,
            sign.symbol,
            sign.dateBengali,
            sign.element,
            sign.ruler,
            sign.stone,
            sign.image,
            JSON.stringify(sign.horoscope),
            sign.love,
            sign.career,
            sign.wealth,
            sign.business
          ]
        );
      }
      await client.query("COMMIT");
    } catch (dbError) {
      await client.query("ROLLBACK");
      throw dbError;
    } finally {
      client.release();
    }

    // Log the modifications to the database logs
    await pool.query(
      "INSERT INTO activity_logs (admin_username, action, details) VALUES ($1, $2, $3)",
      [
        callerUsername,
        "UPDATE_HOROSCOPE",
        "রাশিফল এবং রাশির অন্যান্য তথ্য সংশোধন করা হয়েছে",
      ]
    );

    // Trigger on-demand ISR revalidation for homepage and details page
    try {
      revalidatePath("/");
      revalidatePath("/rashifal");
      console.log("On-demand ISR revalidation triggered for / and /rashifal");
    } catch (revalError) {
      console.error("ISR revalidation failed:", revalError);
    }

    return NextResponse.json({ success: true, message: "Zodiac data updated successfully in database" });
  } catch (error) {
    console.error("Error writing zodiac data to database:", error);
    return NextResponse.json(
      { 
        error: "Failed to write data to database", 
        details: error.message
      },
      { status: 500 }
    );
  }
}
