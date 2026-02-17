import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { healthRouter } from "./routes/health.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/health", healthRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
