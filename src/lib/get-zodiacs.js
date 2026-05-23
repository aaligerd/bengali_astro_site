import defaultData from "@/data/zodiacData.json";

export async function getZodiacs() {
  try {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";

    const response = await fetch(`${backendUrl}/api/horoscope`, {
      next: { revalidate: 3600 } // Enable caching with 1-hour ISR revalidation
    });

    if (response.ok) {
      return await response.json();
    }

    console.warn("Backend API returned non-ok status. Falling back to static JSON.");
    return defaultData;
  } catch (error) {
    console.error("Error fetching zodiacs from backend, falling back to static JSON:", error);
    return defaultData;
  }
}

