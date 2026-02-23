// backend/src/server.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./prisma";
import authRoutes from "./routes/auth";
import tasksRoutes from "./routes/tasks"; 

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ===============================
// AUTH ROUTES
// ===============================
app.use("/auth", authRoutes);

// ===============================
// TASKS ROUTES
// ===============================
app.use("/tasks", tasksRoutes);

// ===============================
// HEALTHCHECK
// ===============================
app.get("/health", async (_req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as ok`;
    res.json({ status: "ok", db: result });
  } catch (error) {
    res.status(500).json({ status: "error", message: "DB connection failed" });
  }
});

// ===============================
// USERS ROUTES
// ===============================
app.get("/users", async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});



// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});
