import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});
