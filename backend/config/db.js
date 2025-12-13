import { Pool } from "pg";
import "dotenv/config";

export const pool = new Pool({
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
});

export async function connection() {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            create_at DATE NOT NULL DEFAULT CURRENT_DATE
        )
    `);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization failed: ", error);
    process.exit(1);
  }
}
