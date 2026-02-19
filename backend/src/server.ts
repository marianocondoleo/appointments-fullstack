import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./prisma";

const app = express();

app.use(cors());
app.use(express.json());

// Healthcheck
app.get("/health", async (req, res) => {
  const result = await prisma.$queryRaw`SELECT 1 as ok`;
  res.json({ status: "ok", db: result });
});

// USERS
app.post("/users", async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: "email is required" });
    }

    const user = await prisma.user.create({
      data: { email, name },
    });

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

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

// APPOINTMENTS
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

    res.json(appointment);
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

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});
