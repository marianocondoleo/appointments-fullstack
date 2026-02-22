import { Router } from "express";
import { prisma } from "../prisma";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// ==========================
// GET all appointments (protected)
// ==========================
router.get("/", authMiddleware, async (req: any, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { userId: req.userId },
      orderBy: { date: "asc" },
    });

    res.json(appointments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================
// CREATE appointment (protected)
// ==========================
router.post("/", authMiddleware, async (req: any, res) => {
  try {
    const { date, notes } = req.body;

    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(date),
        notes,
        userId: req.userId,
      },
    });

    res.status(201).json(appointment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
