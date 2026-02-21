import { Router } from "express";
import { prisma } from "../prisma";
import bcrypt from "bcrypt";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, phone, address, email, password } = req.body;

    // Validar campos
    if (!firstName || !lastName || !phone || !address || !email || !password) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        phone,
        address,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "Usuario creado correctamente",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

export default router;
