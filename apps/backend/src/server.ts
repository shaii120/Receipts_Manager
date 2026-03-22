import express from "express";
import 'dotenv/config';
import cors from "cors";

import receiptsRoutes from "./routes/receipts.routes.js";

const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors({
  origin: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: true
}));
app.use(express.json());

app.use("/receipts", receiptsRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
