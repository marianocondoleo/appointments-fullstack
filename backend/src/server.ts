import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./prisma";
import authRoutes from "./routes/auth";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ===============================
// AUTH ROUTES
// ===============================
app.use("/auth", authRoutes);

// ===============================
// HEALTHCHECK
// ===============================
app.get("/health", async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as ok`;
    res.json({ status: "ok", db: result });
  } catch (error) {
    res.status(500).json({ status: "error", message: "DB connection failed" });
  }
});

// ===============================
// USERS
// ===============================
app.get("/users", async (req, res) => {
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
// APPOINTMENTS
// ===============================
app.post("/appointments", async (req, res) => {
  try {
    const { userId, date, notes } = req.body;

    if (!userId || !date) {
      return res.status(400).json({ error: "userId and date are required" });
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId,
        date: new Date(date),
        notes,
      },
    });

    res.status(201).json(appointment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/appointments", async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(appointments);
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
