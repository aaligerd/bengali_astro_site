import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import defaultData from "@/data/zodiacData.json";

export const dynamic = "force-dynamic";

const filePath = path.join(process.cwd(), "src", "data", "zodiacData.json");

export async function GET() {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(fileContent));
  } catch (error) {
    console.error("Error reading zodiac data file:", error);
    return NextResponse.json(defaultData);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { passcode, data } = body;

    // Verify passcode
    if (passcode !== "admin123") {
      return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
    }

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid zodiac data format" }, { status: 400 });
    }

    // Save to file
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

    return NextResponse.json({ success: true, message: "Zodiac data updated successfully on server" });
  } catch (error) {
    console.error("Error writing zodiac data file:", error);
    return NextResponse.json(
      { 
        error: "Failed to write data to server", 
        details: error.message,
        isWriteProtected: true
      },
      { status: 500 }
    );
  }
}
