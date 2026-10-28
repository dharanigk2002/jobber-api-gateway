import express, { type Router } from "express";

import { Health } from "../controllers/health.js";

class HealthRoute {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get("/gateway-health", Health.health);
    return this.router;
  }
}

export const healthRoute: HealthRoute = new HealthRoute();
