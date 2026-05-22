import { useState, useEffect } from "react";
import { zodiacData as staticZodiacData } from "@/data/zodiacData";

export function useZodiacData() {
  const [data, setData] = useState(staticZodiacData);

  useEffect(() => {
    // 1. Check local storage first (instant client-side load)
    const localData = localStorage.getItem("astro_zodiac_data");
    if (localData) {
      try {
        setData(JSON.parse(localData));
      } catch (e) {
        console.error("Error parsing local zodiac data:", e);
      }
    }

    // 2. Fetch fresh data from the server API
    async function fetchZodiacData() {
      try {
        const response = await fetch("/api/horoscope");
        if (response.ok) {
          const freshData = await response.json();
          if (Array.isArray(freshData) && freshData.length > 0) {
            setData(freshData);
            localStorage.setItem("astro_zodiac_data", JSON.stringify(freshData));
          }
        }
      } catch (error) {
        console.error("Error fetching zodiac data from API:", error);
      }
    }

    fetchZodiacData();
  }, []);

  return data;
}
