import "dotenv/config";
import { neon } from "@neondatabase/serverless";

export const pool = neon(process.env.DATABASE_URL);

export async function connection() {
  try {
    await pool`
        CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            create_at DATE NOT NULL DEFAULT CURRENT_DATE
        )
    `;
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization failed: ", error);
    process.exit(1);
  }
}
