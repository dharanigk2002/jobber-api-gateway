import type { Application } from "express";
import { healthRoute } from "./routes/health.js";

export const appRoutes = (app: Application) => {
  app.use("", healthRoute.routes());
};
