import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    const expectedSecret = process.env.REVALIDATE_SECRET || "super-secret-revalidate-token";

    if (secret !== expectedSecret) {
      return NextResponse.json({ error: "Invalid revalidation secret token" }, { status: 401 });
    }

    // Trigger on-demand cache revalidation for static routes
    revalidatePath("/");
    revalidatePath("/rashifal");
    console.log("On-demand ISR revalidation successfully triggered via Express webhook.");

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    console.error("Next.js revalidation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
