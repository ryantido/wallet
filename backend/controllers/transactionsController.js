import { pool } from "../config/db.js";

export const getTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const rows = await pool`
    SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY create_at DESC
    `;
    res.status(200).json(rows);
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
    const rows = await pool`
    SELECT 
      COALESCE(SUM(CASE WHEN category = 'income' THEN amount ELSE 0 END), 0) AS total_income,
      COALESCE(SUM(CASE WHEN category = 'expense' THEN amount ELSE 0 END), 0) AS total_expense
    FROM transactions
    WHERE user_id = ${userId}
    `;
    const summary = rows[0] || { total_income: 0, total_expense: 0 };
    res.status(200).json(summary);
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
    const rows = await pool`
    INSERT INTO transactions(user_id, title, amount, category)
    VALUES(${user_id}, ${title}, ${amount}, ${category})
    RETURNING *
    `;
    const created = rows[0];
    res.status(201).json(created);
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
    const rows = await pool`
    DELETE FROM transactions WHERE id = ${id} RETURNING *
    `;
    const deleted = rows[0];
    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted successfully", deleted });
  } catch (error) {
    console.error("Error deleting transaction: ", error);
    res.status(500).json({ message: "Failed to delete transaction" });
  }
};
