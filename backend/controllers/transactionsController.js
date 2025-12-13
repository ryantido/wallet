import { pool } from "../config/db.js";

export const getTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const query =
      "SELECT * FROM transactions WHERE user_id = $1 ORDER BY create_at DESC";
    const values = [userId];
    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching transactions: ", error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

export const getSummary = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const query =
      "SELECT COALESCE(SUM(CASE WHEN category = 'income' THEN amount ELSE 0 END), 0) AS total_income, COALESCE(SUM(CASE WHEN category = 'expense' THEN amount ELSE 0 END), 0) AS total_expense FROM transactions WHERE user_id = $1";
    const values = [userId];
    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error while summarizing transactions: ", error);
    res.status(500).json({ message: "Failed to summarize transactions" });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { user_id, title, amount, category } = req.body;
    if (!user_id || !title || amount === undefined || !category) {
      return res.status(400).json({ message: "All fields must be filled !" });
    }
    const query =
      "INSERT INTO transactions(user_id, title, amount, category) VALUES($1, $2, $3, $4)";
    const values = [user_id, title, amount, category];
    await pool.query(query, values);
    res.status(201).json({ message: "Transaction created successfully" });
  } catch (error) {
    console.error("Error creating transaction: ", error);
    res.status(500).json({ message: "Failed to create transaction" });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Transaction ID is required" });
    }
    const query = "DELETE FROM transactions WHERE id = $1";
    const values = [id];
    await pool.query(query, values);
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction: ", error);
    res.status(500).json({ message: "Failed to delete transaction" });
  }
};
