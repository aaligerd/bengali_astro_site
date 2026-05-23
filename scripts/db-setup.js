const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

// Manually parse .env.local to avoid adding external dependencies
function loadEnv() {
  try {
    const envPath = path.join(__dirname, "..", ".env.local");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf8");
      content.split("\n").forEach((line) => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let val = match[2] || "";
          if (val.startsWith('"') && val.endsWith('"')) {
            val = val.substring(1, val.length - 1);
          } else if (val.startsWith("'") && val.endsWith("'")) {
            val = val.substring(1, val.length - 1);
          }
          process.env[key] = val.trim();
        }
      });
      console.log("Loaded environment variables from .env.local");
    } else {
      console.warn(".env.local file not found at " + envPath);
    }
  } catch (err) {
    console.error("Error loading .env.local:", err);
  }
}

async function setupDatabase() {
  loadEnv();

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("Error: DATABASE_URL is not set in environment or .env.local");
    process.exit(1);
  }

  console.log("Connecting to PostgreSQL database...");
  const pool = new Pool({ connectionString });

  try {
    // Test the database connection
    await pool.query("SELECT NOW()");
    console.log("Database connection successful.");

    // Create the zodiacs table
    console.log("Creating table 'zodiacs' if it does not exist...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS zodiacs (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        english_name VARCHAR(100) NOT NULL,
        symbol VARCHAR(10),
        date_bengali VARCHAR(100),
        element VARCHAR(100),
        ruler VARCHAR(100),
        stone VARCHAR(100),
        image TEXT,
        horoscope JSONB NOT NULL,
        love TEXT,
        career TEXT,
        wealth TEXT,
        business TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Table 'zodiacs' is ready.");

    // Create the admins table
    console.log("Creating table 'admins' if it does not exist...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Table 'admins' is ready.");

    // Create the activity_logs table
    console.log("Creating table 'activity_logs' if it does not exist...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        admin_username VARCHAR(50) NOT NULL,
        action VARCHAR(100) NOT NULL,
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Table 'activity_logs' is ready.");

    // Seed default admin account
    console.log("Checking if default admin exists...");
    const adminCheck = await pool.query("SELECT * FROM admins WHERE username = $1", ["admin"]);
    if (adminCheck.rows.length === 0) {
      console.log("Seeding default admin...");
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await pool.query(
        "INSERT INTO admins (username, password_hash) VALUES ($1, $2)",
        ["admin", hashedPassword]
      );
      console.log("Default admin seeded successfully: username='admin', password='admin123'");
    } else {
      console.log("Default admin already exists.");
    }

    // Read the static JSON file and seed zodiacs if they aren't seeded
    console.log("Reading zodiacData.json...");
    const jsonPath = path.join(__dirname, "..", "src", "data", "zodiacData.json");
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

    console.log(`Seeding database with ${jsonData.length} zodiac signs...`);
    for (const sign of jsonData) {
      await pool.query(
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
      console.log(`Seeded sign: ${sign.englishName} (${sign.name})`);
    }

    console.log("Database setup and seeding completed successfully!");
  } catch (error) {
    console.error("Database setup failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
