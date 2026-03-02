import express from "express";
import 'dotenv/config';
import cors from "cors";

import { PrismaClient } from "@prisma/client";
import { PrismaMssql } from "@prisma/adapter-mssql";
import { ReceiptCreateSchema } from "../prisma/generated/zod/index.js";

const PORT = process.env.PORT || 3001;
const adapter = new PrismaMssql(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });
const app = express();
app.use(cors({
  origin: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: true
}));
app.use(express.json());

app.post("/receipts", async (req, res) => {
  try {
    const parsedData = ReceiptCreateSchema.parse(req.body);
    const receipt = await prisma.receipt.create({ data: parsedData });
    res.json(receipt);
  } catch (err: Error | any) {
    console.error(err.message);
    console.log(err.errors);
    res.status(400).json({ error: err.message });
  }
});

app.get("/receipts", async (_req, res) => {
  const all = await prisma.receipt.findMany();
  res.json(all);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
