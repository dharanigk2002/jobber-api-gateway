import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  BadRequestError,
  NotAuthorizedError,
  type IAuthPayload,
} from "@dharanigk2002/jobber-shared";
import { config } from "../config.js";

class AuthMiddleware {
  public verifyUser(req: Request, _res: Response, next: NextFunction) {
    if (!req.session?.jwt) {
      throw new NotAuthorizedError(
        "Token is not available. Please login again",
        "GatewayService verifyUser() method error",
      );
    }
    try {
      const payload: IAuthPayload = jwt.verify(
        req.session.jwt,
        config.JWT_TOKEN,
      ) as IAuthPayload;
      req.currentUser = payload;
    } catch (error) {
      throw new NotAuthorizedError(
        "Token is not available. Please login again",
        "GatewayService verifyUser() method invalid session error",
      );
    }
    next();
  }

  public checkAuthentication(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void {
    if (!req.currentUser) {
      throw new BadRequestError(
        "Authentication is required to access this route",
        "GatewayService checkAuthentication() method error",
      );
    }
    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
