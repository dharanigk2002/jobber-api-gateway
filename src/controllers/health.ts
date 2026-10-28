import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class Health {
  public static health(_req: Request, res: Response) {
    return res
      .status(StatusCodes.OK)
      .send("API gateway service is up and running");
  }
}
