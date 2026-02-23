// routes/tasks.ts
import { Router } from "express";
import { prisma } from "../prisma";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

// GET /tasks -> traer solo tareas del usuario logueado
router.get("/", async (req: any, res) => {
  try {
    const userId = req.userId; // <-- cambio aquí
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al traer tareas" });
  }
});

// POST /tasks -> crear tarea asociada al usuario logueado
router.post("/", async (req: any, res) => {
  try {
    const { title, notes, deadline, status, priority } = req.body;
    const userId = req.userId; // <-- cambio aquí

    const task = await prisma.task.create({
      data: {
        title,
        notes,
        deadline: new Date(deadline),
        status,
        priority,
        userId,
      },
    });

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al crear tarea" });
  }
});

// PUT /tasks/:id
router.put("/:id", async (req: any, res) => {
  try {
    const { id } = req.params;
    const { title, notes, deadline, status, priority } = req.body;
    const userId = req.userId;

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const task = await prisma.task.update({
      where: { id },
      data: { title, notes, deadline: new Date(deadline), status, priority },
    });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar tarea" });
  }
});

// DELETE /tasks/:id
router.delete("/:id", async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return res.status(403).json({ message: "No autorizado" });
    }

    await prisma.task.delete({ where: { id } });
    res.json({ message: "Tarea eliminada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al eliminar tarea" });
  }
});

export default router;
