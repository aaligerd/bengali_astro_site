import pool from "./db";
import defaultData from "@/data/zodiacData.json";

export async function getZodiacs() {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn("DATABASE_URL is not configured. Falling back to static JSON.");
      return defaultData;
    }

    const { rows } = await pool.query(
      `SELECT id, name, english_name AS "englishName", symbol, date_bengali AS "dateBengali",
              element, ruler, stone, image, horoscope, love, career, wealth, business
       FROM zodiacs`
    );

    if (!rows || rows.length === 0) {
      console.warn("Zodiacs database table is empty. Falling back to static JSON.");
      return defaultData;
    }

    // Traditional zodiac signs ordering list
    const order = [
      "Aries",
      "Taurus",
      "Gemini",
      "Cancer",
      "Leo",
      "Virgo",
      "Libra",
      "Scorpio",
      "Sagittarius",
      "Capricorn",
      "Aquarius",
      "Pisces"
    ];

    rows.sort((a, b) => order.indexOf(a.englishName) - order.indexOf(b.englishName));
    return rows;
  } catch (error) {
    console.error("Error querying zodiacs from database, falling back to static JSON:", error);
    return defaultData;
  }
}
