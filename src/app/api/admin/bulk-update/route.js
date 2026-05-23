import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { revalidatePath } from "next/cache";

// Custom CSV Parser to handle double quotes, commas, and newlines inside cell fields
function parseCSV(text) {
  const lines = [];
  let row = [""];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"'; // escaped double quote
        i++;
      } else {
        inQuotes = !inQuotes; // toggle quotes mode
      }
    } else if (c === ',' && !inQuotes) {
      row.push("");
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') {
        i++;
      }
      lines.push(row);
      row = [""];
    } else {
      row[row.length - 1] += c;
    }
  }
  if (row.length > 1 || row[0] !== "") {
    lines.push(row);
  }
  return lines;
}

export async function POST(request) {
  try {
    // 1. Authenticate admin user
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

    // 2. Read raw CSV text
    const csvText = await request.text();
    if (!csvText || csvText.trim() === "") {
      return NextResponse.json({ error: "CSV ফাইলটি খালি!" }, { status: 400 });
    }

    // 3. Parse CSV rows
    const rows = parseCSV(csvText);
    if (rows.length < 2) {
      return NextResponse.json({ error: "CSV ফাইলে কোনো ডেটা রো পাওয়া যায়নি!" }, { status: 400 });
    }

    const headers = rows[0].map(h => h.trim().toLowerCase());
    
    // Validate required columns
    const requiredColumns = ["id", "name", "englishname", "daily", "weekly", "monthly", "yearly"];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    if (missingColumns.length > 0) {
      return NextResponse.json(
        { error: `CSV ফাইলে প্রয়োজনীয় কলাম অনুপস্থিত: ${missingColumns.join(", ")}` },
        { status: 400 }
      );
    }

    const colIdx = (name) => headers.indexOf(name);

    const zodiacData = [];
    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      // Skip empty lines
      if (row.length === 1 && row[0] === "") continue;
      
      const id = row[colIdx("id")]?.trim().toLowerCase();
      if (!id) {
        return NextResponse.json({ error: `লাইন নম্বর ${r + 1}: 'id' কলামটি খালি হতে পারবে না!` }, { status: 400 });
      }

      const name = row[colIdx("name")]?.trim();
      const englishName = row[colIdx("englishname")]?.trim() || id.charAt(0).toUpperCase() + id.slice(1);
      
      if (!name) {
        return NextResponse.json({ error: `লাইন নম্বর ${r + 1}: 'name' (রাশির বাংলা নাম) কলামটি খালি হতে পারবে না!` }, { status: 400 });
      }

      // Construct horoscope JSON
      const horoscope = {
        daily: row[colIdx("daily")] || "",
        weekly: row[colIdx("weekly")] || "",
        monthly: row[colIdx("monthly")] || "",
        yearly: row[colIdx("yearly")] || ""
      };

      zodiacData.push({
        id,
        name,
        englishName,
        symbol: row[colIdx("symbol")] || "",
        dateBengali: row[colIdx("datebengali")] || "",
        element: row[colIdx("element")] || "",
        ruler: row[colIdx("ruler")] || "",
        stone: row[colIdx("stone")] || "",
        image: row[colIdx("image")] || "",
        horoscope,
        love: row[colIdx("love")] || "",
        career: row[colIdx("career")] || "",
        wealth: row[colIdx("wealth")] || "",
        business: row[colIdx("business")] || ""
      });
    }

    if (zodiacData.length === 0) {
      return NextResponse.json({ error: "CSV ফাইলে কোনো প্রসেস করার মতো রাশির ডেটা পাওয়া যায়নি!" }, { status: 400 });
    }

    // 4. Update in Database inside a single transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      for (const sign of zodiacData) {
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

    // 5. Log activity audit
    await pool.query(
      "INSERT INTO activity_logs (admin_username, action, details) VALUES ($1, $2, $3)",
      [
        callerUsername,
        "BULK_UPDATE_CSV",
        `সিএসভি (CSV) ফাইল আপলোড করে মোট ${zodiacData.length}টি রাশির তথ্য বাল্ক আপডেট করা হয়েছে`,
      ]
    );

    // 6. Trigger on-demand ISR revalidation
    try {
      revalidatePath("/");
      revalidatePath("/rashifal");
    } catch (revalError) {
      console.error("ISR revalidation failed:", revalError);
    }

    return NextResponse.json({
      success: true,
      message: `সফলভাবে সিএসভি (CSV) ফাইল থেকে ${zodiacData.length}টি রাশির তথ্য আপডেট করা হয়েছে!`,
    });
  } catch (error) {
    console.error("Bulk CSV update error:", error);
    return NextResponse.json(
      { error: "সিএসভি ফাইল প্রসেস করতে ব্যর্থ হয়েছে", details: error.message },
      { status: 500 }
    );
  }
}
