import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getSummary,
  getTransactions,
} from "../controllers/transactionsController.js";

export const router = express.Router();

router.get("/:userId", getTransactions);

router.get("/summary/:userId", getSummary);

router.post("/", createTransaction);

router.delete("/:id", deleteTransaction);
