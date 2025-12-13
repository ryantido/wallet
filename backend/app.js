import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connection } from "./config/db.js";
import { rateLimiter } from "./middlewares/rate-limit.js";
import { router as transactionsRoute } from "./routes/transactionsRoute.js";

dotenv.config();

const app = express();
app.use(cors());

app.use(rateLimiter);
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/transactions", transactionsRoute);

const PORT = process.env.PORT;

connection().then(() =>
  app.listen(PORT, () => console.log(`Server running on port ${PORT}.`))
);
