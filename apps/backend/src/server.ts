import express from "express";
import 'dotenv/config';
import cors from "cors";
import cookieParser from "cookie-parser";

import { errorMiddleware } from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import receiptsRoutes from "./routes/receipts.routes.js";
import projectsRoutes from "./routes/projects.routes.js";
import currenciesRoutes from "./routes/currencies.routes.js";
import usersRoutes from "./routes/users.routes.js";

const PORT = process.env.PORT || 3001;
const app = express();

//Middleware setup
app.use(cors({
  origin: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
// Routes setup
app.use("/auth", authRoutes);
app.use("/receipts", receiptsRoutes);
app.use("/projects", projectsRoutes);
app.use("/currencies", currenciesRoutes);
app.use("/users", usersRoutes);
// Error handling middleware
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
