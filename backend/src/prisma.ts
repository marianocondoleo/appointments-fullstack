// src/prisma.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Con Prisma 7+ (modo "client") es necesario pasar un adapter o accelerateUrl.
// Aquí instanciamos el adapter Postgres con la `DATABASE_URL` del .env.
export const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});
